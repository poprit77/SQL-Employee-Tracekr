const { default: inquirer } = require("inquirer");

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

const viewAllRoles = () => {};
const ViewAllEmployees = () => {
  
};
const ViewAllDepartments = () => {};
const ViewEmployeesByDepartment = () => {};
const ViewDepartmentBudget = () => {};
const UpdateEmployeeRole = () => {};
const UpdateEmployeeManager = () => {};
const AddEmployee = () => {};
const AddRole = () => {};
const AddDepartment = () => {};
const RemoveEmployee = () => {};
const RemoveRole = () => {};
const RemoveDepartment = () => {};
const Exit = () => {};
