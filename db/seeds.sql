INSERT INTO department (dept_name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Customer Service');

INSERT INTO jobrole (title, salary, department_id) 
VALUES 
    ('Engineer', 50000, 2),
    ('Sales Rep', 40000, 1),
    ('Customer Service Agent', 20000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Mikayla', 'Howitz', '2', '3'),
    ('Mary', 'Smith', '1', '3'),
    ('Monkey', 'Luffy', '3', '1'),
    ('Nami', 'Clem', '2', '2');
    




