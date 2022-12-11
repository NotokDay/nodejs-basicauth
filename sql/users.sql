DROP TABLE IF EXISTS users;

CREATE TABLE users 
(
    user_id int primary key auto_increment,
    fullName varchar(30),
    username varchar(30),
    password varchar(100)    
);