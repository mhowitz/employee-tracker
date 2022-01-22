DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS jobrole;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(30)
);

CREATE TABLE jobrole (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES jobrole(id) ON DELETE SET NULL,
    manager_id INTEGER
);





