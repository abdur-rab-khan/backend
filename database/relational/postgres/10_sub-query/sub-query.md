# Sub Query in PostgreSQL

> Sub Query allows us to nest one query inside another query. The inner query is executed first, and its result is used by the outer query.

## Syntax

```sql
SELECT column1, column2, ...
FROM table_name
WHERE column_name operator (SELECT column_name FROM table_name WHERE condition);
```

## Example

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
