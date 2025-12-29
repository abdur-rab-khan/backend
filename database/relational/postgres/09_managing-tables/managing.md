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

  - **`CREATE TABLE`**: Command to create a new table.
  - **`IF NOT EXISTS`**: Optional clause to avoid an error if the table already exists.
  - **`table_name`**: Name of the table to be created.
  - **`column1`, `column2`, ...**: Names of the columns in the table.
  - **`datatype`**: Data type for each column (e.g., `INTEGER`, `VARCHAR`, `DATE`).
  - **`constraint`**: Optional constraints (e.g., `PRIMARY KEY`, `NOT NULL`).

- **Constraints**:

  - **`PRIMARY KEY`**: Uniquely identifies each record in the table, a table has only and only one primary key.
  - **`FOREIGN KEY`**: Ensures referential integrity between two tables.
  - **`UNIQUE`**: Ensures all values in a column are unique.
  - **`NOT NULL`**: Ensures a column cannot have a NULL value.
  - **`CHECK`**: Ensures that all values in a column satisfy a specific condition.
  - **`DEFAULT`**: Sets a default value for a column when no value is specified.
  - **`SERIAL`**: Auto-incrementing integer, often used for primary keys.

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

- After creating tables, we can see using `\d` command in psql that shows the structure of the tables created.

## Altering Tables

- Modifying an existing table is done using the `ALTER TABLE` statement, which allows you to add, modify, or drop columns and constraints.
- Syntax to alter a table:

  ```sql
    -- Add a new column
    ALTER TABLE table_name
    ADD column_name datatype [constraint];

    -- Drop an existing column, you can't drop a column if it is part of view, trigger, stored, procedure etc. Use "CASCADE" to drop dependent objects as well.
    ALTER TABLE table_name
    DROP COLUMN [IF EXISTS] column_name;

    -- Modify the data type of an existing column, "USING" clause can be used to convert existing data to the new type if necessary, otherwise postgres will try implicit conversion. it fails then an error is raised, like '1234'::integer.
    ALTER TABLE table_name
    ALTER COLUMN column_name SET DATA TYPE new_datatype;

    -- Set a default value for an existing column
    ALTER TABLE table_name
    ALTER COLUMN column_name SET DEFAULT default_value;

    -- Rename a column, if the changing column is used in view, trigger, stored procedure etc then postgres will automatically update those dependent objects.
    ALTER TABLE table_name
    RENAME COLUMN old_column_name TO new_column_name;

    -- Add a new constraint
    ALTER TABLE table_name
    ADD CONSTRAINT constraint_name constraint_definition;

    -- Drop an existing constraint
    ALTER TABLE table_name
    DROP CONSTRAINT constraint_name;

    -- Rename the table
    ALTER TABLE old_table_name
    RENAME TO new_table_name;

    -- Drop the table
    DROP TABLE [IF EXISTS] table_name;
  ```

## Truncating Tables

- To remove all rows from a table we can use `DELETE` without a `WHERE` clause but it is slower and not efficient for large tables.
- Instead, we can use the `TRUNCATE` command which is faster and reclaims storage space.
- It given table is referenced by foreign keys from other tables, we can use `CASCADE` option to truncate those dependent tables as well.
- Syntax to truncate a table:

  ```sql
    TRUNCATE TABLE [ONLY] table_name [, ...] [CASCADE | RESTRICT];
  ```

## Identity Column

- In PostgreSQL, version 10 and later, you can use `IDENTITY` columns as an alternative to `SERIAL` for auto-incrementing primary keys.
- Syntax to create an identity column:

  ```sql
    column_name
      data_type [SMALLINT | INTEGER | BIGINT]
      GENERATED { ALWAYS | BY DEFAULT } AS IDENTITY
      [ ( sequence_options ) ]
  ```

  - **`GENERATED ALWAYS AS IDENTITY`**: The database always generates a value for the column, and you cannot insert a value manually.
  - **`GENERATED BY DEFAULT AS IDENTITY`**: The database generates a value for the column unless you provide one manually.
  - **`sequence_options`**: Options to customize the sequence, such as `START WITH`, `INCREMENT BY`, `MINVALUE`, `MAXVALUE`, and `CYCLE`.

    - `START WITH n`: Specifies the starting value of the sequence, default is 1.
    - `INCREMENT BY n`: Specifies the increment value for the sequence, default is 1.
    - `MINVALUE n`: Specifies the minimum value of the sequence, default is 1.
    - `MAXVALUE n`: Specifies the maximum value of the sequence, default is no maximum.
    - `CYCLE`: Specifies that the sequence should restart from the minimum value when the maximum value is reached.

### Example of Creating a Table with Identity Column

- Example: Creating a `products` table with an identity column

  ```sql
    CREATE TABLE IF NOT EXISTS products (
        product_id INTEGER GENERATED ALWAYS AS IDENTITY START WITH 1 INCREMENT BY 1 PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  ```

  - This command creates a `products` table with four columns: `product_id`, `product_name`, `price`, and `created_at`. The `product_id` is an identity column that auto-increments and serves as the primary key.

## Temporary Tables

- Temporary tables are used to store intermediate results and are automatically dropped at the end of the session or transaction.
- Syntax to create a temporary table:

  ```sql
    CREATE TEMPORARY TABLE [IF NOT EXISTS] temp_table_name (
        column1 datatype [constraint],
        column2 datatype [constraint],
        ...
    ) ON COMMIT { PRESERVE ROWS | DELETE ROWS | DROP };
  ```

  - **`CREATE TEMPORARY TABLE`**: Command to create a temporary table.
  - **`ON COMMIT`**: Specifies the behavior of the temporary table at the end of a transaction:
    - `PRESERVE ROWS`: Keeps the rows in the table (default behavior).
    - `DELETE ROWS`: Deletes all rows from the table.
    - `DROP`: Drops the temporary table.

### Example of Creating a Temporary Table

- Example: Creating a temporary table `temp_orders`

  ```sql
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_orders (
        order_id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ON COMMIT DELETE ROWS;
  ```

  - This command creates a temporary table `temp_orders` with four columns: `order_id`, `product_id`, `quantity`, and `order_date`. The `order_id` is the primary key and auto-increments. The table will delete all rows at the end of each transaction.

- Temporary tables are useful for storing data that is only needed for the duration of a session or transaction, such as intermediate results in complex queries or temporary data processing.

## Generated Columns

- Generated columns are virtual columns that are computed (generated) from other columns in the same table, either stored or virtual.
- Suppose you have a table with `first_name` and `last_name` columns, you can create a generated column `full_name` that concatenates these two columns when it is queried.
- Types of generated columns:

  - **Stored Generated Columns**: The computed value is stored on disk.
  - **Virtual Generated Columns**: The computed value is not stored on disk but calculated on-the-fly when queried.

- Syntax to create a generated column:

  ```sql
    column_name
      data_type
        GENERATED ALWAYS AS ( generation_expression ) [ STORED | VIRTUAL ]
  ```

## Example of Creating a Table with Generated Column

- Example: Creating a `users` table with a generated column `full_name`

  ```sql
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        full_name VARCHAR(101) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED
    );
  ```

  - This command creates a `users` table with four columns: `user_id`, `first_name`, `last_name`, and `full_name`. The `full_name` column is a stored generated column that concatenates `first_name` and `last_name`.
