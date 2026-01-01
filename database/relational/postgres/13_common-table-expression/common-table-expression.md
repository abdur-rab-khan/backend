# Common Table Expression (CTE)

> Introduced in PostgreSQL 8.4, Common Table Expressions (CTEs) allow you to define temporary result sets that can be referenced within a `SELECT`, `INSERT`, `UPDATE`, or `DELETE` statement. CTEs improve the readability and organization of complex queries.

## Overview

- It creates a temporary result set that exists only for the duration of the query, in the form of table-like structures that can be used as if they were actual tables.
- CTEs can be recursive, allowing for hierarchical data processing.
- They enhance query readability by breaking down complex queries into simpler, more manageable parts.
- CTEs can be used to improve performance in certain scenarios by avoiding repeated calculations.
- They are defined using the `WITH` + `AS` clause.
- Same logic we can apply as regular subqueries, but CTEs can be easier to read and maintain.
- Syntax:

  ```sql
  WITH cte_name AS (
      -- CTE query definition
      SELECT column1, column2
      FROM table_name
      WHERE condition
  )
  -- Main query that uses the CTE
  SELECT *
  FROM cte_name
  WHERE another_condition;
  ```

## Example

- Finding all films which have category 'Action' using CTE:

  ```sql
  WITH action_films AS (
      SELECT f.title, c.name AS category
      FROM film f
      JOIN film_category fc ON f.film_id = fc.film_id
      JOIN category c ON fc.category_id = c.category_id
      WHERE c.name = 'Action'
  )
  SELECT *
  FROM action_films;
  ```

- Finding total rental counts for each staff member using CTE:

  ```sql
  WITH rental_counts AS (
      SELECT
          staff_id,
          COUNT(rental_id) AS rental_count
      FROM
          rental
      GROUP BY
          staff_id
  )
  SELECT
      s.staff_id,
      CONCAT(first_name, ' ', last_name) AS full_name,
      rental_count
  FROM
      staff s
  INNER JOIN rental_counts USING (staff_id);
  ```

- Finding stats of a film on dvdrental database using CTE:

  ```sql
  WITH film_stats AS (
    -- CTE 1: Calculate film statistics
    SELECT
        AVG(rental_rate) AS avg_rental_rate,
        MAX(length) AS max_length,
        MIN(length) AS min_length
    FROM film
  ),
  customer_stats AS (
    -- CTE 2: Calculate customer statistics
    SELECT
        COUNT(DISTINCT customer_id) AS total_customers,
        SUM(amount) AS total_payments
    FROM payment
  )
  -- Main query using the CTEs
  SELECT
    ROUND((SELECT avg_rental_rate FROM film_stats), 2) AS avg_film_rental_rate,
    (SELECT max_length FROM film_stats) AS max_film_length,
    (SELECT min_length FROM film_stats) AS min_film_length,
    (SELECT total_customers FROM customer_stats) AS total_customers,
    (SELECT total_payments FROM customer_stats) AS total_payments;
  ```

## Recursive CTEs

- Recursive CTEs allow you to perform operations that require recursion, such as traversing hierarchical data structures (e.g., organizational charts, tree structures).
- They consist of two parts: the anchor member (base case) and the recursive member ( recursive case).
- Syntax:

  ```sql
  WITH RECURSIVE cte_name AS (
      -- Anchor member
      SELECT column1, column2
      FROM table_name
      WHERE condition

      UNION ALL

      -- Recursive member
      SELECT column1, column2
      FROM table_name
      JOIN cte_name ON join_condition
  )
  SELECT *
  FROM cte_name;
  ```

- Example of a recursive CTE to find all employees under a specific manager:

  ```sql
    WITH RECURSIVE employee_hierarchy AS (
        -- Anchor member: Select the manager
        SELECT employee_id, manager_id, first_name, last_name
        FROM employees
        WHERE manager_id IS NULL  -- Assuming top-level manager has no manager

        UNION ALL

        -- Recursive member: Select employees under the current level
        SELECT e.employee_id, e.manager_id, e.first_name, e.last_name
        FROM employees e
        JOIN employee_hierarchy eh ON e.manager_id = eh.employee_id
    )
  ```
