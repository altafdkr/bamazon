var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  runStore();
});


function runStore() {
  
  connection.query("SELECT * FROM products", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(
        "ID: " +
        res[i].item_id +
        " || Product: " +
        res[i].product_name +
        " || Price: " +
        res[i].price
      );
    }
    takeOrder();

    function takeOrder() {
      inquirer
      .prompt([
        {
          name: "productid",
          type: "input",
          message: "Enter the ID of the product you would like to buy.",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "quantity",
          type: "input",
          message: "Enter the quantity of the product you want to buy",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        connection.query("SELECT stock_quantity, price FROM products WHERE ?", { item_id: answer.productid}, function(err, res) {
          console.log(res);
          if (res[0].stock_quantity < answer.quantity) {
            console.log("-------------------------------------------------");
            console.log("-------------------------------------------------");
            console.log("Insufficient Quantity");
            console.log("-------------------------------------------------");
            console.log("-------------------------------------------------");
            runStore();
          } else {
            newquantity = res[0].stock_quantity - answer.quantity;
            totalcost = answer.quantity*res[0].price;
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newquantity, answer.productid], function(err, res) {
              console.log("-------------------------------------------------");
              console.log("-------------------------------------------------");
              console.log("Item Ordered");
              console.log("-------------------------------------------------");
              console.log("You total cost was " + totalcost);
              console.log("-------------------------------------------------");
              console.log("-------------------------------------------------");
              runStore();
            });

          }

        });
      })
    }
  });

  
}



  


