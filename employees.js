module.exports = function(){
    var express = require('express');
    var router = express.Router();

    
    //Gets a list of all the Employees
    
    function getEmployees(res, mysql, context, complete){
        mysql.pool.query("SELECT employees.empID as empID, empFirstName, empLastName, empPay, empStart FROM employees", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employees = results;
            complete();
        });
    }
    
    //Is called by the filter by id route below, gets the Employees First and Last name from an ID drop down box
    
    function getEmployeeByID(req, res, mysql, context, complete){
      var query = "SELECT employees.empID as empID, empFirstName, empLastName, empPay, empStart FROM employees WHERE employees.empID = ?";
      console.log(req.params.empID)
      var inserts = [req.params.empID]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employees = results;
            complete();
        });
    }

    /* Find Employees whose fname starts with a given string in the req */
    
    function getEmployeesWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT employees.empID as empID, empFirstName, empLastName, empPay, empStart FROM employees WHERE employees.empFirstName LIKE " + mysql.pool.escape(req.params.s);
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employees = results;
            complete();
        });
    }
    //Gets a single Employee for updating purposes
    
    function getEmployee(res, mysql, context, empID, complete){
        var sql = "SELECT employees.empID as empID, empFirstName, empLastName, empPay, empStart FROM employees WHERE employees.empID = ?";
        var inserts = [empID];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee = results[0];
            complete();
        });
    }

    /*Display all Employees. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteEmployee.js","filterEmpByID.js","searchEmployees.js"];
        var mysql = req.app.get('mysql');
        getEmployees(res, mysql, context, complete); //get Employees
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('employees', context);
            }

        }
    });

    /*Filter by a Employees ID. Requires web based javascript to delete users with AJAX*/
    
    router.get('/filter/:empID', function(req, res){
        //console.log(res)
        //console.log(req)
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteEmployee.js","filterEmpByID.js","searchEmployees.js"];
        var mysql = req.app.get('mysql');
        getEmployeeByID(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('employees', context);
            }

        }
    });

    /*Display all Employees whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteEmployee.js","filterEmpByID.js","searchEmployees.js"];
        var mysql = req.app.get('mysql');
        getEmployeesWithNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('employees', context);
            }
        }
    });

    /* Display one Employee for the specific purpose of updating Employees */

    router.get('/:empID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateemployee.js"];
        var mysql = req.app.get('mysql');
        getEmployee(res, mysql, context, req.params.empID, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-employee', context);
            }

        }
    });

    /* Adds a Employee, redirects to the employees page after adding */
    
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO employees (empFirstName, empLastName, empPay, empStart) VALUES (?,?,?,?)";
        var inserts = [req.body.empFirstName, req.body.empLastName, req.body.empPay, req.body.empStart];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/employees');
            }
        });
    });

    /* The URI that update data is sent to in order to update an Employee */

    router.put('/:empID', function(req, res){
        var mysql = req.app.get('mysql');
        //console.log(req.body)
        console.log(req.params.empID)
        var sql = "UPDATE employees SET empFirstName=?, empLastName=? , empPay=?, empStart=? WHERE empID=?";
        var inserts = [req.body.empFirstName, req.body.empLastName, req.body.empPay, req.body.empStart, req.params.empID];
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

    /* Route to delete an Employee, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:empID', function(req, res){
        console.log("Im in employees delete route")
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM employees WHERE empID = ?";
        var inserts = [req.params.empID];
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
