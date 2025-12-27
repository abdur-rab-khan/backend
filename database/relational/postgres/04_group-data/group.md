# Group Clauses

> In SQL, the `GROUP BY` clause is used to arrange identical data into groups. This is particularly useful when you want to aggregate data, such as calculating sums, averages, counts, etc., for each group.

- [Group Clauses](#group-clauses)
  - [Group by Clause](#group-by-clause)
  - [Syntax](#syntax)
  - [Example](#example)
  - [Having Clause](#having-clause)
  - [Grouping Sets, Rollup, and Cube](#grouping-sets-rollup-and-cube)

## Group by Clause

- Suppose we apply the `GROUP BY` clause to a column named `category` in a table called `products`.
- Data with the same category is grouped together based on unique category values. Aggregate functions are applied to each group, and the query returns one result row per group.
- The order of query execution is as follows:

  ![SQL Query Execution Order](https://neon.com/_next/image?url=%2Fpostgresqltutorial%2FPostgreSQL-GROUP-BY-1.png&w=256&q=75&dpl=dpl_F9bdjKJK2Tq8GsFjQf8UHmeJsvcQ)

- Following image illustrates how the `GROUP BY` clause works:

  ![GROUP BY Clause Illustration](../../../assets/working-of-group-by.png)

## Syntax

```sql
SELECT column1, aggregate_function(column2)
FROM table_name
WHERE condition
GROUP BY column1;
```

- `column1`: The column by which you want to group the results.
- `aggregate_function(column2)`: An aggregate function (like `SUM`, `COUNT`, `AVG`, etc.) applied to another column.
- `table_name`: The name of the table from which to retrieve data.
- `condition`: An optional condition to filter rows before grouping.
- `GROUP BY column1`: This clause groups the results based on the values in `column1`.

## Example

- Example 1: Grouping data by a single column

  ```sql
  SELECT department, COUNT(*)
  FROM employees
  GROUP BY department;
  ```

  - This query counts the number of employees in each department.

- Example 2: Grouping data by multiple columns

  ```sql
    SELECT department, job_title, AVG(salary)
    FROM employees
    GROUP BY department, job_title;
  ```

  - This query calculates the average salary for each combination of department and job title.

- Example 3: Using `HAVING` clause with `GROUP BY`

  ```sql
    SELECT department, COUNT(*)
    FROM employees
    GROUP BY department
    HAVING COUNT(*) > 5;
  ```

## Having Clause

- The `HAVING` clause is used to filter groups based on a specified condition, similar to how the `WHERE` clause filters rows.
- As we know it divides the records into groups based on one or more columns, at that groups level we can apply the `HAVING` clause to filter out groups that do not meet certain criteria.

- Example: Using `HAVING` clause to filter groups

  ```sql
  SELECT department, COUNT(*)
  FROM employees
  GROUP BY department
  HAVING COUNT(*) > 10;
  ```

  - This query counts the number of employees in each department and only returns those departments that have more than 10 employees.

- Example: Using `HAVING` with aggregate functions

  ```sql
  SELECT department, AVG(salary)
  FROM employees
  GROUP BY department
  HAVING AVG(salary) > 60000;
  ```

  - This query calculates the average salary for each department and only returns those departments where the average salary is greater than 60,000.

- Note: We can't use the column aliases defined in the `SELECT` clause, because `HAVING` is evaluated before `SELECT` in the SQL order of operations.

## Grouping Sets, Rollup, and Cube
