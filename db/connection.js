const mysql = require('mysql2');

require('dotenv').config();

const con = mysql.createConnection({
  host: 'localhost',
  port: 3250,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'Employees'
});

con.connect(function (error)  {
  if (error) throw error;
  console.log("success");
  Prompt();
});

module.exports = con;