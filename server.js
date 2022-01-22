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
    console.log('Connected to the business database!')
);
//Initial function asking what the user would like to do
const init = function () {
    inquirer.prompt({
        type: 'list',
        name: 'firstPrompt',
        messsage: 'What would you like to do?',
        choices: ['View all departments', 'View all Roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
    })
        //if statements that do things based on what the user choses
        .then(({ firstPrompt }) => {
            if (firstPrompt === 'View all departments') {
                db.promise().query(`SELECT * FROM department`).then(viewDepts => {
                    console.table(viewDepts[0])
                    init();
                })
            } else if (firstPrompt === 'View all Roles') {
                db.promise().query(`SELECT * FROM jobrole`).then(viewRoles => {
                    console.table(viewRoles[0]);
                    init();
                })
            } else if (firstPrompt === 'View all employees') {
                db.promise().query('SELECT * FROM `employee`').then(viewEmps => {
                    console.table(viewEmps[0]);
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
                console.log(`To exit press 'Ctrl' + 'C'`);
                
            }

        })
};
//adds a new department based on what text the user inputs
function addDept() {
    inquirer.prompt({
        type: 'input',
        name: 'dept_name',
        message: 'What is the department name?'
    })
        .then(({ dept_name }) => {
            db.promise().query(`INSERT INTO department (dept_name) VALUES ('${dept_name}')`).then(addDept => {
                //console.log(addDept);
                console.log(`New department Added : ${dept_name}`);
                init();
            })

        })
};

//adds a new role
const addRole = async () => {
    //this gets the departments that exist before prompts so user can chose from them
   const getDepts = await db.promise().query(`SELECT dept_name as name, id as value FROM department`);
    //const deptArr = getDepts[0].map((dept) => ({ name:dept.dept_name, value:dept.id }));
          const userInput = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the new job role you would like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary for this role?'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'What department is this role in?',
                choices: getDepts[0] //these are the departments that exist
            }
        ]);
        
        const newRole = await db.promise().query(`INSERT INTO jobrole SET ?`, userInput);
        console.log(`Job Role: ${userInput.title} added!`);
        init();
        };


 const addEmployee = async () => {
        //this gets all of the jobrole titles from the jobrole table for choices
        const getRoles = await db.promise().query(`SELECT title as name, id as value FROM jobrole`);
        const getEmployees = await db.promise().query(`SELECT concat(first_name,' ',last_name) as name, id as value FROM employee`)
        const userInput = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: `What is the employee's first name?`
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: `What is the employee's last name?`
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: `What is the employee's role?`,
                        choices: getRoles[0]//some sort of function with a query that gets the roles from the jobrole table (`SELECT title FROM jobrole`)?
                    },
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: `Who is the employee's manager?`,
                        choices: getEmployees[0] //Show list of employees for them to chose from and return id?
                    }

                ])
                const newEmp = await db.promise().query(`INSERT INTO employee SET ?`, userInput);
                console.log(`Employee: ${userInput.first_name} ${userInput.last_name} added! `);
                init();
    };

updateEmployee = async () =>{
   
    //query then display list of employees for user to select from
    const getEmps = await db.promise().query(`SELECT concat(first_name,' ', last_name) as name, id as value FROM employee`);
    const getRoles = await db.promise().query(`SELECT title as name, id as value FROM jobrole`);

    //user selects employee and it grabs id from there
    //user selects a new role for that employee
    const userInput = await inquirer.prompt([
        {//This one displays list of employees to choose from
            type: 'list',
            name: 'id',
            message: 'Who is the employee you would like to change the role for?',
            choices: getEmps[0]
        },
        {//this displays list and it will change the role of that employee to that list
            type: 'list',
            name: 'role_id',
            message: 'What roll would you like to change this employee to?',
            choices: getRoles[0]
        }
    ])
    const updateEmp = await db.promise().query(`UPDATE employee SET role_id = ? WHERE id = ?`, [userInput.role_id, userInput.id]);
    console.log(`Employee: ${userInput.id} New Role: ${userInput.role_id}`)
    init();
    

};

init();