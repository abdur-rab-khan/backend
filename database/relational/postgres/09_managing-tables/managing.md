# Managing Tables in PostgreSQL

> Managing tables is a fundamental aspect of working with relational databases. In PostgreSQL, you can **create**, **modify**, and **delete** tables using SQL commands. This section covers the essential operations for managing tables.

## Creating Tables

- Creating a table in PostgreSQL is done using the `CREATE TABLE` statement, that defines the table structure, including columns and their data types with optional constraints.
- Syntax to create a table:

  ```sql
    CREATE TABLE [IF NOT EXISTS] table_name (
        column1 datatype [constraint],
        column2 datatype [constraint],
        ...
    );
  ```

  - `CREATE TABLE`: Command to create a new table.
  - `IF NOT EXISTS`: Optional clause to avoid an error if the table already exists.
  - `table_name`: Name of the table to be created.
  - `column1`, `column2`, ...: Names of the columns in the table.
  - `datatype`: Data type for each column (e.g., `INTEGER`, `VARCHAR`, `DATE`).
  - `constraint`: Optional constraints (e.g., `PRIMARY KEY`, `NOT NULL`).

- **Constraints**:

  - `PRIMARY KEY`: Uniquely identifies each record in the table, a table has only and only one primary key.
  - `FOREIGN KEY`: Ensures referential integrity between two tables.
  - `UNIQUE`: Ensures all values in a column are unique.
  - `NOT NULL`: Ensures a column cannot have a NULL value.
  - `CHECK`: Ensures that all values in a column satisfy a specific condition.
  - `DEFAULT`: Sets a default value for a column when no value is specified.
  - `SERIAL`: Auto-incrementing integer, often used for primary keys.

### Example of Creating a Table

- Example: Creating a `customers` table

  ```sql
    CREATE TABLE IF NOT EXISTS customers (
        customer_id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  ```

  - This command creates a `customers` table with five columns: `customer_id`, `first_name`, `last_name`, `email`, and `created_at`. The `customer_id` is the primary key and auto-increments, while the `email` must be unique and not null.

- Example: Creating an `accounts` table:

  ```sql
    CREATE TABLE IF NOT EXISTS accounts (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(50)
            CHECK(LENGTH(TRIM(password)) > 12)
            NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        last_login TIMESTAMP
    );
  ```

  - This command creates an `accounts` table with six columns: `user_id`, `username`, `password`, `email`, `created_at`, and `last_login`. The `user_id` is the primary key and auto-increments, while the `username` must be unique and not null. The `password` column has a check constraint to ensure it is longer than 12 characters.
