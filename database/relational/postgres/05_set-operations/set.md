# Set Operations in PostgreSQL

> Set operations in postgreSQL allow us to combine the results of two or more `SELECT` statements into a single result set. The most commonly used set operations are `UNION`, `INTERSECT`, and `EXCEPT`.

## UNION

- The `UNION` operator combines the result sets of two or more `SELECT` statements and removes duplicate rows from the final result set.
- Otherwise, if you want to include duplicates, you can use `UNION ALL`.
- There are some rules to follow when using `UNION/UNION ALL`:
  - Each `SELECT` statement must have the same number of columns.
  - The columns must have compatible data types.
  - The columns in each `SELECT` statement must be in the same order.

### Example of UNION

- Example 1: Combining two movie lists

  ```sql
    SELECT title, release_year FROM top_rated_movies
    UNION
    SELECT title, release_year FROM popular_movies;
  ```

  - This query combines the titles and release years from two different movie tables, removing any duplicates.

- Example 2: Using UNION ALL to include duplicates

  ```sql
    SELECT title, release_year FROM top_rated_movies
    UNION ALL
    SELECT title, release_year FROM popular_movies;
  ```

## INTERSECT

- `INTERSECT` is similar to `UNION`, but it returns only the rows that are common to both `SELECT` statements.
- Like `UNION`, the same rules regarding the number of columns, data types, and order apply.
- Note: `INTERSECT` is not supported in some older versions of PostgreSQL.

### Example of INTERSECT

- Example: Finding common movies in two lists

  ```sql
    SELECT title, release_year FROM top_rated_movies
    INTERSECT
    SELECT title, release_year FROM popular_movies;
  ```

  - This query returns only the movies that are present in both the `top_rated_movies` and `popular_movies` tables.

## EXCEPT

- The `EXCEPT` is opposite to `INTERSECT`. It returns the rows from the first `SELECT` statement that are not present in the second `SELECT` statement.
- The same rules regarding the number of columns, data types, and order apply here as well.

### Example of EXCEPT

- Example: Finding movies that are in the top-rated list but not in the popular list

  ```sql
    SELECT title, release_year FROM top_rated_movies
    EXCEPT
    SELECT title, release_year FROM popular_movies;
  ```

  - This query returns the movies that are in the `top_rated_movies` table but not in the `popular_movies` table.
