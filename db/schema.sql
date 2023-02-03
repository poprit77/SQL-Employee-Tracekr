DROP DATABASE IF EXISTS Employees;
CREATE DATABASE Employees;

USE Employees;

CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dname_ VARCHAR(30)
);

CREATE TABLE role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT NULL
);

CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT
);
