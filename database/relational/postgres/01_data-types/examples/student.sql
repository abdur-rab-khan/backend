DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS hobbies;
DROP TABLE IF EXISTS user_result;
DROP TABLE IF EXISTS result CASCADE;
DROP TYPE IF EXISTS sem;
DROP TYPE IF EXISTS address;

CREATE TYPE sem AS ENUM ('Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6');

CREATE TYPE address AS (
    road VARCHAR(255),
    city VARCHAR(255),
    pin_code VARCHAR(200),
    state VARCHAR(255)
);

-- Creating Student Table
CREATE TABLE IF NOT EXISTS students (
     student_id SERIAL PRIMARY KEY,
     first_name VARCHAR(200) NOT NULL,
     last_name VARCHAR(200) NOT NULL,
     age SMALLINT NOT NULL,
     enrollment_date DATE,
     address address NOT NULL
);


-- Creating Hobbies Table
CREATE TABLE IF NOT EXISTS hobbies (
    student_id SERIAL PRIMARY KEY,
    hobbies VARCHAR(255)[] CONSTRAINT check_hobbies CHECK(array_length(hobbies, 1) > 0)
);

-- Creating Result Table
CREATE TABLE IF NOT EXISTS result (
    result_id SERIAL PRIMARY KEY,
    date DATE,
    semester SEM,
    marks JSONB NOT NULL
);

-- Creating User result
CREATE TABLE IF NOT EXISTS user_result (
    student_id SERIAL PRIMARY KEY,
    result_id INT,
    CONSTRAINT result_ref FOREIGN KEY (result_id) REFERENCES result(result_id)
    ON DELETE CASCADE,
    CONSTRAINT student_ref FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON DELETE CASCADE
);