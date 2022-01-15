DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS jobrole;
DROP TABLE IF EXISTS employee;

CREATE TABLE department (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
);

CREATE TABLE jobrole (
    id INTEGER PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    CONSTRAINT department_id FOREIGN KEY (id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    CONSTRAINT role_id FOREIGN KEY (id) REFERENCES jobrole(id),
    manager_id INTEGER
);
