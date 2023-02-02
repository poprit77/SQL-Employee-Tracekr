const con = require("./config/connection");
const { default: inquirer } = require("inquirer");
var express = require("express");
var app = express();

app.get("/", function (req, res) {
  res.send("Hello World!"); // This will serve your request to '/'.
});

app.listen(3000, function () {
  console.log("Example app listening on port 8000!");
});
con.connect((error) => {
  if (error) throw error;
  console.log("success");
  Prompt();
});

const Prompt = () => {
  inquirer
    .prompt([
      {
        names: "choices",
        type: "list",
        message: "please select an option",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "View All Employees By Department",
          "View Department Budgets",
          "Update Employee Role",
          "Update Employee Manager",
          "Add Employee",
          "Add Role",
          "Add Department",
          "Remove Employee",
          "Remove Role",
          "Remove Department",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;

      if (choices === "View All Employees") {
        ViewAllEmployees();
      }

      if (choices === "View All Departments") {
        ViewAllDepartments();
      }

      if (choices === "View All Employees By Department") {
        ViewEmployeesByDepartment();
      }

      if (choices === "Add Employee") {
        AddEmployee();
      }

      if (choices === "Remove Employee") {
        RemoveEmployee();
      }

      if (choices === "Update Employee Role") {
        UpdateEmployeeRole();
      }

      if (choices === "Update Employee Manager") {
        UpdateEmployeeManager();
      }

      if (choices === "View All Roles") {
        viewAllRoles();
      }

      if (choices === "Add Role") {
        AddRole();
      }

      if (choices === "Remove Role") {
        RemoveRole();
      }

      if (choices === "Add Department") {
        AddDepartment();
      }

      if (choices === "View Department Budgets") {
        ViewDepartmentBudget();
      }

      if (choices === "Remove Department") {
        RemoveDepartment();
      }

      if (choices === "Exit") {
        connection.end();
      }
    });
};

const viewAllRoles = () => {
  const sql = `SELECT role.id, role.title, department.department_name AS department
  FROM role
  INNER JOIN department ON role.department_id = department.id`;
  con.query(sql, (error, response) => {
    if (error) throw error;
    response.forEach((role) => {
      console.log(role.title);
      Prompt();
    });
  });
};
const ViewAllEmployees = () => {
  const sql = `SELECT employee.id, 
                  employee.first_name, 
                  employee.last_name, 
                  role.title, 
                  department.department_name AS 'department', 
                  role.salary
                  FROM employee, role, department 
                  WHERE department.id = role.department_id 
                  AND role.id = employee.role_id
                  ORDER BY employee.id ASC`;
  con.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    Prompt();
  });
};
const ViewAllDepartments = () => {
  const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
  con.query(sql, (error, respomse) => {
    if (error) throw error;
    console.log(response);
    Prompt();
  });
};
const ViewEmployeesByDepartment = () => {
  const sql = `SELECT employee.first_name, 
  employee.last_name, 
  department.department_name AS department
  FROM employee 
  LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id`;
  con.query(sql, (error, repsonse) => {
    if (error) throw error;
    console.log(response);
    Prompt();
  });
};
const ViewDepartmentBudget = () => {
  const sql =     `SELECT department_id AS id, 
  department.department_name AS department,
  SUM(salary) AS budget
  FROM  role  
  INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id`;
  con.query(sql, (error, response) =>{
    if(error)throw error;
    console.table(response);
    Prompt();
  })
};
const UpdateEmployeeRole = () => {};
const UpdateEmployeeManager = () => {};
const AddEmployee = () => {};
const AddRole = () => {};
const AddDepartment = () => {};
const RemoveEmployee = () => {};
const RemoveRole = () => {};
const RemoveDepartment = () => {};
const Exit = () => {};
