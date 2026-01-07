/*
<====================> VIEWS IN POSTGRESQL <====================>

🟠 Views in PostgreSQL is named queries that combines complex SQL logic into a single view, So instead of writing complex queries repeatedly, you can create a view and query it like a regular table.
🟠 It does not store data physically, it just stores the SQL query as a single unit, and when you query the view, it executes the underlying SQL query to fetch the data.

🔵 In PostgreSQL, there is a type of views called "Materialized Views", which stores the result of the query physically on disk, and you can refresh it periodically to keep the data up-to-date.
🔵 It's useful for improving performance when dealing with complex queries that are frequently accessed, mainly in data warehousing scenarios.

🟡 There are many advantages of views

    1. Simplified Querying: Views encapsulate complex SQL logic, making it easier to query data without writing complex joins and filters repeatedly.
    2. Data Abstraction: Views provide a level of abstraction, allowing users to interact with data without needing to understand the underlying table structures.
    3. Security: Views can restrict access to specific columns or rows of a table, enhancing data security by exposing only the necessary data to users.
    4. Reusability: Once a view is created, it can be reused in multiple queries, promoting code reuse and reducing redundancy.


🚀 SYNTAX FOR VIEW
CREATE [OR REPLACE] VIEW view_name AS
    SELECT column1, column2, ...
    FROM table_name
    WHERE condition;
*/

/*
-- 🔵 DROP VIEW

🚀 SYNTAX FOR VIEW
DROP [IF EXISTS] view_name, view_name ...
[CASCADE | RESTRICT -> default]

- You know about drop, not anything new about it here.
- Let's understand "CASCADE", So as you can see in the below we build "student_info", "student_with_age" -> it depends on "student_info".
- So suppose i want to delete student_info it will throw an error because "student_with_age" depends on it. 
- So we can use "CASCADE" to delete all it's dependent views. 
*/

DROP VIEW IF EXISTS student_info CASCADE;


-- 🔵 CREATING VIEWS
-- Example: Creating a simple view to get all details of a student from students, hobbies table
CREATE OR REPLACE VIEW student_info AS (
    SELECT 
        CONCAT(first_name, ' ', last_name) AS full_name,
        age,
        marks,
        hobbies,
        to_json(address)
    FROM
        students
        INNER JOIN
            hobbies
        USING(student_id)
        INNER JOIN
            user_result
        USING(student_id)
        INNER JOIN
            result
        USING(result_id)
);

-- Example: Creating a view to get all student that age is in between 22 to 30, So we can use existing student_info view in this.
CREATE OR REPLACE VIEW student_with_age AS (
    SELECT *
    FROM
        student_info
    WHERE
        age BETWEEN 22 AND 30
);


/*
<====================> MATERIALIZED VIEWS IN POSTGRESQL <====================>

🟠 Materialized Views in PostgreSQL are database objects that store the result of a query physically on disk, unlike regular views that are virtual and do not store data.
🟠 They are used to improve query performance, especially for complex queries that involve large datasets or aggregations, by precomputing and storing the results.
🟠 Materialized Views can be refreshed periodically to keep the data up-to-date, either manually or automatically using scheduled jobs.

🚀 SYNTAX FOR MATERIALIZED VIEW
CREATE MATERIALIZED VIEW view_name AS
    SELECT column1, column2, ...
    FROM table_name
    WHERE condition

🔵 REFRESHING MATERIALIZED VIEW
🚀 SYNTAX FOR REFRESHING MATERIALIZED VIEW
REFRESH MATERIALIZED VIEW [CONCURRENTLY] view_name;

- "CONCURRENTLY" allows concurrent reads while the refresh is happening, but it requires a unique index on the materialized view.
*/

CREATE MATERIALIZED VIEW rental_by_category AS (
     SELECT
         c.name AS category,
         SUM(p.amount) AS total_sales
     FROM
         payment p
     JOIN rental r ON (p.rental_id = r.rental_id)
     JOIN inventory i ON (r.inventory_id = i.inventory_id)
     JOIN film f ON (i.film_id = f.film_id)
     JOIN film_category fc ON (f.film_id = fc.film_id)
     JOIN category c ON (fc.category_id = c.category_id)

     GROUP BY
         c.name
     ORDER BY
          SUM(p.amount) DESC
 );