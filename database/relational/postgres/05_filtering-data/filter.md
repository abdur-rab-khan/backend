# Filter clauses in SQL

> In SQL, filtering data is necessary to retrieve specific records that meet certain criteria. The most common way to filter data is by using the `WHERE` clause in a `SELECT` statement.

- [Filter clauses in SQL](#filter-clauses-in-sql)
  - [Using the WHERE clause](#using-the-where-clause)
  - [Using LIMIT/OFFSET clause](#using-limitoffset-clause)
  - [FETCH clause](#fetch-clause)
  - [IN clause](#in-clause)
  - [Between clause](#between-clause)
  - [LIKE clause](#like-clause)

## Using the WHERE clause

- The `WHERE` clause allows you to specify conditions that the data must meet to be included in the result set.
- Following are the operators commonly used in the `WHERE` clause:

  | Operator   | Description              | Example                       |
  | ---------- | ------------------------ | ----------------------------- |
  | `=`        | Equal to                 | `WHERE age = 30`              |
  | `<> or !=` | Not equal to             | `WHERE age <> 30`             |
  | `>`        | Greater than             | `WHERE age > 30`              |
  | `<`        | Less than                | `WHERE age < 30`              |
  | `>=`       | Greater than or equal to | `WHERE age >= 30`             |
  | `<=`       | Less than or equal to    | `WHERE age <= 30`             |
  | `BETWEEN`  | Within a range           | `WHERE age BETWEEN 20 AND 30` |
  | `IN`       | Within a set of values   | `WHERE age IN (25, 30, 35)`   |
  | `LIKE`     | Pattern matching         | `WHERE name LIKE 'J%'`        |
  | `IS NULL`  | Check for NULL values    | `WHERE address IS NULL`       |
  | `NOT`      | Negates a condition      | `WHERE NOT (age > 30)`        |

- We have to know about the order of execution of SQL clauses, `FROM` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT` -> `ORDER BY`.

- Example 1: Retrieve all employees older than 30 years.

  ```sql
    SELECT * FROM employees
    WHERE age > 30;
  ```

- Example 2: Retrieve all products with a price between 50 and 100.

  ```sql
    SELECT * FROM products
    WHERE price BETWEEN 50 AND 100;
  ```

- Example 3: Retrieve all customers whose names start with 'J'.

  ```sql
    SELECT * FROM customers
    WHERE name LIKE 'J%';
  ```

- Example 4: Using multiple conditions with AND/OR.

  ```sql
    SELECT * FROM orders
    WHERE status = 'shipped' AND total_amount > 100;
  ```

- Example 5: Retrieve all records where the address is NULL.

  ```sql
    SELECT * FROM users
    WHERE address IS NULL;
  ```

- Example 6: Combining multiple filters.

  ```sql
    SELECT * FROM employees
    WHERE (age > 30 AND department = 'Sales') OR (age <= 30 AND department = 'Marketing');
  ```

- Example 7: Using not equal operator.

  ```sql
    SELECT * FROM products
    WHERE category <> 'Electronics';
  ```

## Using LIMIT/OFFSET clause

- The `LIMIT` clause and `OFFSET` clause are used to control the number of rows returned by a query and to skip a specified number of rows before starting to return rows.
- `LIMIT` specifies the maximum number of records to return.
- `OFFSET` specifies the number of records to skip before starting to return records.
- Example: Retrieve 10 records starting from the 6th record.

  ```sql
    SELECT * FROM employees
    LIMIT 10 OFFSET 5;
  ```

- Example: Retrieve the first 15 records.

  ```sql
    SELECT * FROM products
    LIMIT 15;
  ```

- Example: Retrieve records 11 to 20.

  ```sql
    SELECT * FROM customers
    LIMIT 10 OFFSET 10;
  ```

## FETCH clause

- `LIMIT` is not a part of the SQL standard. Instead, the SQL standard defines the `FETCH` clause to limit the number of rows returned by a query.
- The `FETCH` clause is used to get a specific number of rows from the result set.
- If you want to skip a certain number of rows before fetching, `OFFSET` can be used and should be placed before the `FETCH` clause.
- Example: Retrieve the first 10 records.

  ```sql
    SELECT * FROM employees
    FETCH FIRST 10 ROWS ONLY;
  ```

## IN clause

- The `IN` clause is used to filter records based on a list of specified values.
- It is a shorthand for multiple `OR` conditions.
- Example: Retrieve all employees in the 'Sales', 'Marketing', or 'HR' departments without using `IN` clause.

  ```sql
    SELECT * FROM employees
    WHERE department = 'Sales' OR department = 'Marketing' OR department = 'HR';

    -- Using IN clause

    SELECT * FROM employees
    WHERE department IN ('Sales', 'Marketing', 'HR');
  ```

## Between clause

- The `BETWEEN` clause is used to filter records within a specific range.
- It is inclusive, meaning it includes the boundary values.
- Suppose we want to get customers whose ages are between 18 and 30, we can use like `WHERE age BETWEEN 18 AND 30`, it's equivalent to `WHERE age >= 18 AND age <= 30`.
- Example: Retrieve all products with a price between 50 and 100.

  ```sql
    SELECT * FROM products
    WHERE price BETWEEN 50 AND 100;
  ```

- Example: Retrieve all employees hired between '2020-01-01' and '2021-01-01'.

  ```sql
    SELECT * FROM employees
    WHERE hire_date BETWEEN '2020-01-01' AND '2021-01-01';
  ```

## LIKE clause

- The `LIKE` clause is used for pattern matching in string data.
- It allows you to search for a specified pattern in a column.
- The two main wildcard characters used with `LIKE` are:
  - `%`: Represents zero or more characters.
  - `_`: Represents a single character.
- Suppose we want to get all customers whose names start with 'J', we can use `WHERE name LIKE 'J%'`.
- Example: Retrieve all customers whose names start with 'J'.

  ```sql
    SELECT * FROM customers
    WHERE name LIKE 'J%';
  ```

- Example: Retrieve all products with a code that ends with 'X'.

  ```sql
    SELECT * FROM products
    WHERE product_code LIKE '%X';
  ```

- Example: Retrieve all employees whose names have 'an' in them.

  ```sql
    SELECT * FROM employees
    WHERE name LIKE '%an%';
  ```

- Example: Retrieve all customers whose names have 'a' as the second character.

  ```sql
    SELECT * FROM customers
    WHERE name LIKE '_a%';
  ```
