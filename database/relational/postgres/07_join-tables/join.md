# Join in Postgres

> Joining in Postgres allows to combine rows from two or more tables based on custom conditions, enabling complex queries and data retrieval.

- [Join in Postgres](#join-in-postgres)
  - [Types of Joins](#types-of-joins)
  - [Example](#example)
    - [1. INNER JOIN Example](#1-inner-join-example)
    - [2. LEFT JOIN Example](#2-left-join-example)
    - [3. RIGHT JOIN Example](#3-right-join-example)
    - [4. FULL OUTER JOIN Example](#4-full-outer-join-example)
    - [5. NATURAL JOIN Example](#5-natural-join-example)
    - [6. Self JOIN Example](#6-self-join-example)

## Types of Joins

1. [**INNER JOIN**](#1-inner-join-example): Returns records that have matching values in both tables.

   ```sql
   SELECT
    columns
   FROM
    table1
   INNER JOIN
    table2
   ON
    table1.common_field = table2.common_field;

   -- If both have the same name, i mean if foreign key and primary key have the same name, we can use USING clause instead of ON clause
   USING (common_field); -- Equivalent to ON table1.common_field = table2.common_field

   ```

2. [**LEFT JOIN (or LEFT OUTER JOIN)**](#2-left-join-example): Returns all records from the left table, and the matched records from the right table. If there is no match, NULL values are returned for columns from the right table.

   ```sql
        SELECT
            columns
        FROM
            table1
        LEFT JOIN
            table2
        ON
            table1.common_field = table2.common_field;
   ```

3. [**RIGHT JOIN (or RIGHT OUTER JOIN)**](#3-right-join-example): Returns all records from the right table, and the matched records from the left table. If there is no match, NULL values are returned for columns from the left table.

   ```sql
        SELECT
            columns
        FROM
            table1
        RIGHT JOIN
            table2
        ON
            table1.common_field = table2.common_field;
   ```

4. [**FULL JOIN (or FULL OUTER JOIN)**](#4-full-outer-join-example): Returns all records when there is a match in either left or right table. If there is no match, NULL values are returned for columns from the table without a match.

   ```sql
        SELECT
            columns
        FROM
            table1
        FULL JOIN
            table2
        ON
            table1.common_field = table2.common_field;
   ```

5. **CROSS JOIN**: Returns the Cartesian product of the two tables, i.e., all possible combinations of rows from both table, without any conditions. Following image illustrates how CROSS JOIN works -

   ![Cross Join](../../../assets/PostgreSQL-CROSS-JOIN-illustration.avif)

   ```sql
        SELECT
            columns
        FROM
            table1
        CROSS JOIN
            table2;
   ```

6. [**SELF JOIN**](#6-self-join-example): A self join is a regular join, but the table is joined with itself.

   ```sql
        SELECT
            a.column_name,
            b.column_name
        FROM
            table_name AS a
        INNER JOIN
            table_name AS b
        ON
            a.common_field = b.common_field;
   ```

7. [**NATURAL JOIN**](#5-natural-join-example): A natural join automatically joins tables based on all columns with the same name and compatible data types in both tables. It eliminates the need to specify the join condition explicitly, it they have multiple common columns, it will use all of them for joining.

   ```sql
        SELECT
            columns
        FROM
            table1
        NATURAL JOIN
            table2;
   ```

- **NOTE**: Always `TABLE` before the `JOIN` keyword is called the **left table** and the `TABLE` after the `JOIN` keyword is called the **right table**.

- Image showing different types of joins -

  ![Join Types](../../../assets/postgresql-joins-all.avif)

## Example

### 1. INNER JOIN Example

- Example: Consider two tables, `customer` and `payment` and we want to retrieve a list of customers along with their payment details.

  ```sql
    SELECT
        c.customer_id,
        CONCAT(c.first_name, ' ', c.last_name) AS full_name,
        p.amount,
        p.payment_date
    FROM
        customer AS c
    INNER JOIN
        payment AS p
    USING(customer_id)
    ORDER BY
        p.amount DESC
    LIMIT
        10;
  ```

  - In this example, we are selecting the `customer_id`, concatenated `first_name` and `last_name` as `full_name`, `amount`, and `payment_date` from the `customer` table (aliased as `c`) and the `payment` table (aliased as `p`). The join is performed on the `customer_id` field using the `USING` clause. The results are ordered by the payment amount in descending order, and only the top 10 records are returned.

- Example: Consider three tables, `customer`, `payment` and `staff` and we want to retrieve a list of customers along with their payment details and the staff who processed the payment.

  ```sql
    SELECT
        c.customer_id,
        CONCAT(c.first_name, ' ', c.last_name) AS full_name,
        p.amount,
        p.payment_date,
        CONCAT(s.first_name, ' ', s.last_name) AS staff_name,
        s.active AS staff_active
    FROM
        customer AS c
    INNER JOIN
        payment AS p
    ON
        c.customer_id = p.customer_id
    INNER JOIN
        staff AS s
    ON
        p.staff_id = s.staff_id
    ORDER BY
        amount DESC
    LIMIT
        10;
  ```

### 2. LEFT JOIN Example

- Example: Consider two tables, `film` and `inventory` and we want to retrieve a list of films along with their inventory details, including films that may not have any inventory.

  ```sql
    SELECT
        f.film_id,
        f.title,
        i.inventory_id,
        i.store_id,
        i.last_update
    FROM
        film AS f
    LEFT JOIN
        inventory AS i
    ON
        f.film_id = i.film_id
    ORDER BY
        f.title
    LIMIT
        10;
  ```

  - In this example, we are selecting the `film_id`, `title` from the `film` table (aliased as `f`) and `inventory_id`, `store_id`, and `last_update` from the `inventory` table (aliased as `i`). The left join ensures that all films are included in the result set, even if they do not have corresponding inventory records. The results are ordered by the film title, and only the top 10 records are returned.

### 3. RIGHT JOIN Example

- Example: Consider two tables, `rental` and `inventory` and we want to retrieve a list of inventory items along with their rental details, including inventory items that may not have been rented.

  ```sql
    SELECT
        i.inventory_id,
        i.film_id,
        r.rental_id,
        r.rental_date,
        r.return_date
    FROM
        rental AS r
    RIGHT JOIN
        inventory AS i
    ON
        r.inventory_id = i.inventory_id
    ORDER BY
        i.inventory_id
    LIMIT
        10;
  ```

  - In this example, we are selecting the `inventory_id`, `film_id` from the `inventory` table (aliased as `i`) and `rental_id`, `rental_date`, and `return_date` from the `rental` table (aliased as `r`). The right join ensures that all inventory items are included in the result set, even if they do not have corresponding rental records. The results are ordered by the inventory ID, and only the top 10 records are returned.

### 4. FULL OUTER JOIN Example

- Example: Consider two tables, `actor` and `film_actor` and we want to retrieve a list of actors along with their film details, including actors who may not have acted in any films and films that may not have any actors, if not acted at that place we will get NULL values.

  ```sql
    SELECT
        a.actor_id,
        CONCAT(a.first_name, ' ', a.last_name) AS full_name,
        fa.film_id,
        fa.last_update
    FROM
        actor AS a
    FULL JOIN
        film_actor AS fa
    ON
        a.actor_id = fa.actor_id
    ORDER BY
        a.actor_id
    LIMIT
        10;
  ```

  - In this example, we are selecting the `actor_id`, concatenated `first_name` and `last_name` as `full_name` from the `actor` table (aliased as `a`) and `film_id`, and `last_update` from the `film_actor` table (aliased as `fa`). The full outer join ensures that all actors and all film_actor records are included in the result set, even if there are no matches between the two tables. The results are ordered by the actor ID, and only the top 10 records are returned.

### 5. NATURAL JOIN Example

- Example: Consider two tables, `customer` and `payment` and we want to retrieve a list of customers along with their payment details using NATURAL JOIN.

  ```sql
    SELECT
        c.customer_id,
        CONCAT(c.first_name, ' ', c.last_name) AS full_name,
        p.amount,
        p.payment_date
    FROM
        customer AS c
    NATURAL JOIN
        payment AS p
    ORDER BY
        p.amount DESC
    LIMIT
        10;

    -- Equivalent to using USING clause
    SELECT
        c.customer_id,
        CONCAT(c.first_name, ' ', c.last_name) AS full_name,
        p.amount,
        p.payment_date
    FROM
        customer AS c
    JOIN
        payment AS p
    USING(customer_id)
    ORDER BY
        p.amount DESC
  ```

  - In this example, we are selecting the `customer_id`, concatenated `first_name` and `last_name` as `full_name`, `amount`, and `payment_date` from the `customer` table (aliased as `c`) and the `payment` table (aliased as `p`). The NATURAL JOIN automatically joins the tables based on the common column(s) with the same name, which is `customer_id` in this case. The results are ordered by the payment amount in descending order, and only the top 10 records are returned.

### 6. Self JOIN Example

- Example: Consider a table `employee` where each employee has a `manager_id` that references the `employee_id` of their manager. We want to retrieve a list of employees along with their manager's name.

  ```sql
    SELECT
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
        CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM
        employee AS e
    INNER JOIN
        employee AS m
    ON
        e.manager_id = m.employee_id
    ORDER BY
        e.employee_id
    LIMIT
        10;
  ```

  - In this example, we are selecting the `employee_id`, concatenated `first_name` and `last_name` as `employee_name` from the `employee` table (aliased as `e`) and concatenated `first_name` and `last_name` as `manager_name` from the same `employee` table (aliased as `m`). The self join is performed on the condition that the `manager_id` of the employee matches the `employee_id` of the manager. The results are ordered by the employee ID, and only the top 10 records are returned.
