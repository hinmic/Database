-- Query for adding a new entry functionality with colon :data being used to
-- denote the variables that will have data from the backend programming language
INSERT INTO customers (custFirstName, custLastName)
VALUES (:custFname, :custLname);

INSERT INTO employees (empFirstName, empLastName, empPay, empStart)
VALUES (:empFname, :empLname, :empPay, :empStart);

INSERT INTO inventory (itemName, itemPrice, itemQuantity)
VALUES (:itemName, :itemPrice, :itemQuantity);

SELECT customers.custID as custID, custFirstName, custLastName FROM customers;
SELECT employees.empID as empID, empFirstName, empLastName FROM employees;
INSERT INTO sales (saleQuantity, saleDate, saleEmpID, saleCustID, saleTotal) VALUES
    (:saleQuantity, :saleDate, :saleEmpID, :saleCustID, :saleQuantity * (SELECT itemPrice FROM inventory WHERE itemID = :itemID));

SELECT inventory.itemID as itemID, itemName, itemPrice, itemQuantity FROM inventory;
SELECT MAX(sales.saleID) as saleID FROM sales;
INSERT INTO inventorysales (saleID, itemID) VALUES(:saleID, :itemID);

-- Query for updating an entry functionality with colon :data being used to
-- denote the variables that will have data from the backend programming language
UPDATE customers
SET custFirstName = :custFname, custLastName = :custLname
WHERE custID = :custID;

UPDATE employees
SET empFirstName = :empFname, empLastName = :empLname, empPay = :empPay, empStart = :empStart
WHERE empID = :empID;

UPDATE inventory
SET itemName = :itemName, itemPrice = :itemPrice, itemQuantity = :itemQuantity
WHERE itemID = :itemID;

-- Update the itemQuantity when a new entry in sales is created
UPDATE inventory
SET itemQuantity=((SELECT inventory.itemQuantity FROM inventory
WHERE itemID = :itemID) - :saleQuantity) WHERE itemID = :itemID;

-- UPDATE the itemQuantity when an entry in sales is deleted
SELECT sales.saleQuantity as saleQuantity FROM sales WHERE sales.saleID = :saleID;
SELECT inventorysales.itemID as itemID FROM inventorysales WHERE inventorysales.saleID = :saleID;
SELECT inventory.itemQuantity as itemQuantity FROM inventory WHERE inventory.itemID = :itemID;
UPDATE inventory
SET itemQuantity = :itemQuantity + :saleQuantity
WHERE itemID = :itemID;

-- Query for deleting an entry functionality with colon :data being used to
-- denote the variables that will have data from the backend programming language
DELETE FROM customers
WHERE custID = :custID;

DELETE FROM employees
WHERE empID = :empID;

DELETE FROM inventory
WHERE itemID = :itemID;

DELETE FROM sales
WHERE saleID = :saleID;



