# Intro to Postgres

> **Postgres**, or **PostgreSQL**, is a powerful, open-source relational database management system (RDBMS) known for its robustness, extensibility, and standards compliance. It is widely used for storing and managing structured data in various applications, from small projects to large-scale enterprise systems.

- [Intro to Postgres](#intro-to-postgres)
  - [Key Features of Postgres](#key-features-of-postgres)
    - [1. User-defined types and functions](#1-user-defined-types-and-functions)
      - [User-defined types](#user-defined-types)
      - [Function](#function)
      - [Stored Procedures](#stored-procedures)
    - [2. Table Inheritance](#2-table-inheritance)

## Key Features of Postgres

- Postgres supports many advanced features, that makes it a popular choice among developers and database administrators:

### 1. User-defined types and functions

#### User-defined types

- Postgres allows us to create our own custom data types and functions, enabling us to tailor the database to our specific application needs. This extensibility is one of Postgres's standout features, allowing for greater flexibility in data modeling and processing.
- User-defined types includes:

  - **Composite types**: We can create complex data structures by combining multiple fields with predefined data types, it's similar to creating a struct in programming languages.
  - **Domain types**: These are simple data types with added constraints, like defining string with email format, number within a specific range, etc.
  - **Enum types**: We can define a set of named values, useful for representing categorical data, like status codes or predefined options.

- User-defined functions can be written in various programming languages, including SQL, PL/pgSQL (Postgres's procedural language), Python, and more. This allows us to encapsulate complex logic and reuse it across our database operations.
- Example of creating a user-defined composite type:

  ```sql
  -- 🔷 CREATING A COMPOSITE TYPE FOR ADDRESS
  CREATE TYPE address AS (
      street VARCHAR(100),
      city VARCHAR(50),
      state VARCHAR(50),
      zip_code VARCHAR(10)
  );

  -- USING THE COMPOSITE TYPE IN A TABLE
  CREATE TABLE customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      home_address address
  );

  -- 🔷 CREATING DOMAIN TYPE
  CREATE DOMAIN email AS VARCHAR(255)
      CHECK (VALUE ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

  -- USING THE DOMAIN TYPE IN A TABLE
  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50),
      email email
  );

  -- 🔷 CREATING ENUM TYPE
  CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'delivered', 'canceled');

  -- USING THE ENUM TYPE IN A TABLE
  CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES customers(id),
      status order_status
  );
  ```

#### Function

- User defined functions in Postgres allow us to create reusable pieces of code that can perform specific tasks or calculations within the database, it's similar to stored procedures but they can return values and be used in SQL queries.
- It's similar to functions in programming languages, allowing us to encapsulate logic and improve code organization.
- Example of creating a user-defined function:

  ```sql
    -- 🔷 CREATING A FUNCTION TO CALCULATE DISCOUNTED PRICE
    CREATE OR REPLACE FUNCTION calculate_discounted_price(
        original_price NUMERIC,
        discount_percentage NUMERIC
    ) RETURNS NUMERIC AS $$

    BEGIN
        RETURN original_price - (original_price * discount_percentage / 100);
    END;
    $$ LANGUAGE plpgsql;

    -- USING THE FUNCTION IN A QUERY
    SELECT calculate_discounted_price(100, 15) AS discounted_price;
  ```

#### Stored Procedures

- Stored procedures in Postgres are similar to user-defined functions, but they are designed to perform a series of operations without returning a value. They can be used to encapsulate complex business logic, data manipulation, and transaction management.
- There are some key difference between functions and stored procedures in Postgres:

  - **Transaction Control:** Stored procedures can manage transactions (commit, rollback) while functions cannot.
  - **Return Values:** Functions return values and can be used in SQL queries, while stored procedures do not return values.
  - **Method of Execution:** While procedures are invoked using the `CALL` statement, functions are called as part of SQL expressions, like it can be used in `SELECT`, `WHERE`, etc.
    - `WHERE calculate_discounted_price(price, discount) < 50`.
    - `CALL update_order_status(123, 'shipped');`
  - **Usages in Queries:** Function can be used directly in SQL queries, while stored procedures are invoked separately using the `CALL` statement.

- Example of creating a stored procedure:

  ```sql
    -- 🔷 CREATING A STORED PROCEDURE TO UPDATE ORDER STATUS
    CREATE OR REPLACE PROCEDURE update_order_status(
        order_id INT,
        new_status order_status
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE orders
        SET status = new_status
        WHERE id = order_id;
    END;
    $$;

    -- USING THE STORED PROCEDURE
    CALL update_order_status(123, 'shipped');
  ```

### 2. Table Inheritance

- Postgres supports table inheritance, It's similar to object-oriented programming, where a child table can inherit columns and constraints from a parent table, it we access parent table, it will include data from child tables as well.
- This feature allows us to create more flexible and organized database schemas, enabling us to model hierarchical relationships between entities effectively.
- Example of table inheritance:

  ```sql
  -- 🔷 CREATING A PARENT TABLE
  CREATE TABLE vehicles (
      id SERIAL PRIMARY KEY,
      make VARCHAR(50),
      model VARCHAR(50),
      year INT
  );

  -- 🔷 CREATING A CHILD TABLE THAT INHERITS FROM THE PARENT TABLE
  CREATE TABLE cars (
      num_doors INT
  ) INHERITS (vehicles);

  CREATE TABLE motorcycles (
      has_sidecar BOOLEAN
  ) INHERITS (vehicles);

  -- INSERTING DATA INTO CHILD TABLES
  INSERT INTO cars (make, model, year, num_doors)
  VALUES ('Toyota', 'Camry', 2020, 4);

  INSERT INTO motorcycles (make, model, year, has_sidecar)
  VALUES ('Harley-Davidson', 'Street 750', 2019, FALSE);

  -- QUERYING THE PARENT TABLE TO GET DATA FROM BOTH CHILD TABLES
  SELECT * FROM vehicles;
  ```

- In this example, we created a parent table `vehicles` and two child tables `cars` and `motorcycles` that inherit from it. When we query the `vehicles` table, it returns data from both child tables, demonstrating the inheritance feature in Postgres.
- `ONLY` keyword can be used to query only the parent table without including data from child tables:

  ```sql
  -- QUERYING ONLY THE PARENT TABLE WITHOUT CHILD TABLES
  SELECT * FROM ONLY vehicles;
  ```
