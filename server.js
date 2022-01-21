const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();
//connect to db
const db = mysql.createConnection(
    {

        host: process.env.DB_HOST,
        //YourMySql username,
        user: process.env.DB_USER,
        //YOUR mysql password
        password: process.env.DB_PASS,
        //db name
        database: process.env.DB_DATABASE
    },
    console.log('Connected to the election database!')
);
//Inital function asking what the user would like to do
const init = function () {
    inquirer.prompt({
        type: 'list',
        name: 'firstPrompt',
        messsage: 'What would you like to do?',
        choices: ['View all departments', 'View all Roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
    })
        //if statements that do things based on what the user choses
        .then(({ firstPrompt }) => {
            if (firstPrompt === 'View all departments') {
                db.promise().query(`SELECT * FROM department`

                ).then(viewDepts => {
                    console.log(viewDepts[0])
                    init();
                })
            } else if (firstPrompt === 'View all Roles') {
                db.promise().query(`SELECT * FROM jobrole`).then(viewRoles => {
                    console.log(viewRoles[0]);
                    init();
                })
            } else if (firstPrompt === 'View all employees') {
                db.promise().query('SELECT * FROM `employee`').then(viewEmps => {
                    console.log(viewEmps[0]);
                    init();
                })
            } else if (firstPrompt === 'Add a department') {
                addDept();
            } else if (firstPrompt === 'Add a role') {
                addRole();
            } else if (firstPrompt === 'Add an employee') {
                addEmployee();
            } else if (firstPrompt === 'Update an employee role') {
                updateEmployee();
            } else {
                console.log('choose a valid option');

            }

        })
};
//adds a new department based on what text the user inputs
function addDept() {
    inquirer.prompt({
        type: 'input',
        name: 'dept',
        message: 'What is the department name?'
    })
        .then(({ dept }) => {
            db.promise().query(`INSERT INTO department (name) VALUES ('${dept}')`).then(addDept => {
                //console.log(addDept);
                console.log(`New department Added : ${dept}`);
                init();
            })

        })
};

//adds a new role
function addRole() {
    db.query(`SELECT name FROM department`, (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log(res);
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: 'What is the new role you would like to add?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary for this role?'
                },
                {
                    type: 'list',
                    name: 'dept',
                    message: 'What department is this role in?',
                    choices: res
                }
            ])
                .then(({ role, salary, dept }) => {
                    db.query(`SELECT id FROM department WHERE name = ?`, dept, (err, res) => {
                        if (err) {
                            throw err;
                        } else {
                            console.log(res[0].id);
                            db.query(`INSERT INTO jobrole (name, salary, department_id) VALUES (?, ?, ?)`, [role, salary, res[0].id], (err, res) => {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log(`Job Role: ${role} added!`)
                                    init();
                                }
                            }
                            )
                        }
                    })
                });

        }
    })}


    //Want it to view choices for departments that are from the departments table, but dont know how to return those values as an array



    function addEmployee() {
        //add emp `INSERT INTO employee (first_name, last_name, role_id, manager_id)`
        db.query(`SELECT name FROM jobrole`, (err, res) => {
            if (err) { throw err } else {
                console.log(res);
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'first',
                        message: `What is the employee's first name?`
                    },
                    {
                        type: 'input',
                        name: 'last',
                        message: `What is the employee's last name?`
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: `What is the employee's role?`,
                        choices: res//some sort of function with a query that gets the roles from the jobrole table (`SELECT title FROM jobrole`)?
                    },
                    // {
                    //     type: 'list',
                    //     name: 'manager',
                    //     message: `Who is the employee's manager?`,
                    //     choices: [getManager()] //Show list of employees for them to chose from and return id?
                    // }

                ]).then(({ first, last, role }) => {
                    db.query(`SELECT id FROM jobrole WHERE name = ?`, role, (err, res) => {
                        if (err) { throw err } else {
                            getManager(first, last, res[0].id)
                            // db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [first, last, res[0].id, manager], (err, res) => {
                            //     if (err) { throw err } else {
                            //         console.log(`Employee: ${first} ${last} added!`);
                            //         init();
                            //     }
                            // })
                        }
                    })
                    //db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES `)
                })
            }
        })

    };

  function  getManager(first, last, role) {
    db.query(`SELECT last_name FROM employee`, (err, res) => {
        if(err) {throw err} else {
            inquirer.prompt({
                type: 'list',
                name: 'manager',
                message: `Who is the employee's manager?`,
                choices: res //Show list of employees for them to chose from and return id?
            })
        }

    }).then((first, last, role, { manager }) => {
        db.query(`SELECT id FROM employee WHERE last_name = ?`, manager, (err, res) => {
            if(err){throw err} else {
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [first, last, role, res[0].id], (err, res) => {
                    if (err) { throw err } else {
                        console.log(`Employee: ${first} ${last} added!`);
                        init();
                    }
                })
            }
        })
    })
    }


function updateEmployee() {
    //display list of employees for user to select from
    //user selects employee and it grabs id from there
    //user selects a new role for that employee
    //db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, )
    //update an employee 
};

init();