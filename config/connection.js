const mysql = require('mysql2');

require('dotenv').config();

const con = mysql.createConnection({
  host: '127.0.0.1',
  port: 3000,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'employees'
});

module.exports = con;