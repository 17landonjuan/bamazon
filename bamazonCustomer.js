var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "futbol17",
    database: "bamazonDB"
});
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "futbol17",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    showItems();
});
var chosenItem = {};
var resetApp = function () {
    chosenItem = [];
}

var showItems = function () {
    connection.query('SELECT * FROM products', function (err, results) {
        if (err) throw (err);

        inquirer.prompt([
            {
                name: "choice",
                type: 'rawlist',
                choices: function () {
                    var chosenItem = [];
                    for (var i = 0; i < results.length; i++) {
                        chosenItem.push([results[i].item_id, results[i].product_name, results[i].department_name, '$${results[i].price}']);
                    }
                    return chosenItem;
                }
            },])
        console.log(`\n\n${chosenItem.toString()}\n\n`);
        // ask user to enter ID of item they wish to purchase
        askForID();
    });

    var askForID = function () {
        inquirer.prompt({
            name: 'itemID',
            type: 'input',
            message: 'Enter the ID of the item you would like to purchase:',
            // validate input is number from 1-10
            validate: (value) => {
                if (!isNaN(value) && (value > 99 && value <= 111)) {
                    return true;
                } else {
                    console.log(' => Please enter a number from 1-10');
                    return false;
                }
            }
            // select all rows where ID = user's input
        }).then((answer) => {
            connection.query('SELECT item_id, product_name, department_name, price, stock_quantity, FROM products WHERE ?', { item_id: answer.itemID }, (err, res) => {
                // confirm with user that this is the product they'd like to purchase
                confirmItem(res[0].product_name, res);
            });
        });
    };

    var confirmItem = function (product, object) {
        inquirer.prompt({
            name: 'confirmItem',
            type: 'confirm',
            message: `You chose` + (` '${product}'. `) + `Is this correct?`
        }).then((answer) => {
            if (answer.confirmItem) {
                chosenItem = {
                    item_id: object[0].item_id,
                    product_name: object[0].product_name,
                    department_name: object[0].department_name,
                    price: object[0].price,
                    stock_quantity: object[0].stock_quantity,

                };
                // ask how many they'd like to purchase
                askHowMany(chosenItem.item_id);
            } else {
                askForID();
            }
        });
    };

    // function to ask user how many of the products they'd like to purchase
    var askHowMany = function (chosenID) {
        inquirer.prompt({
            name: 'howMany',
            type: 'input',
            message: 'How many would you like to purchase?',
            validate: (value) => {
                if (!isNaN(value) && value > 0) {
                    return true;
                } else {
                    console.log(' => Oops, please enter a number greater than 0');
                    return false;
                }
            }
        }).then((answer) => {
            connection.query('SELECT stock_quantity FROM products WHERE ?', { item_id: chosenItem.item_id }, (err, res) => {
                // if there are not enough products in stock
                if (res[0].stock_quantity < answer.howMany) {
                    console.log('\n\tSorry, insufficient quantity in stock!\n');
                    // confirm if user would still like to buy this product
                    inquirer.prompt({
                        name: 'proceed',
                        type: 'confirm',
                        message: 'Would you still like to purchase this product?'
                    }).then((answer) => {
                        if (answer.proceed) {
                            askHowMany(chosenItem.item_id);
                        } else {
                            console.log('\n\tThanks for visiting! We hope to see you again soon.\n');
                            connection.end();
                        }
                    });
                    // if there are enough products in stock for purchase to go through
                } else {
                    chosenItem.howMany = answer.howMany;
                    console.log('\n\tOrder processing...');
                    // console.log(chosenItem);

                    // update database to reflect new stock quantity after sale
                    connection.query('UPDATE products SET ? WHERE ?', [
                        {
                            stock_quantity: chosenItem.stock_quantity - answer.howMany,
                            product_sales: chosenItem.product_sales + (chosenItem.price * answer.howMany)
                        },
                        {
                            item_id: chosenItem.item_id
                        }
                    ], (err, res) => {
                        console.log(`\n\tOrder confirmed!!! Your total was $${(chosenItem.price * chosenItem.howMany).toFixed(2)}.\n`);
                        // ask if user would like to make another purchase
                        promptNewPurchase();
                    });
                }
            });
        });
    }

    // function to ask if user would like to make another purchase
    var promptNewPurchase = function () {
        inquirer.prompt({
            name: 'newPurchase',
            type: 'confirm',
            message: 'Would you like to make another purchase?'
        }).then((answer) => {
            if (answer.newPurchase) {
                resetCart();
                askForID();
            } else {
                console.log('\n\tWe appreciate your business. Have a great day!\n');
                connection.end();
            }
        });
    }
};