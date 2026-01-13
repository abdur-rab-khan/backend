# Modifying Data in PostgreSQL

> In this section, we will explore how to `INSERT`, `UPDATE`, and `DELETE` data in PostgreSQL tables.

- [Modifying Data in PostgreSQL](#modifying-data-in-postgresql)
  - [Inserting Data](#inserting-data)
    - [Example:](#example)
  - [Updating Data](#updating-data)
    - [Example updating data:](#example-updating-data)
  - [Update with Join](#update-with-join)
  - [Deleting Data](#deleting-data)
    - [Delete with Join](#delete-with-join)
  - [Upsert (Insert or Update)](#upsert-insert-or-update)
  - [Merge Statement (PostgreSQL 15+)](#merge-statement-postgresql-15)

## Inserting Data

- `INSERT INTO` statement is used to add new rows to a table, specifying the table name and the values to be inserted.
- Syntax:

  ```sql
  INSERT INTO table_name (column1, column2, column3, ...)
    VALUES (value1, value2, value3, ...)
    [RETURNING *];
  ```

  - `table_name`: The name of the table where the data will be inserted.
  - `column1, column2, ...`: The columns in the table where the values will be inserted.
  - `value1, value2, ...`: The values to be inserted into the specified columns, value must be as per given in the column datatype.
  - `RETURNING *`: Optional clause to return the inserted row(s), `*` can be replaced with specific column names if needed.

- `INSERT INTO` returns a command tag indicating the number of rows inserted, e.g., `INSERT 0 1` for a single row insertion, `0` indicates the OID (Object Identifier) which is not used in modern PostgreSQL versions.

### Example:

- Example: Inserting a new employee into the `employees` table.

  ```sql
  INSERT INTO employees (first_name, last_name, email, hire_date)
    VALUES ('John', 'Doe', 'someone@some.com', '2024-06-01')
  ```

  - This command inserts a new row into the `employees` table with the specified values for `first_name`, `last_name`, `email`, and `hire_date`.

  - If you want to return the inserted row, you can use the `RETURNING` clause:

    ```sql
    INSERT INTO employees (first_name, last_name, email, hire_date)
      VALUES ('John', 'Doe', 'someone@some.com', '2024-06-01')
    RETURNING *;
    ```

  - Let's return only the `id` of the newly inserted employee:

    ```sql
    INSERT INTO employees (first_name, last_name, email, hire_date)
      VALUES ('John', 'Doe', 'someone@some.com', '2024-06-01')
    RETURNING id;
    ```

- Example: Inserting multiple rows into the `employees` table.

  ```sql
  INSERT INTO employees (first_name, last_name, email, hire_date)
    VALUES
      ('Alice', 'Smith', 'alice@gamil.com', '2024-05-15'),
      ('Bob', 'Johnson', 'bob@gmail.com', '2024-05-20'),
      ('Charlie', 'Brown', 'charlie@gmail.com', '2024-05-25')
    RETURNING *;
  ```

## Updating Data

- `UPDATE` statement is used to modify existing rows in a table, specifying the table name, the columns to be updated, and the new values.
- Syntax:

  ```sql
  UPDATE table_name
    SET column1 = value1, column2 = value2, ...
    [WHERE condition] -- Optional: If not specified, all rows will be updated
    [RETURNING *];
  ```

  - `table_name`: The name of the table where the data will be updated.
  - `column1 = value1, column2 = value2, ...`: The columns to be updated and their new values.
  - `WHERE condition`: Optional clause to specify which rows to update. If omitted, all rows in the table will be updated.
  - `RETURNING *`: Optional clause to return the updated row(s), `*` can be replaced with specific column names if needed.

- It will return a command tag indicating the number of rows updated, e.g., `UPDATE 3` for three rows updated.

### Example updating data:

- Example: Updating an employee's salary in the `employees` table.

  ```sql
  UPDATE employees
    SET salary = 75000
  ```

  - This command updates the `salary` column for all rows in the `employees` table to `75000`.

- Example: Incrementing an employee's salary by 10%.

  ```sql
  UPDATE employees
    SET salary = salary * 1.10
    WHERE id = 1
  ```

  - This command increases the `salary` of the employee with `id` 1 by 10%.

- Example: Updating multiple columns for a specific employee.

  ```sql
    UPDATE employees
        SET hire_date = '2024-06-15',
            salary = 80000
    WHERE id = 2
  ```

  - This command updates the `hire_date` and `salary` for the employee with `id` 2.

## Update with Join

- We can perform an `UPDATE` operation that involves joining another table to determine which rows to update.
- Syntax:

  ```sql
  UPDATE table1 [AS t1 | space t1]
  SET column1 = value1, column2 = value2, ...
  FROM table2 [AS t2 | space t2]
  WHERE table1.common_column = table2.common_column
    AND additional_conditions;
  ```

  - `table1`: The table to be updated.
  - `table2`: The table to join with for determining which rows to update.
  - `common_column`: The column used to join the two tables.
  - `additional_conditions`: Any extra conditions to filter the rows to be updated.

- Example: Updating employee salaries based on department budget.

  ```sql
    UPDATE
        employees AS e
    SET
        salary = salary * 1.05
    FROM
        departments AS d
    WHERE
        e.department_id = d.id AND d.budget > 1000000;
  ```

  - This command increases the salary of employees by 5% if their department's budget is greater than 1,000,000.

- Example: Updating columns using data from another table, suppose we want to update the `employees salary` based on the `performance` table.

  ```sql
    UPDATE
        employees AS e
    SET
        salary = salary + p.bonus
    FROM
        performance AS p
    WHERE
        e.id = p.employee_id AND p.year = EXTRACT(YEAR FROM CURRENT_DATE);
  ```

  - This command updates the `salary` of employees by adding the `bonus` from the `performance` table for the year 2023.

- Example: Updating columns using data from another table, suppose we want to update the `employees salary` based on the `performance` table + based on rating.

  ```sql
  UPDATE
      employees AS e
  SET
      salary = CASE
          WHEN p.rating = 'A' THEN salary * 1.10
          WHEN p.rating = 'B' THEN salary * 1.05
          ELSE salary
      END
  FROM
      performance AS p
  WHERE
      e.id = p.employee_id AND p.year = EXTRACT(YEAR FROM CURRENT_DATE);
  ```

## Deleting Data

- `DELETE FROM` statement is used to remove rows from a table, specifying the table name and the condition for deletion.
- Syntax:

  ```sql
  DELETE FROM table_name
    [WHERE condition] -- Optional: If not specified, all rows will be deleted
    [RETURNING *];
  ```

  - `table_name`: The name of the table from which rows will be deleted.
  - `WHERE condition`: Optional clause to specify which rows to delete. If omitted, all rows in the table will be deleted.
  - `RETURNING *`: Optional clause to return the deleted row(s), `*` can be replaced with specific column names if needed.

- It will return a command tag indicating the number of rows deleted, e.g., `DELETE 2` for two rows deleted.

- Example: Deleting an employee from the `employees` table.

  ```sql
  DELETE FROM employees
    WHERE id = 3
  ```

  - This command deletes the row from the `employees` table where the `id` is `3`.

- Example: Deleting all employees hired before a specific date.

  ```sql
    DELETE FROM employees
        WHERE hire_date < '2020-01-01'
  ```

  - This command deletes all rows from the `employees` table where the `hire_date` is before January 1, 2020.

- Example: Deleting all rows from a table.

  ```sql
    DELETE FROM employees
  ```

  - This command deletes all rows from the `employees` table. Use with caution!

- Example: Deleting and returning deleted rows.

  ```sql
    DELETE FROM employees
        WHERE department_id = 5
    RETURNING *;
  ```

  - This command deletes all employees in department `5` and returns the deleted rows.

### Delete with Join

- We can perform a `DELETE` operation that involves joining another table to determine which rows to delete.

- Syntax:

  ```sql
    DELETE FROM table1 [AS t1 | space t1]
    USING table2 [AS t2 | space t2]
    WHERE table1.common_column = table2.common_column
        AND additional_conditions;
  ```

  - `table1`: The table from which rows will be deleted.
  - `table2`: The table to join with for determining which rows to delete.
  - `common_column`: The column used to join the two tables.
  - `additional_conditions`: Any extra conditions to filter the rows to be deleted.

- Example: Deleting employees based on department status.

  ```sql
    DELETE FROM
        employees AS e
    USING
        departments AS d
    WHERE
        e.department_id = d.id AND d.status = 'inactive';
  ```

  - This command deletes employees who belong to departments marked as 'inactive'.

- Example: Deleting records from one table based on conditions in another table, suppose we want to delete employees who have no performance records for the current year.

  ```sql
    DELETE FROM
        employees AS e
    USING
        performance AS p
    WHERE
        e.id = p.employee_id AND p.year <> EXTRACT(YEAR FROM CURRENT_DATE);
  ```

  - This command deletes employees who do not have performance records for the current year.

## Upsert (Insert or Update)

- Upsert is a combination of `INSERT` and `UPDATE` operations. It allows you to insert a new row or update an existing row if a conflict occurs (e.g., duplicate key).
- Syntax:

  ```sql
    INSERT INTO table_name (column1, column2, ...)
        VALUES (value1, value2, ...)
    ON CONFLICT (conflict_column)
    DO UPDATE SET column1 = EXCLUDED.column1, column2 = EXCLUDED.column2, ...;
  ```

  - `table_name`: The name of the table where the data will be inserted or updated.
  - `column1, column2, ...`: The columns in the table where the values will be inserted or updated.
  - `value1, value2, ...`: The values to be inserted into the specified columns.
  - `conflict_column`: The column that may cause a conflict (e.g., primary key or unique constraint), means if a row with the same value in this column already exists.
  - `DO UPDATE SET`: Specifies the columns to be updated if a conflict occurs.
  - `EXCLUDED`: A special table that contains the values proposed for insertion.

- Example: Upserting an employee record.

  ```sql
    INSERT INTO products (id, name, price)
        VALUES (1, 'Laptop', 1200)
    ON
        CONFLICT (id)
    DO
        UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price;
  ```

  - This command attempts to insert a new product with `id` 1. If a product with `id` 1 already exists, it updates the `name` and `price` of the existing product with the new values.

- Example: Upserting multiple records.

  ```sql
    INSERT INTO products (id, name, price)
        VALUES
            (1, 'Laptop', 1200),
            (2, 'Smartphone', 800),
            (3, 'Tablet', 500)
    ON
        CONFLICT (id)
    DO
        UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price;
  ```

  - This command attempts to insert multiple products. If any product with the same `id` already exists, it updates the `name` and `price` of those existing products with the new values.

- Example: Upserting with condition.

  ```sql
    INSERT INTO employees (id, first_name, last_name, salary)
        VALUES (1, 'Jane', 'Doe', 70000)
    ON
        CONFLICT (id)
    DO
        UPDATE SET salary = EXCLUDED.salary
    WHERE
        employees.salary < EXCLUDED.salary;
  ```

  - This command attempts to insert a new employee with `id` 1. If an employee with `id` 1 already exists, it updates the `salary` only if the new salary is higher than the existing salary.

- Example: Upserting with joined data.

  ```sql
    INSERT INTO employees (id, first_name, last_name, department_id)
        SELECT id, first_name, last_name, department_id
        FROM new_employees
    ON
        CONFLICT (id)
    DO
        UPDATE SET first_name = EXCLUDED.first_name,
                   last_name = EXCLUDED.last_name,
                   department_id = EXCLUDED.department_id;
  ```

  - This command inserts new employee records from the `new_employees` table. If an employee with the same `id` already exists in the `employees` table, it updates their `first_name`, `last_name`, and `department_id` with the new values.

## Merge Statement (PostgreSQL 15+)

- The `MERGE` statement allows you to perform `INSERT`, `UPDATE`, or `DELETE` operations based on whether a condition matches between a target table and a source table.
- It's smart way to synchronize two tables.
- Syntax:

  ```sql
    MERGE INTO
        target_table AS t
    USING
        source_table AS s
    ON
        t.common_column = s.common_column
    WHEN MATCHED AND additional_conditions THEN
        UPDATE SET
            column1 = s.column1,
            column2 = s.column2, ...
    WHEN NOT MATCHED THEN
        INSERT
            (column1, column2, ...)
        VALUES
            (s.column1, s.column2, ...)
    WHEN MATCHED AND delete_conditions THEN
        DELETE;
    [
        RETURNING *; |
        merge_action()  -- Optional: to return the affected rows
        column1, column2, ...
    ]
  ```

  - `target_table`: The table to be modified.
  - `source_table`: The table providing the new data.
  - `common_column`: The column used to match rows between the target and source tables.
  - `additional_conditions`: Conditions to determine when to perform an `UPDATE`.
  - `delete_conditions`: Conditions to determine when to perform a `DELETE`.
  - `RETURNING *`: Optional clause to return the affected row(s), `*` can be replaced with specific column names if needed.
  - `merge_action()`: Optional function to return the type of action performed (INSERT, UPDATE, DELETE).
  - `column1, column2, ...`: Specific columns to return.

- Example: Merging employee records from a staging table into the main employees table.

  ```sql
    MERGE INTO
        employees AS e
    USING
        staging_employees AS s
    ON
        e.id = s.id
    WHEN MATCHED THEN
        UPDATE SET
            e.first_name = s.first_name,
            e.last_name = s.last_name,
            e.salary = s.salary
    WHEN NOT MATCHED THEN
        INSERT
            (id, first_name, last_name, salary)
        VALUES
            (s.id, s.first_name, s.last_name, s.salary);
  ```

  - This command merges records from the `staging_employees` table into the `employees` table. If a matching `id` is found, it updates the employee's details; if not, it inserts a new record.

- Example: Merging with delete condition.

  ```sql
    MERGE INTO
        employees AS e
    USING
        staging_employees AS s
    ON
        e.id = s.id
    WHEN MATCHED AND s.is_active = false THEN
        DELETE
    WHEN MATCHED THEN
        UPDATE SET
            e.first_name = s.first_name,
            e.last_name = s.last_name,
            e.salary = s.salary
    WHEN NOT MATCHED THEN
        INSERT
            (id, first_name, last_name, salary)
        VALUES
            (s.id, s.first_name, s.last_name, s.salary);
  ```

- Example: Let's use conditionals on USING statement for more advanced merging.

  ```sql
    MERGE INTO
        employees AS e
    USING
        (SELECT * FROM staging_employees WHERE hire_date > '2023-01-01') AS s
    ON
        e.id = s.id
    WHEN MATCHED THEN
        UPDATE SET
            e.first_name = s.first_name,
            e.last_name = s.last_name,
            e.salary = s.salary
    WHEN NOT MATCHED THEN
        INSERT
            (id, first_name, last_name, salary)
        VALUES
            (s.id, s.first_name, s.last_name, s.salary);
  ```

  - This command merges records from the `staging_employees` table into the `employees` table, but only for those employees hired after January 1, 2023. If a matching `id` is found, it updates the employee's details; if not, it inserts a new record.
