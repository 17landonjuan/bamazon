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
    start();
});

function start() {
    connection.query('SELECT * FROM products', function (err, results) {
        if (err) throw (err);

        inquirer
            .prompt(
                {
                    name: "welcome",
                    type: 'list',
                    message: 'Welcome to Bamazon! How can I help you?',
                    choices: ["Browse", "Exit"]
                })
            .then(function (answer) {
                if (answer.welcome === "Browse") {
                    showItem();
                }
                else (answer.welcome === 'Exit')
                connection.end();
            }
            );

        function showItem() {
            // query the database for all items being auctioned
            connection.query("SELECT * FROM products", function (err, results) {
                if (err) throw err;
                // once you have the items, prompt the user for which they'd like to bid on
                inquirer
                    .prompt([
                        {
                            name: "choice",
                            type: "rawlist",
                            choices: function () {
                                var choiceArray = [];
                                for (var i = 0; i < results.length; i++) {
                                    choiceArray.push(results[i].item_name);
                                }
                                return choiceArray;
                            },
                            message: "What product would you like to purchase",
                        },
                        {
                            name: "buy",
                            type: "input",
                            message: "How many would you like to buy?"
                        }
                    ])
                    .then(function (answer) {
                        // get the information of the chosen item
                        var chosenItem;
                        for (var i = 0; i < results.length; i++) {
                            if (results[i].item_name === answer.choice) {
                                chosenItem = results[i];
                            }
                        }

                        // determine if bid was high enough
                        if (chosenItem.stock_quantity < parseInt(answer.buy)) {
                            return ('Your purchase will cost: '(price * answer.buy))
                        }
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: parseInt(stock_quantity - answer.buy)
                                },
                                {
                                    item_id: chosenItem.item_id
                                }
                            ],
                            function (error) {
                                if (error) throw err;
                                console.log("Bid placed successfully!");
                                start();
                            }
                        );
                    })
            })
        }
    })
};