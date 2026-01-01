# Sub Query in PostgreSQL

> Sub Query allows us to nest one query inside another query. The inner query is executed first, and its result is used by the outer query.

- [Sub Query in PostgreSQL](#sub-query-in-postgresql)
  - [Subquery](#subquery)
    - [Example](#example)
  - [Correlated Subquery](#correlated-subquery)
  - [ANY and ALL Operators with Subqueries](#any-and-all-operators-with-subqueries)
  - [EXISTS Operator with Subqueries](#exists-operator-with-subqueries)

## Subquery

- A subquery is a query nested inside another SQL query. It can be used in various clauses such as `SELECT`, `FROM`, `WHERE`, and `HAVING`.
- Subqueries can return individual values or multiple rows and columns, depending on how they are used.
- Syntax:

  ```sql
  SELECT column1, column2, ...
  FROM table1
  WHERE columnX operator (
      SELECT columnY
      FROM table2
      WHERE condition
  );
  ```

### Example

- Consider a table `country` and `city` and want to find the name of all city in the country 'India'.

  - First Way: Without using Sub Query

    ```sql
        SELECT
         country_id,
         country
        FROM
          country
        WHERE
          country = 'India';

        -- Assume the above query returns country_id = 101

        SELECT
         city_id,
         city
        FROM
          city
        WHERE
          country_id = 101;
    ```

    - Second Way: Using Sub Query

      ```sql
      SELECT
          city_id,
          city
      FROM
          city
      WHERE
          country_id = (
              SELECT
                  country_id
              FROM
                  country
              WHERE
                  country = 'United States'
      );
      ```

- Consider a table called `film`, `film_category`, and `category`. To find the titles of all films in the category 'Action':

  ```sql
    SELECT
        title,
        release_year,
        length
    FROM
        film
    WHERE
        film_id IN (
            SELECT
                film_id
            FROM
                film_category
            WHERE
                category_id = (
                    SELECT
                        category_id
                    FROM
                        category
                    WHERE
                        name = 'Action'
                )
        )
    ORDER BY
        length DESC
    LIMIT 10;
  ```

## Correlated Subquery

- A correlated subquery is a type of subquery that references columns from the outer query. It is executed once for each row processed by the outer query.
- It may lead to performance issues if not used carefully, as it can result in multiple executions of the inner query.
- Syntax:

  ```sql
  SELECT column1, column2, ...
  FROM table1 outer_alias
  WHERE columnX operator (
      SELECT columnY
      FROM table2 inner_alias
      WHERE inner_alias.columnZ = outer_alias.columnA
  );
  ```

- Example:

  - Finding all film based on average length of films in the same rating.

    ```sql
    SELECT
        f1.title,
        f1.length,
        f1.rating
    FROM
        film f1
    WHERE
        f1.length > (
            SELECT
                AVG(f2.length)
            FROM
                film f2
            WHERE
                f2.rating = f1.rating
        )
    ORDER BY
        f1.rating,
        f1.length DESC;
    ```

## ANY and ALL Operators with Subqueries

- The `ANY` and `ALL` operators are used in conjunction with subqueries to compare a value to a set of values returned by the subquery.
  - `ANY`: The condition is true if the comparison is true for at least one value in the set, in sub query match one or more values which satisfy the condition.
  - `ALL`: The condition is true only if the comparison is true for all values in the set, in sub query match all values which satisfy the condition.
- Syntax:

  ```sql
    SELECT column1, column2, ...
    FROM table1
    WHERE columnX operator ANY (
        SELECT columnY
        FROM table2
        WHERE condition
    );
  ```

- Example:

  - Find all employees whose salary is greater than manager's salary.

    ```sql
    SELECT
        employee_id,
        first_name,
        last_name,
        salary
    FROM
        employees
    WHERE
        salary > ANY (
            SELECT
                salary
            FROM
                managers
    );
    ```

  - Find all employees whose salary is equal to manager's salary.

  ```sql
  SELECT
      employee_id,
      first_name,
      last_name,
      salary
  FROM
      employees
  WHERE
      salary = ANY (
          SELECT
              salary
          FROM
              managers
  );
  ```

  - Find all employees whose salary is greater than average salary of managers.

    ```sql
    SELECT
        employee_id,
        first_name,
        last_name,
        salary
    FROM
        employees
    WHERE
        salary > ANY (
            SELECT
                AVG(salary)
            FROM
                managers
    );
    ```

- Using `ALL` operator:

  - Find all employees whose salary is greater than all manager's salary.

    ```sql
    SELECT
        employee_id,
        first_name,
        last_name,
        salary
    FROM
        employees
    WHERE
        salary > ALL (
            SELECT
                salary
            FROM
                managers
    );
    ```

    - Find all employees whose salary is less than all manager's salary.

      ```sql
        SELECT
            employee_id,
            first_name,
            last_name,
            salary
        FROM
            employees
        WHERE
            salary < ALL (
                SELECT
                    salary
                FROM
                    managers
        );
      ```

## EXISTS Operator with Subqueries

- The `EXISTS` operator is used to test for the existence of rows returned by a subquery. It returns true if the subquery returns one or more rows, and false if it returns no rows.
- Syntax:

  ```sql
    SELECT column1, column2, ...
    FROM table1
    WHERE EXISTS (
        SELECT columnY
        FROM table2
        WHERE condition
    );
  ```

- Example:

  - Find all departments that have at least one employee.

    ```sql
    SELECT
        department_id,
        department_name
    FROM
        departments d
    WHERE
        EXISTS (
            SELECT
                1
            FROM
                employees e
            WHERE
                e.department_id = d.department_id
    );
    ```

    - Find all customers who have placed at least one order.

      ```sql
      SELECT
          customer_id,
          customer_name
      FROM
          customers c
      WHERE
          EXISTS (
              SELECT
                  1
              FROM
                  orders o
              WHERE
                  o.customer_id = c.customer_id
      );
      ```
