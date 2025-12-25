# Querying Data

> Querying data is the process of retrieving specific information from a database using structured commands. In PostgreSQL, this is primarily done using the SQL (Structured Query Language) language.

- [Querying Data](#querying-data)
  - [Basic `SELECT` Statement](#basic-select-statement)
    - [Example](#example)
  - [Column Aliases](#column-aliases)
    - [Example](#example-1)

## Basic `SELECT` Statement

- The most fundamental way to query data in PostgreSQL is by using the `SELECT` statement. This command allows you to specify which columns you want to retrieve from a table.
- `SELECT` can also be use for retrieving database related information such as `CURRENT_DATE` or `VERSION()`.
- The `SELECT` statement has the following clause:

  1. `FROM`: Specifies the table from which to retrieve the data.
  2. `DISTINCT`: Used to return only distinct (different) values.
  3. `WHERE`: Filters the results based on specified conditions.
  4. `ORDER BY`: Sorts the results in ascending or descending order.
  5. `LIMIT`: Restricts the number of rows returned.
  6. `OFFSET`: Skips a specified number of rows before starting to return rows.
  7. `GROUP BY`: Groups rows that have the same values in specified columns into summary rows.
  8. `HAVING`: Filters groups based on specified conditions.
  9. `LIMIT` and `OFFSET`: Control the number of rows returned and the starting point for the results.
  10. `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL JOIN`: Combine rows from two or more tables based on a related column between them.
  11. `UNION`, `INTERSECT`, `EXCEPT`: Combine results from multiple `SELECT` statements.
  12. `SUBQUERIES`: Nested queries that provide results to the outer query.
  13. `RETURNING`: Returns values from rows that were modified by an `INSERT`, `UPDATE`, or `DELETE` statement.

### Example

- Retrieve all columns from the "employees" table

  ```sql
  SELECT *
  FROM employees;
  ```

- Retrieve distinct job titles from the "employees" table

  ```sql
  SELECT DISTINCT job_title
  FROM employees;
  ```

- Retrieving specific columns with a condition

  ```sql
  SELECT first_name, last_name, salary
  FROM employees
  WHERE salary > 50000 -- Only employees with salary greater than 50000
  ORDER BY salary DESC -- Sort by salary in descending order
  LIMIT 10; -- Limit to 10 results
  ```

- Grouping and filtering results

  ```sql
    SELECT department, COUNT(*) AS employee_count
    FROM employees
    GROUP BY department
    HAVING COUNT(*) > 5; -- Only departments with more than 5 employees
  ```

- Using string functions in queries

  ```sql
  SELECT first_name, last_name, UPPER(last_name) AS last_name_upper
  FROM employees;
  ```

  - Postgres provides a variety of string functions such as `LOWER()`, `UPPER()`, `CONCAT()`, `SUBSTRING()`, and more to manipulate string data.

## Column Aliases

- Column aliases are used to give a column in the result set a temporary name. This is done using the `AS` keyword.
- It's especially useful for improving **readability**, **formatting output** or performing any operations on columns.

### Example

- Using column aliases in a query

  ```sql
  SELECT first_name AS "First Name", last_name AS "Last Name", salary * 1.1 AS "Increased Salary"
  FROM employees;
  ```

- There is shorthand syntax for column aliases where the `AS` keyword can be omitted using spaces, or if already have spaces in aggregate functions use double quotes:

  ```sql
  SELECT first_name "First Name", last_name "Last Name", salary * 1.1 "Increased Salary"
  FROM employees;

  -- Using double quotes for aggregate functions
  SELECT first_name || ' ' || last_name "Full Name", COUNT(*) "Total Employees"
  FROM employees;
  ```

- Let's see an example of using column aliases with aggregate functions:

  ```sql
  SELECT department, AVG(salary) AS "Average Salary", SUM(salary) AS "Total Salary"
  FROM employees
  GROUP BY department;
  ```
