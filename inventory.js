module.exports = function(){
    var express = require('express');
    var router = express.Router();

    
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
    
    //Is called by the filter by id route below, gets the Inventory from an ID drop down box
    
    function getInventoryByID(req, res, mysql, context, complete){
      var query = "SELECT inventory.itemID as itemID, itemName, itemPrice, itemQuantity FROM inventory WHERE inventory.itemID = ?";
      console.log(req.params.itemID)
      var inserts = [req.params.itemID]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.inventory = results;
            complete();
        });
    }

    /* Find Inventory whose itemName starts with a given string in the req */
    
    function getInventoryWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT inventory.itemID as itemID, itemName, itemPrice, itemQuantity FROM inventory WHERE inventory.itemName LIKE " + mysql.pool.escape(req.params.s);
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.inventory = results;
            complete();
        });
    }

    //Gets a single Inventory for updating purposes
    
    function getItem(res, mysql, context, itemID, complete){
        var sql = "SELECT inventory.itemID as itemID, itemName, itemPrice, itemQuantity FROM inventory WHERE inventory.itemID = ?";
        var inserts = [itemID];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.item = results[0];
            complete();
        });
    }

    /*Display all Inventory. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteItem.js","filterInventoryByID.js","searchInventory.js"];
        var mysql = req.app.get('mysql');
        getInventory(res, mysql, context, complete); //get Inventory
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('inventory', context);
            }

        }
    });

    /*Filter by a Inventory ID. Requires web based javascript to delete users with AJAX*/
    
    router.get('/filter/:itemID', function(req, res){
        //console.log(res)
        //console.log(req)
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteItem.js","filterInventoryByID.js","searchInventory.js"];
        var mysql = req.app.get('mysql');
        getInventoryByID(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('inventory', context);
            }

        }
    });

    /*Display all Employees whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteItem.js","filterInventoryByID.js","searchInventory.js"];
        var mysql = req.app.get('mysql');
        getInventoryWithNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('inventory', context);
            }
        }
    });

    /* Display one Item for the specific purpose of updating Inventory */

    router.get('/:itemID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateitem.js"];
        var mysql = req.app.get('mysql');
        getItem(res, mysql, context, req.params.itemID, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-item', context);
            }
        }
    });

    /* Adds an Item, redirects to the inventory page after adding */
    
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO inventory (itemName, itemPrice, itemQuantity) VALUES (?,?,?)";
        var inserts = [req.body.itemName, req.body.itemPrice, req.body.itemQuantity];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/inventory');
            }
        });
    });

    /* The URI that update data is sent to in order to update an Item */

    router.put('/:itemID', function(req, res){
        var mysql = req.app.get('mysql');
        //console.log(req.body)
        console.log(req.params.itemID)
        var sql = "UPDATE inventory SET itemName=?, itemPrice=?, itemQuantity=? WHERE itemID=?";
        var inserts = [req.body.itemName, req.body.itemPrice, req.body.itemQuantitiy, req.params.itemID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete an Item, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:itemID', function(req, res){
        console.log("Im in inventory delete route")
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM inventory WHERE itemID = ?";
        var inserts = [req.params.itemID];
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
    })

    return router;
}();
