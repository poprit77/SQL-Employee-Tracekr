const con = require("./db/connection");
const inquirer= require("inquirer");

// con.connect(function (error)  {
//   if (error) throw error;
//   console.log("success");
//   Prompt();
// });

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
  const sql = `SELECT department_id AS id, 
  department.department_name AS department,
  SUM(salary) AS budget
  FROM  role  
  INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id`;
  con.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    Prompt();
  });
};
const UpdateEmployeeRole = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
  FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
  con.query(sql, (error, response) => {
    if (error) throw error;
    const employeeNamesArray = [];
    response.forEach((employee) => {
      employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);
    });

    const sql = `SELECT role.id, role.title FROM role`;
    con.query(sql, (error, response) => {
      if (error) throw error;
      const rolesArray = [];
      response.forEach((role) => {
        rolesArray.push(role.title);
      });

      inquirer
        .prompt([
          {
            name: "chosenEmployee",
            type: "list",
            message: "Which employee has a new role?",
            choices: employeeNamesArray,
          },
          {
            name: "chosenRole",
            type: "list",
            message: "What is their new role?",
            choices: rolesArray,
          },
        ])
        .then((answer) => {
          let newTitleId, employeeId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
            }
          });

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
          con.query(sqls, [newTitleId, employeeId], (error) => {
            if (error) throw error;
            console.log("Role Updated");
            Prompt();
          });
        });
    });
  });
};

const UpdateEmployeeManager = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
  FROM employee`;
  connection.promise().query(sql, (error, response) => {
    const employeeNamesArray = [];
    response.forEach((employee) => {
      employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);
    });

    inquirer
      .prompt([
        {
          name: "chosenEmployee",
          type: "list",
          message: "Which employee has a new manager?",
          choices: employeeNamesArray,
        },
        {
          name: "newManager",
          type: "list",
          message: "Who is their manager?",
          choices: employeeNamesArray,
        },
      ])
      .then((answer) => {
        let employeeId, managerId;
        response.forEach((employee) => {
          if (
            answer.chosenEmployee ===
            `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }

          if (
            answer.newManager === `${employee.first_name} ${employee.last_name}`
          ) {
            managerId = employee.id;
          }
        });

        if (validate.isSame(answer.chosenEmployee, answer.newManager)) {
          console.log(`Invalid Selection`);
          Prompt();
        } else {
          let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

          con.query(sql, [managerId, employeeId], (error) => {
            if (error) throw error;
            console.log("Manager Updated");
            Prompt();
          });
        }
      });
  });
};
const AddEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "fistName",
        message: "What is the employee's first name?",
        validate: (addFirstName) => {
          if (addFirstName) {
            return true;
          } else {
            console.log("Please enter a first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: (addLastName) => {
          if (addLastName) {
            return true;
          } else {
            console.log("Please enter a last name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const crit = [answer.fistName, answer.lastName];
      const roleSql = `SELECT role.id, role.title FROM role`;
      con.query(roleSql, (error, data) => {
        if (error) throw error;
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            crit.push(role);
            const managerSql = `SELECT * FROM employee`;
            con.query(managerSql, (error, data) => {
              if (error) throw error;
              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  crit.push(manager);
                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                  connection.query(sql, crit, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!");
                    viewAllEmployees();
                  });
                });
            });
          });
      });
    });
};
const AddRole = () => {
  const sql = "SELECT * FROM department";
  con.query(sql, (error, response) => {
    if (error) throw error;
    const deptNamesArray = [];
    response.forEach((department) => {
      deptNamesArray.push(department.department_name);
    });
    deptNamesArray.push("Create Department");
    inquirer
      .prompt([
        {
          name: "departmentName",
          type: "list",
          message: "Which department is this new role in?",
          choices: deptNamesArray,
        },
      ])
      .then((answer) => {
        if (answer.departmentName === "Create Department") {
          this.addDepartment();
        } else {
          addRoleResume(answer);
        }
      });

    const addRoleResume = (departmentData) => {
      inquirer
        .prompt([
          {
            name: "newRole",
            type: "input",
            message: "What is the name of your new role?",
            validate: validate.validateString,
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary of this new role?",
            validate: validate.validateSalary,
          },
        ])
        .then((answer) => {
          const createdRole = answer.newRole;
          let departmentId;

          response.forEach((department) => {
            if (departmentData.departmentName === department.department_name) {
              departmentId = department.id;
            }
          });

          const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
          const crit = [createdRole, answer.salary, departmentId];

          con.query(sql, crit, (error) => {
            if (error) throw error;
            console.log(`Role successfully created!`);
            viewAllRoles();
          });
        });
    };
  });
};
const AddDepartment = () => {
  inquirer
    .prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "What is the name of your new Department?",
        validate: validate.validateString,
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO department (department_name) VALUES (?)`;
      con.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        console.log(answer.newDepartment + ` Department created!`);
        viewAllDepartments();
      });
    });
};
const RemoveEmployee = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

  con.query(sql, (error, response) => {
    if (error) throw error;
    const employeeNamesArray = [];
    response.forEach((employee) => {
      employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);
    });

    inquirer
      .prompt([
        {
          name: "chosenEmployee",
          type: "list",
          message: "Which employee would you like to remove?",
          choices: employeeNamesArray,
        },
      ])
      .then((answer) => {
        let employeeId;

        response.forEach((employee) => {
          if (
            answer.chosenEmployee ===
            `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }
        });

        const sql = `DELETE FROM employee WHERE employee.id = ?`;
        connection.query(sql, [employeeId], (error) => {
          if (error) throw error;
          console.log(`Employee Successfully Removed`);
          viewAllEmployees();
        });
      });
  });
};
const RemoveRole = () => {
  const sql = `SELECT role.id, role.title FROM role`;

  con.query(sql, (error, response) => {
    if (error) throw error;
    const roleNamesArray = [];
    response.forEach((role) => {
      roleNamesArray.push(role.title);
    });

    inquirer
      .prompt([
        {
          name: "chosenRole",
          type: "list",
          message: "Which role would you like to remove?",
          choices: roleNamesArray,
        },
      ])
      .then((answer) => {
        let roleId;

        response.forEach((role) => {
          if (answer.chosenRole === role.title) {
            roleId = role.id;
          }
        });

        const sql = `DELETE FROM role WHERE role.id = ?`;
        con.query(sql, [roleId], (error) => {
          if (error) throw error;
          console.log(`Role Removed`);
          viewAllRoles();
        });
      });
  });
};
const RemoveDepartment = () => {
  const sql = `SELECT department.id, department.department_name FROM department`;
  con.query(sql, (error, response) => {
    if (error) throw error;
    const departmentNamesArray = [];
    response.forEach((department) => {
      departmentNamesArray.push(department.department_name);
    });

    inquirer
      .prompt([
        {
          name: "chosenDept",
          type: "list",
          message: "Which department would you like to remove?",
          choices: departmentNamesArray,
        },
      ])
      .then((answer) => {
        let departmentId;

        response.forEach((department) => {
          if (answer.chosenDept === department.department_name) {
            departmentId = department.id;
          }
        });

        const sql = `DELETE FROM department WHERE department.id = ?`;
        connection.promise().query(sql, [departmentId], (error) => {
          if (error) throw error;
          console.log(`Department Removed`);
          viewAllDepartments();
        });
      });
  });
};

