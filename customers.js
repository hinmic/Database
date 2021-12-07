module.exports = function(){
    var express = require('express');
    var router = express.Router();

    
    //Gets a list of all the customers
    
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
    //Is called by the filter by id route below, gets the customers First and Last name from an ID drop down box
    
    function getCustomerByID(req, res, mysql, context, complete){
      var query = "SELECT customers.custID as custID, custFirstName, custLastName FROM customers WHERE customers.custID = ?";
      console.log(req.params.custID)
      var inserts = [req.params.custID]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    /* Find Customers whose fname starts with a given string in the req */
    
    function getCustomersWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT customers.custID as custID, custFirstName, custLastName FROM customers WHERE customers.custFirstName LIKE " + mysql.pool.escape(req.params.s);
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }
    //Gets a single customer for updating purposes
    
    function getCustomer(res, mysql, context, custID, complete){
        var sql = "SELECT customers.custID as custID, custFirstName, custLastName FROM customers WHERE customers.custID = ?";
        var inserts = [custID];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results[0];
            complete();
        });
    }

    /*Display all Customers. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteCustomer.js","filterCustByID.js","searchCustomers.js"];
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete); //get customers
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customers', context);
            }

        }
    });

    /*Filter by a Customers ID. Requires web based javascript to delete users with AJAX*/
    
    router.get('/filter/:custID', function(req, res){
        //console.log(res)
        //console.log(req)
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteCustomer.js","filterCustByID.js","searchCustomers.js"];
        var mysql = req.app.get('mysql');
        getCustomerByID(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customers', context);
            }

        }
    });

    /*Display all Customers whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteCustomer.js","filterCustByID.js","searchCustomers.js"];
        var mysql = req.app.get('mysql');
        getCustomersWithNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customers', context);
            }
        }
    });

    /* Display one Customer for the specific purpose of updating Customers */

    router.get('/:custID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatecustomer.js"];
        var mysql = req.app.get('mysql');
        getCustomer(res, mysql, context, req.params.custID, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-customer', context);
            }

        }
    });

    /* Adds a Customer, redirects to the customers page after adding */
    
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO customers (custFirstName, custLastName) VALUES (?,?)";
        var inserts = [req.body.custFirstName, req.body.custLastName];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/customers');
            }
        });
    });

    /* The URI that update data is sent to in order to update a Customer */

    router.put('/:custID', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.custID)
        var sql = "UPDATE customers SET custFirstName=?, custLastName=? WHERE custID=?";
        var inserts = [req.body.custFirstName, req.body.custLastName, req.params.custID];
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

    /* Route to delete a Customer, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:custID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM customers WHERE custID = ?";
        var inserts = [req.params.custID];
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
