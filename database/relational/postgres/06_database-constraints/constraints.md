# Postgres Database Constraints

> Database constraints are rules applied to table columns to enforce data integrity and consistency. They help ensure that the data entered into the database adheres to specific rules and conditions.

- [Postgres Database Constraints](#postgres-database-constraints)
  - [Primary Key Constraint](#primary-key-constraint)
  - [Foreign Key Constraint](#foreign-key-constraint)
  - [Check Constraint](#check-constraint)
  - [Unique Constraint](#unique-constraint)
  - [NOT NULL Constraint](#not-null-constraint)
  - [DEFAULT Constraint](#default-constraint)

## Primary Key Constraint

- The **Primary Key Constraint** defines a column (or a set of columns) that uniquely identifies each record in a table. A table can have only one primary key, which can consist of one or multiple columns (composite key).
- If column is defined as a primary key, it automatically has the following properties:

  - **Uniqueness**: No two rows can have the same value(s) in the primary key column(s).
  - **Not Null**: Primary key columns cannot contain NULL values.
  - **Indexing**: A unique index is automatically created on the primary key column(s) to optimize query performance.

- Syntax to define a primary key constraint:

  ```sql
    CREATE TABLE table_name (
        column1 datatype CONSTRAINT constraint_name PRIMARY KEY,
        column2 datatype,
        ...
    );
  ```

  - **`CONSTRAINT constraint_name`**: Optional clause to name the constraint, otherwise the system generates a default name.
  - **`PRIMARY KEY`**: Keyword to define the primary key constraint on the specified column(s).

- Syntax to define a composite primary key:

  ```sql
    CREATE TABLE table_name (
        column1 datatype,
        column2 datatype,
        ...
        CONSTRAINT constraint_name PRIMARY KEY (column1, column2)
    );
  ```

  - **Composite Primary Key**: The primary key is defined on multiple columns, ensuring the combination of values in these columns is unique.

- Syntax to add a primary key constraint to an existing table:

  ```sql
    ALTER TABLE table_name
    ADD CONSTRAINT constraint_name PRIMARY KEY (column1, column2);
  ```

  - This command adds a primary key constraint to the specified columns of an existing table.

- Syntax to drop a primary key constraint:

  ```sql
    ALTER TABLE table_name
    DROP CONSTRAINT constraint_name;
  ```

  - If does not knowing the constraint name, we can see using `\d table_name` in psql.
  - This command removes the primary key constraint from the specified table.

## Foreign Key Constraint

- The **Foreign Key Constraint** establishes a link between two tables by enforcing referential integrity. It ensures that the value in a column (or a set of columns) in one table matches a value in the primary key column(s) of another table.
- A foreign key can reference a primary key or a unique key in another table.
- Postgres allows to perform actions on foreign key constraints when the corresponding primary key is updated or deleted, such as `CASCADE`, `SET NULL`, `SET DEFAULT`, and `RESTRICT`:

  - **CASCADE**: Automatically updates or deletes the related rows in the child table when the corresponding row in the parent table is updated or deleted.
  - **SET NULL**: Sets the foreign key column(s) in the child table to NULL when the corresponding row in the parent table is deleted.
  - **SET DEFAULT**: Sets the foreign key column(s) in the child table to their default value when the corresponding row in the parent table is deleted.
  - **RESTRICT**: Prevents the deletion or update of the parent row if there are related rows in the child table.
  - If no action is specified, the default behavior is `RESTRICT`.

- Syntax to define a foreign key constraint:

  ```sql
    CREATE TABLE table_name (
        column1 datatype,
        column2 datatype,
        ...
        CONSTRAINT constraint_name FOREIGN KEY (column1)
            REFERENCES parent_table (parent_column)
            ON DELETE action
            ON UPDATE action
    );

    -- OR can also be defined inline as
    CREATE TABLE table_name (
        column1 datatype REFERENCES parent_table (parent_column)
            ON DELETE action
            ON UPDATE action,
        column2 datatype,
        ...
    );
  ```

  - **`FOREIGN KEY (column1)`**: Specifies the column(s) in the child table that will hold the foreign key.
  - **`REFERENCES parent_table (parent_column)`**: Specifies the parent table and the column(s) that the foreign key references.
  - **`ON DELETE action`**: Specifies the action to take when a referenced row in the parent table is deleted.
  - **`ON UPDATE action`**: Specifies the action to take when a referenced row in the parent table is updated.

- Syntax to add a foreign key constraint to an existing table:

  ```sql
    ALTER TABLE table_name
    ADD CONSTRAINT constraint_name FOREIGN KEY (column1)
        REFERENCES parent_table (parent_column)
        ON DELETE action
        ON UPDATE action;
  ```

  - This command adds a foreign key constraint to the specified column(s) of an existing table.

- Syntax to drop a foreign key constraint:

  ```sql
    ALTER TABLE table_name
    DROP CONSTRAINT constraint_name;
  ```

  - If does not knowing the constraint name, we can see using `\d table_name` in psql.

## Check Constraint

- The **Check Constraint** allows to ensure the integrity (validity) of data in a column by specifying a condition that must be met for the data to be accepted.
- The condition can involve one or more columns and can use various operators and functions.
- It uses boolean expressions to validate data before it is inserted or updated in the table.
- If the condition evaluates to `TRUE`, the data is accepted; if it evaluates to `FALSE` or `UNKNOWN`, the data is rejected.

- Syntax to define a check constraint:

  ```sql
    CREATE TABLE table_name (
        column1 datatype,
        column2 datatype,
        ...
        CONSTRAINT constraint_name CHECK (condition)
    );
  ```

  - **`CHECK (condition)`**: Specifies the condition that must be met for the data to be accepted, it could be any valid SQL expression that returns a boolean value such as comparisons, logical operations, or function calls.

- Syntax to add a check constraint to an existing table:

  ```sql
    ALTER TABLE table_name
    ADD CONSTRAINT constraint_name CHECK (condition);
  ```

- Example of a check constraint:

  ```sql
    CREATE TABLE employees (
        employee_id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        age INTEGER,
        salary NUMERIC(10, 2),
        CONSTRAINT chk_age CHECK (age >= 18),
        CONSTRAINT chk_salary CHECK (salary > 0)
    );
  ```

  - In this example, the `chk_age` constraint ensures that the `age` column must be at least 18, and the `chk_salary` constraint ensures that the `salary` column must be greater than 0.
  - This command creates an `employees` table with five columns: `employee_id`, `first_name`, `last_name`, `age`, and `salary`. The `chk_age` constraint ensures that the age is at least 18, and the `chk_salary` constraint ensures that the salary is a positive value.

- Example of using functions in check constraints:

  ```sql
    CREATE TABLE products (
        product_id SERIAL PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2),
        stock_quantity INTEGER,
        CONSTRAINT chk_price CHECK (price >= 0),
        CONSTRAINT chk_stock CHECK (stock_quantity >= 0 AND stock_quantity <= 1000),
        CONSTRAINT chk_name CHECK (LENGTH(TRIM(product_name)) > 0
    );
  ```

## Unique Constraint

- The **Unique Constraint** ensures that all values in a column (or a set of columns) are unique across the table. This means that no two rows can have the same value(s) in the specified column(s).
- A table can have multiple unique constraints, allowing for the enforcement of uniqueness on different columns or combinations of columns.
- When a column is defined with a unique constraint, Postgres automatically creates a unique index on that column to optimize query performance.
- Syntax to define a unique constraint:

  ```sql
    CREATE TABLE table_name (
        column1 datatype CONSTRAINT constraint_name UNIQUE,
        column2 datatype,
        ...
        -- Or can also be defined at the end as
        UNIQUE (column1)
    );
  ```

  - **`UNIQUE`**: Keyword to define the unique constraint on the specified column(s).

- Syntax to define a composite unique constraint:

  ```sql
    CREATE TABLE table_name (
        column1 datatype,
        column2 datatype,
        ...
        CONSTRAINT constraint_name UNIQUE (column1, column2)
    );
  ```

  - **Composite Unique Constraint**: The unique constraint is defined on multiple columns, ensuring the combination of values in these columns is unique.

- Syntax to add a unique constraint to an existing table:

  ```sql
    ALTER TABLE table_name
    ADD CONSTRAINT constraint_name UNIQUE (column1, column2);
  ```

- Unique constraints can also be created using the `CREATE UNIQUE INDEX` statement:

  ```sql
    CREATE UNIQUE INDEX CONCURRENTLY equipment_equip_id
    ON equipment (equip_id);
  ```

  - This command creates a unique index on the specified column(s) of the table, enforcing uniqueness

## NOT NULL Constraint

- The **NOT NULL Constraint** ensures that a column cannot have a NULL value. This means that every row in the table must have a valid (non-NULL) value for the specified column.
- When a column is defined with a NOT NULL constraint, any attempt to insert or update a row with a NULL value in that column will result in an error.
- `IS NULL` and `IS NOT NULL` operators can be used in SQL queries to filter rows based on whether a column contains NULL values or not.
- Syntax to define a NOT NULL constraint:

  ```sql
    CREATE TABLE table_name (
        column1 datatype NOT NULL,
        column2 datatype,
        ...
    );
  ```

  - **`NOT NULL`**: Keyword to define the NOT NULL constraint on the specified column.

- Syntax to add a NOT NULL constraint to an existing table:

  ```sql
    ALTER TABLE table_name
    ALTER COLUMN column1 SET NOT NULL;
  ```

- Syntax to drop a NOT NULL constraint from an existing table:

  ```sql
    ALTER TABLE table_name
    ALTER COLUMN column1 DROP NOT NULL;
  ```

## DEFAULT Constraint

- The **DEFAULT Constraint** sets a default value for a column when no value is specified during an insert operation. It will automatically assign the default value to the column if no explicit value is provided.
- If no default value is specified, the column will have a `NULL` value that make sense because `NOT NULL` constraint can be used to prevent `NULL` values.
- Syntax to define a default constraint:

  ```sql
    CREATE TABLE table_name (
        column1 datatype DEFAULT default_value,
        column2 datatype,
        ...
    );
  ```

  - **`DEFAULT default_value`**: Specifies the default value to be assigned to the column when no value is provided.
  -

- Syntax to add a default constraint to an existing table:

  ```sql
    ALTER TABLE table_name
    ALTER COLUMN column1 SET DEFAULT default_value;
  ```

- Syntax to drop a default constraint from an existing table:

  ```sql
    ALTER TABLE table_name
    ALTER COLUMN column1 DROP DEFAULT;
  ```
