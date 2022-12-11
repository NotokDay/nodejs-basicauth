DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS products;

CREATE TABLE suppliers (
        supplierID  INT UNSIGNED  NOT NULL AUTO_INCREMENT, 
        name        VARCHAR(30)   NOT NULL DEFAULT '', 
        phone       CHAR(8)       NOT NULL DEFAULT '',
        PRIMARY KEY (supplierID)
       );

CREATE TABLE products (
        productID    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
        productCode  CHAR(3)       NOT NULL DEFAULT '',
        name         VARCHAR(30)   NOT NULL DEFAULT '',
        supplierID   INT UNSIGNED  NOT NULL,
        quantity     INT UNSIGNED  NOT NULL DEFAULT 0,
        price        DECIMAL(7,2)  NOT NULL DEFAULT 99999.99,
        PRIMARY KEY  (productID)
);

ALTER TABLE products
       ADD FOREIGN KEY (supplierID) REFERENCES suppliers (supplierID);

INSERT INTO suppliers VALUES
        (1, 'ABC Traders', '88881111'), 
        (2, 'OYAL', '99442222'), 
        (3, 'MR Fix', '90055333'),
        (4, 'Coloritm', '99455333');

INSERT INTO products (productCode, name, supplierID, quantity, price) VALUES
        ('PEC', 'Pencil 2B', 1, 10000, 0.48),
        ('PEC', 'Pencil 2H', 1, 8000, 0.49),
        ('PEN', 'Pen Red', 1, 12000, 1.20),
        ('PEN', 'Pen Blue', 2, 12500, 1.15),
        ('PEN', 'Pen Black', 2, 13000, 1.00),
        ('PPR', 'A4', 4, 500, 4.50),
        ('PPR', 'A5', 4, 800, 5.50),
        ('PPR', 'A3', 2, 740, 8.00),
        ('PPR', 'A2', 2, 250, 10.00),
        ('PEC', 'Pencil Color Set N50', 3, 1000, 25.50),
        ('PEC', 'Pencil Color Set N25', 1, 1100, 20.50),
        ('PEC', 'Pencil Color Set N10', 1, 700, 10.00),
        ('BLK', 'Blackboard 2 x 1.5', 2, 210, 20.00),
        ('BLK', 'Blackboard 1 x 0.5', 3, 200, 12.00),
        ('BLK', 'Blackboard 0.5 x 0.2', 2, 400, 6.00);