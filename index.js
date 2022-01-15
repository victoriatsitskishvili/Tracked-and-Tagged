// Dependencies //
const mysql = require('mysql2');
const inquirer = require('inquirer');
const connection = require('./config/connection');


// What would you like to do? //
const initialAction = async () => {
    try {
        let answer = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All',
                'View Departments',
                'Add Departments',
                'View Roles',
                'Add Roles',
                'View Employees',
                'Add Employees',
                'Update Employee Role',
                'Exit'
            ]
        });
        switch (answer.action) {
            case 'View All':
                viewAll();
                break;

            case 'View Departments':
                departmentView();
                break;

            case 'Add Departments':
                departmentAdd();
                break;

            case 'View Roles':
                roleView();
                break;

            case 'Add Roles':
                roleAdd();
                break;

            case 'View Employees':
                employeeView();
                break;

            case 'Add Employees':
                employeeAdd();
                break;

            case 'Update Employee Role':
                employeeUpdate();
                break;

            case 'Exit':
                connection.end();
                break;
        };
    } catch (err) {
        console.log(err);
        initialAction();
    };
}

// To view all the data //

function viewAll() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", (err, res) => {
        if (err) throw err
        console.table(res)
        initialAction()
    })
}

// To view all the departments //
const departmentView = async () => {
    console.log('Department View');
    try {
        let query = 'SELECT * FROM department';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let departmentArray = [];
            res.forEach(department => departmentArray.push(department));
            console.table(departmentArray);
            initialAction();
        });
    } catch (err) {
        console.log(err);
        initialAction();
    };
}

// To add a new department //
const departmentAdd = () => {
    
        console.log('Add Department');

        inquirer.prompt([
            {
                name: 'name',
                type: 'input',
                message: 'What is the name of the department?'
            }
        ]).then(answer => {
            connection.query("INSERT INTO department SET ?;", {
                name: answer.name
            });
            console.log(`${answer.name} added to departments.\n`)
            initialAction();

        }) 
}

// To view all the roles //
const roleView = async () => {
    console.log('Role View');
    try {
        let query = 'SELECT * FROM role';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let roleArray = [];
            res.forEach(role => roleArray.push(role));
            console.table(roleArray);
            initialAction();
        });
    } catch (err) {
        console.log(err);
        initialAction();
    };
}

// To add a new role //
const roleAdd = () => {


    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the name of the role?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the role?'
        },
        {
            name: 'departmentId',
            type: 'input',
            message: "What is the department ID?"
        }
    ]).then(answer => {
        connection.query("INSERT INTO role SET ?;", {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId
        })
        console.log(`${answer.title} added to roles.`)
        initialAction();
    })
}

// To view all the employees //
const employeeView = async () => {
    console.log('Employee View');
    try {
        let query = 'SELECT * FROM employee';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let employeeArray = [];
            res.forEach(employee => employeeArray.push(employee));
            console.table(employeeArray);
            initialAction();
        });
    } catch (err) {
        console.log(err);
        initialAction();
    };
}


// To add a new employee.
const employeeAdd = async () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: "What is the employee's first name?"
        },

        {
            name: 'lastName',
            type: 'input',
            message: "What is the employee's last name?"
        },

        {
            name: 'employeeRoleId',
            type: 'input',
            message: "What is the employee's role id?"
        },
        {
            name: 'employeeManagerId',
            type: 'input',
            message: "What is the employee's manager's id?"
        }
    ])

        .then(answer => {
            connection.query("INSERT INTO employee SET ?;", {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: (answer.employeeRoleId),
                manager_id: (answer.employeeManagerId)
            });
            console.log(`${answer.firstName} ${answer.lastName} employee added.`);
            initialAction();
        })
}


// To update a role for a specific employee //
const employeeUpdate = async () => {


    connection.query("SELECT * FROM employee", (err, data) => {
        let emp = data.map(({id, first_name}) => ({id: id, name: first_name}))
        

        connection.query("SELECT * FROM role", (err, roleData) => {
            let roleId = roleData.map(items => items.id)

            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'list',
                    choices: emp,
                    message: "What is the employee's id do you want to update?"
                },
                {
                    name: 'role',
                    type: 'list',
                    choices: roleId,
                    message: 'Please select the new role.'
                }
            ]).then(answer => {
                connection.query(`SELECT * FROM employee WHERE first_name = '${answer.employee}' ;`, (err ,data) => {
                    let id = data.map(item => item.id);
                    console.log(id[0]);
                    connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: answer.role }, { id: id[0] }]);
                    console.log(`The role was updated.\n`);
                    initialAction();
                })
                
            })

        });

    });


}

initialAction()