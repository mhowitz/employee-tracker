const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();

const db = mysql.createConnection(
    {

        host: process.env.DB_HOST,
        //YourMySql username,
        user: process.env.DB_USER,
        //YOUR mysql password
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE
    },
    console.log('Connected to the election database!')
);

const init = function() {
    inquirer.prompt ({
        type: 'list',
        name: 'firstPrompt',
        messsage: 'What would you like to do?',
        choices: ['View all departments', 'View all Roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
    })
    .then(({ firstPrompt }) => {
        if(firstPrompt === 'View all departments'){
            db.promise().query(`SELECT * FROM department`

            ).then(viewDepts => {
                console.log(viewDepts[0])
            })
        } else if(firstPrompt === 'View all Roles') {
            db.promise().query(`SELECT * FROM jobrole`).then(viewRoles => {
                console.log(viewRoles[0])
            })
        } else if(firstPrompt === 'View all Employees') {
            db.promise().query(`SELECT * FROM employee`).then(viewEmps => {
                console.log(viewEmps[0])
            })
        } else if (firstPrompt === 'Add a department') {
            addDept();
        }

})}

function addDept() {
    inquirer.prompt({
        type: 'input',
        name: 'dept',
        message:'What is the department name?'
    })
    .then(({ dept }) => {
        db.promise().query(`INSERT INTO department (name) VALUES (${dept})`).then(addDept => {
            console.log(addDept[0])
    })
    
})}
//db.promise().query(`INSERT INTO department ()`).then(addDept => {
//     console.log(addDept[0])
// })

init();