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

con.connect(function (err) {
    if (err) throw err;
    start();
});
connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});
// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "welcome",
            type: "list",
            message: "Welcome to Bamazon! How can I help you?",
            choices: ["Browse", "Place_Order", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.welcome === "Browse") {
                openCatalog();
            }
            else if (answer.welcome === "Place_Order") {
                purchaseItem();
            } else {
                connection.end();
            }
        });
}
function openCatalog() {
    // query the database for all items being auctioned
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
        .prompt([
            {
                name: "choice",
                type: "input",
                message: "What is the item_id o f the product you'd like to purchase?",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].item_id);
                    }
                    return choiceArray;
                },
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
            }
            //         choices: function () {
            //             var choiceArray = [];
            //             for (var i = 0; i < results.length; i++) {
            //                 choiceArray.push(results[i].item_id);
            //             }
            //             return choiceArray;
            //         },
            //         message: "What auction would you like to place a bid in?"
            //     },
            //     {
            //         name: "bid",
            //         type: "input",
            //         message: "How much would you like to bid?"
            //     }
            // ])
            // .then(function (answer) {
            //   // get the information of the chosen item
            //   var chosenItem;
            //   for (var i = 0; i < results.length; i++) {
            //     if (results[i].item_name === answer.choice) {
            //       chosenItem = results[i];
            //     }
            //   }

            //   // determine if bid was high enough
            //   if (chosenItem.highest_bid < parseInt(answer.bid)) {
            //     // bid was high enough, so update db, let the user know, and start over
            //     connection.query(
            //       "UPDATE auctions SET ? WHERE ?",
            //       [
            //         {
            //           highest_bid: answer.bid
            //         },
            //         {
            //           id: chosenItem.id
            //         }
            //       ],
            //       function (error) {
            //         if (error) throw err;
            //         console.log("Bid placed successfully!");
            //         start();
            //       }
            //     );
            //   }
            //   else {
            //     // bid wasn't high enough, so apologize and start over
            //     console.log("Your bid was too low. Try again...");
            //     start();
            //   }
            // });
            // });
            // // connection.connect(function (err) {
            // //     if (err) throw err;
            // //     // run the start function after the connection is made to prompt the user


            // function start() {
            //     inquirer
            //         .prompt([{
            //             name: "item_id",
            //             type: "input",
            //             message: "What is the ID of the item you would like to purchase?",

            //         },

            //         ])
            //         .then(answers => {
            //            var answers = "item_id";
            //             console.info(answers.choice)
            //         })
            //         .then(function (answers) {
            //             // get the information of the chosen item
            //             var chosenItem = answers;
            //             for (var i = 0; i < results.length; i++) {
            //               if (results[i].item_id === answers.choice) {
            //                 chosenItem = results[i];
            //               }
            //             }

            //             // determine if bid was high enough
            //             if (chosenItem. < parseInt(answer.bid)) {
            //               // bid was high enough, so update db, let the user know, and start over
            //               connection.query(
            //                 "UPDATE auctions SET ? WHERE ?",
            //                 [
            //                   {
            //                     highest_bid: answer.bid
            //                   },
            //                   {
            //                     id: chosenItem.id
            //                   }
            //                 ],
            //                 function (error) {
            //                   if (error) throw err;
            //                   console.log("Bid placed successfully!");
            //                   start();
            //                 }
            //               );
            //             }
            //             start()
            //                 .then(function (answer) {
            //                     // get the information of the chosen item
            //                     var itemStock;
            //                     for (var i = 0; i < results.length; i++) {
            //                         if (results[i].itemStock === answer.item_id) {
            //                             itemStock = results[i];

            //                         }

            //                         start()
            //                             .then(answers => {
            //                                 if (answers === item_id)
            //                                     return ("product_name", "price", "stock_quantity"),
            //                                         console.log(answers.item_id, "product_name", "price", "stock_quantity")

            //                             })
            //                     }
            //                 })
            //         )
            // }}}
        ],

        )
}

