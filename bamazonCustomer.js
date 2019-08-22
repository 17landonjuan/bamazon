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
    con.query("SELECT * FROM products", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});
function start() {
    inquirer
        .prompt([{
            name: "item_id",
            type: "input",
            message: "What is the ID of the item you would like to purchase?",

        },

        ])
        .then(answers => {
            console.info('Answer', answers.item_id)
        })

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
}