module.exports = function(){
    var express = require('express');
    var router = express.Router();

    
    //Gets a list of all the Sales
    
    function getSales(res, mysql, context, complete){
        mysql.pool.query("SELECT sales.saleID as saleID, saleQuantity, saleDate, saleEmpID, saleCustID, saleTotal FROM sales", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.sales = results;
            complete();
        });
    }

    //Gets a list of all the Customers

    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT customers.custID as custID, custFirstName, custLastName FROM customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    //Gets a list of all the Employees
    
    function getEmployees(res, mysql, context, complete){
        mysql.pool.query("SELECT employees.empID as empID, empFirstName, empLastName FROM employees", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employees = results;
            complete();
        });
    }

    //Gets a list of all the Inventory
    
    function getInventory(res, mysql, context, complete){
        mysql.pool.query("SELECT inventory.itemID as itemID, itemName, itemPrice, itemQuantity FROM inventory", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.inventory = results;
            complete();
        });
    }
    
    //Is called by the filter by id route below, gets the Sale from an ID drop down box
    
    function getSalesByID(req, res, mysql, context, complete){
      var query = "SELECT sales.saleID as saleID, saleQuantity, saleDate, saleEmpID, saleCustID, saleTotal FROM sales WHERE sales.saleID = ?";
      console.log(req.params.saleID)
      var inserts = [req.params.saleID]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.sales = results;
            complete();
        });
    }

    //Insert a new entry in inventorysales

    function addInventorySales(req, res, mysql, itemID, complete){
        var getID = 0;
        var getSaleID = "SELECT MAX(sales.saleID) as saleID FROM sales";
        mysql.pool.query(getSaleID, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                getID = results;
                saleID = getID[0].saleID;
                console.log(saleID)
                var query = "INSERT INTO inventorysales (saleID, itemID) VALUES (?,?)";
                var inserts = [saleID, itemID];
                mysql.pool.query(query, inserts, function(error, results, fields){
                    if(error){
                        console.log(error)
                        res.write(JSON.stringify(error));
                        res.end();
                    }
                    complete();
                });
            }
        });
    }

    /*Display all Sales. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteSale.js","filterSalesByID.js"];
        var mysql = req.app.get('mysql');
        getSales(res, mysql, context, complete); //get Sales
        getEmployees(res, mysql, context, complete); //get Employees
        getCustomers(res, mysql, context, complete); //get Customers
        getInventory(res, mysql, context, complete); //get Inventory
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('sales', context);
            }

        }
    });

    /*Filter by a Sale ID. Requires web based javascript to delete users with AJAX*/
    
    router.get('/filter/:saleID', function(req, res){
        //console.log(res)
        //console.log(req)
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteSale.js","filterSalesByID.js"];
        var mysql = req.app.get('mysql');
        getSalesByID(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('sales', context);
            }
        }
    });

    /* Display one Sale for the specific purpose of updating Sales */

    router.get('/:saleID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatesale.js"];
        var mysql = req.app.get('mysql');
        getSale(res, mysql, context, req.params.saleID, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-sale', context);
            }
        }
    });

    /* Adds a Sale, redirects to the sales page after adding */
    
    router.post('/', function(req, res){
        console.log(req.body)
        var callBackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sales (saleQuantity, saleDate, saleEmpID, saleCustID, saleTotal) VALUES (?,?,?,?,?*(SELECT itemPrice FROM inventory WHERE itemID=?))";
        var inserts = [req.body.saleQuantity, req.body.saleDate, req.body.empID, req.body.custID, req.body.saleQuantity, req.body.itemID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                var sql2 = "UPDATE inventory SET itemQuantity=((SELECT inventory.itemQuantity FROM inventory WHERE itemID=?) - ?) WHERE itemID=?";
                var inserts2 = [req.body.itemID, req.body.saleQuantity, req.body.itemID];
                sql2 = mysql.pool.query(sql2,inserts2,function(error, results, fields){
                    if(error){
                        console.log(error)
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{
                        res.status(200);
                    }
                });
                addInventorySales(req, res, mysql, req.body.itemID, complete);
                function complete(){
                    callBackCount++;
                    if (callBackCount >= 1){
                        res.redirect('/sales');
                    }
                }
            }
        });
    });

    /* Route to delete a Sale, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:saleID', function(req, res){
        console.log("Im in sales delete route")
        var mysql = req.app.get('mysql');
        var newQuantity = 0
        var sQuantity = 0
        var getSaleQuantity = "SELECT sales.saleQuantity as saleQuantity FROM sales WHERE sales.saleID = ?";
        var insertsSQ = [req.params.saleID];
        getSaleQuantity = mysql.pool.query(getSaleQuantity, insertsSQ, function(error, results, fields){
             if(error){
                 console.log(error)
                 res.write(JSON.stringify(error));
                 res.end();
             }else{
                 sQuantity = results;
                 saleQuantity = sQuantity[0].saleQuantity;
                 console.log(saleQuantity)
                 res.status(200);

                 var iID = 0
                 var getItemID = "SELECT inventorysales.itemID as itemID FROM inventorysales WHERE inventorysales.saleID = ?";
                 var insertsIID = [req.params.saleID];
                 getItemID = mysql.pool.query(getItemID, insertsIID, function(error, results, fields){
                 if(error){
                     console.log(error)
                     res.write(JSON.stringify(error));
                     res.end();
                 }else{
                      iID = results;
                      itemID = iID[0].itemID;
                      console.log(itemID)
                      res.status(200);

                      var iQuantity = 0
                      var getItemQuantity = "SELECT inventory.itemQuantity as itemQuantity FROM inventory WHERE inventory.itemID = ?";
                      var insertsIQuantity = itemID;
                      getItemQuantity = mysql.pool.query(getItemQuantity, insertsIQuantity, function(error, results, fields){
                      if(error){
                          console.log(error)
                          res.write(JSON.stringify(error));
                          res.end();
                      }else{
                          iQuantity = results;
                          itemQuantity = iQuantity[0].itemQuantity;
                          console.log(itemQuantity)
                          res.status(200);
                          newQuantity = itemQuantity + saleQuantity;

                          var sql2 = "UPDATE inventory SET itemQuantity=? WHERE itemID=?";
                          var inserts2 = [newQuantity, itemID];
                          sql2 = mysql.pool.query(sql2,inserts2,function(error, results, fields){
                          if(error){
                              console.log(error)
                              res.write(JSON.stringify(error));
                              res.end();
                          }else{
                              res.status(200);
                              var sql = "DELETE FROM sales WHERE saleID = ?";
                              var inserts = [req.params.saleID];
                              sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                                  if(error){
                                      console.log(error)
                                      res.write(JSON.stringify(error));
                                      res.status(400);
                                      res.end();
                                  }else{
                                      res.status(202).end();
                                  }
                              })

                         }
                      });
                    }
                 });
               }
            });      
         }
      });
    });

    return router;
}();
