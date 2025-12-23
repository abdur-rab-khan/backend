DROP TABLE IF EXISTS users;
DROP DOMAIN IF EXISTS email;

-- CREATING A DOMAIN TYPE FOR EMAIL ADDRESS
CREATE DOMAIN email AS VARCHAR(255)
    CHECK (VALUE ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    email email
);