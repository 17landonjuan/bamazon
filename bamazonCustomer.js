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
        .prompt({
            name: "item_id",
            type: "input",
            message: "What is the ID of the item you would like to purchase?",

        })
        .then(answers => {
            console.info('Answer:', answers.item_id)
        })
};
// function start() {
    // inquirer
        // .prompt({
            // name: "quantity",
            // type: "input",
            // message: "How many units of that product would you like to purchase?",

        // })
        // .then(answers => {
            // console.info('', answers.item_id)
        // })};