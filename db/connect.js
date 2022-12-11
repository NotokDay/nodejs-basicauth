const mysql = require('mysql2')
require('dotenv').config({path:__dirname+'/../.env'})

var db = mysql.createConnection({
    host: "localhost", 
    user: "root",
    password: process.env.DB_ROOT_PASSWORD,
    database: "last_node"
})

db.connect((err) => {
    if(err) throw err
    console.log('connected')
})

module.exports = {db}