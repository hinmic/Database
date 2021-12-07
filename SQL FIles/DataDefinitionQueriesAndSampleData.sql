DROP TABLE IF EXISTS `inventorysales`, `sales`, `customers`, `employees`, `inventory`;


CREATE TABLE customers (
    custID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    custFirstName VARCHAR(255) NOT NULL,
    custLastName VARCHAR(255) NOT NULL
);

CREATE TABLE employees (
    empID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    empFirstName VARCHAR(255) NOT NULL,
    empLastName VARCHAR(255) NOT NULL,
    empPay DECIMAL(10,2) NOT NULL,
    empStart DATE NOT NULL
);

CREATE TABLE inventory (
    itemID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    itemName VARCHAR(255) NOT NULL,
    itemPrice DECIMAL(10,2) NOT NULL,
    itemQuantity INT NOT NULL
);

CREATE TABLE sales (
    saleID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    saleQuantity INT NOT NULL,
    saleDate DATE NOT NULL,
    saleEmpID INT,
    saleCustID INT,
    saleTotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY(saleEmpID) REFERENCES employees (empID) ON DELETE
    SET NULL ON UPDATE CASCADE,
    FOREIGN KEY(saleCustID) REFERENCES customers (custID) ON DELETE
    SET NULL ON UPDATE CASCADE
);

CREATE TABLE inventorysales (
    saleID INT NOT NULL,
    itemID INT NOT NULL,
    FOREIGN KEY(saleID) REFERENCES sales (saleID) ON DELETE
    CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(itemID) REFERENCES inventory (itemID) ON DELETE
    CASCADE ON UPDATE CASCADE,
    CONSTRAINT PRIMARY KEY (saleID, itemID)
);

-- Insert Sample DATA into customers table
INSERT INTO customers (custFirstName, custLastName)
VALUES ('Frank', 'Smith'),
('Jane', 'Fonda'),
('Charlie', 'Jones');


-- Insert Sample DATA into employees table
INSERT INTO employees (empFirstName, empLastName, empPay, empStart) 
VALUES ('Patrick', 'Parks', '10001.10', '2020-11-16'), 
('Michael', 'Ng', '10002.20', '2020-11-16'), 
('Elizabeth', 'Olsen', '10000000', '2020-11-16');

-- Insert Sample DATA into inventory table
INSERT INTO inventory (itemName, itemPrice, itemQuantity) 
VALUES ('Baseball', '12.35', '23'), 
('Baseball Glove', '56.89', '12'), 
('Basketball', '23.22', '10');

-- Insert Sample DATA into sales table
INSERT INTO sales (saleQuantity, saleDate, saleEmpID, saleCustID, saleTotal)
VALUES ('2', '12-2-2009', (SELECT empID FROM employees WHERE empFirstName = 'Patrick' AND empLastName = 'Parks'),
(SELECT custID FROM customers WHERE custFirstName = 'Frank' AND custLastName = 'Smith'), '46.44'),
('1', '1-2-2007', (SELECT empID FROM employees WHERE empFirstName = 'Patrick' AND empLastName = 'Parks'), (SELECT custID FROM customers WHERE custFirstName = 'Frank' AND custLastName = 'Smith'), '56.89'),
('1', '8-2-2009', (SELECT empID FROM employees WHERE empFirstName = 'Patrick' AND empLastName = 'Parks'), (SELECT custID FROM customers WHERE custFirstName = 'Charlie' AND custLastName = 'Jones'), '23.22');

-- Insert Sample DATA into inventorysales table
INSERT INTO inventorysales (saleID, itemID)
VALUES ('1','2'),
('2','3'),
('3','1');

