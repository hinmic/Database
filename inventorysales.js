module.exports = function(){
    var express = require('express');
    var router = express.Router();

    
    //Gets a list of all the Inventory-Sales
    
    function getInventorySales(res, mysql, context, complete){
        mysql.pool.query("SELECT inventorysales.saleID as saleID, itemID FROM inventorysales", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.inventorysales = results;
            complete();
        });
    }

    /*Display all Inventory-Sales.*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getInventorySales(res, mysql, context, complete); //get Inventory-Sales
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('inventorysales', context);
            }
        }
    });

    return router;
}();
