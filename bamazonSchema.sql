CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products
(
    item_id INT NOT NULL,
    product_name VARCHAR (100) NUll,
    department_name VARCHAR (100) NUll,
    price DECIMAL(10,4) NUll,
    stock_quantity DECIMAL(10,4) NUll,
    PRIMARY KEY (item_id)
)