# Conditional in Postgres

> Postgres allows us to use conditional expressions to control the flow of SQL queries based on certain conditions. This is particularly useful for data manipulation and retrieval.

- [Conditional in Postgres](#conditional-in-postgres)
  - [CASE Statement](#case-statement)
    - [1. General CASE Statement](#1-general-case-statement)
    - [2. Simple CASE Statement](#2-simple-case-statement)
  - [COALESCE Function](#coalesce-function)
  - [NULLIF Function](#nullif-function)

## CASE Statement

- The `CASE` statement is similar to `if-then-else/switch` statements in programming languages. It allows you to evaluate conditions and return specific values based on those conditions.
- There are two types of `CASE` statements: simple and searched.
  1. General: It's similar to if-then-else statements.
  2. Simple: It's similar to switch statements.

### 1. General CASE Statement

- In General CASE statements, we evaluate a series of conditions if `true`, then return the corresponding result, if `false`, move to the next condition.
- If no conditions are met, the `ELSE` clause is executed (if provided), otherwise, it returns `NULL`.

- Example: Assigning grades based on scores.

  ```sql
  SELECT student_name,
      score,
      CASE
          WHEN score >= 90 THEN 'A'
          WHEN score >= 80 THEN 'B'
          WHEN score >= 70 THEN 'C'
          WHEN score >= 60 THEN 'D'
          ELSE 'F'
      END AS grade
  FROM students;
  ```

- Example: Categorizing ages.

  ```sql
  SELECT person_name,
      age,
      CASE
          WHEN age < 13 THEN 'Child'
          WHEN age BETWEEN 13 AND 19 THEN 'Teenager'
          WHEN age BETWEEN 20 AND 59 THEN 'Adult'
          ELSE 'Senior'
      END AS age_group
  FROM people;
  ```

- Example: Aggregation function

  ```sql
    SELECT
      SUM(
          CASE WHEN rental_rate = 0.99 THEN 1 ELSE 0 END
      ) AS "Economy",
      SUM (
          CASE WHEN rental_rate = 2.99 THEN 1 ELSE 0 END
      ) AS "Mass",
      SUM (
          CASE WHEN rental_rate = 4.99 THEN 1 ELSE 0 END
      ) AS "Premium"
    FROM
        film;
  ```

### 2. Simple CASE Statement

- In Simple CASE statements, we evaluate a single expression against multiple possible values.
- The expression is compared to each `WHEN` value, and if a match is found, the corresponding result is returned.
- If no match is found, the `ELSE` clause is executed (if provided), otherwise, it returns `NULL`.

- Example: Mapping status codes to descriptions.

  ```sql
  SELECT order_id,
      status_code,
      CASE status_code
          WHEN 1 THEN 'Pending'
          WHEN 2 THEN 'Shipped'
          WHEN 3 THEN 'Delivered'
          ELSE 'Unknown'
      END AS status_description
  FROM orders;
  ```

- Example: Mapping product categories.

  ```sql
    SELECT product_name,
        category_id,
        CASE category_id
            WHEN 1 THEN 'Electronics'
            WHEN 2 THEN 'Clothing'
            WHEN 3 THEN 'Home & Kitchen'
            ELSE 'Other'
        END AS category_name
    FROM products;
  ```

## COALESCE Function

- The `COALESCE` function in Postgres is used to return the first non-null value from a list of expressions. It is particularly useful for handling null values in queries.
- It's often used to provide default values when dealing with nullable columns during data retrieval or expression evaluation.

- Example: Using COALESCE to handle null values.

  ```sql
  SELECT employee_name,
      COALESCE(phone_number, 'No Phone Number Provided') AS contact_number
  FROM employees;
  ```

- Example: Using COALESCE with multiple columns.

  ```sql
    SELECT customer_name,
        COALESCE(email, phone_number, 'No Contact Info Available') AS primary_contact
  ```

- Example: Using COALESCE in calculations.

  ```sql
  SELECT product_name,
      price,
      discount,
      price - COALESCE(discount, 0) AS final_price
  FROM products;
  ```

- Example: Using COALESCE with aggregation.

  ```sql
  SELECT department,
      SUM(COALESCE(salary, 0)) AS total_salary
  FROM employees
  GROUP BY department;
  ```

- Example: Using in conditional expressions.

  ```sql
  SELECT order_id,
    CASE
      WHEN COALESCE(shipping_date, delivery_date) IS NOT NULL THEN 'Shipped'
      ELSE 'Pending'
    END AS order_status
  ```

- Example: Giving default values in a range from other column

  ```sql
  SELECT product_name,
      price,
      COALESCE(description, LEFT(product_name, 20) || '...') AS product_description
  ```

  - In this example, if the `description` is `NULL`, it uses the first 20 characters of the `product_name` followed by an ellipsis as the default description.

## NULLIF Function

- The `NULLIF` function is standard SQL function that compares two expressions and returns `NULL` if **they are equal**; otherwise, it returns the **first expression**.
- It's similar to `COALESCE`, but specifically used for equality checks, suppose we want to avoid division by zero errors.

- Example: Using NULLIF to prevent division by zero.

  ```sql
  SELECT employee_name,
      total_sales,
      total_clients,
      total_sales / NULLIF(total_clients, 0) AS sales_per_client
  FROM sales_data;
  ```

- Example: Using NULLIF to handle specific values.

  ```sql
    SELECT product_name,
        price,
        NULLIF(price, 0) AS valid_price
    FROM products;
  ```

- Example: Using NULLIF in conditional expressions.

  ```sql
    SELECT order_id,
        quantity,
        unit_price,
        total_price,
        CASE
            WHEN NULLIF(quantity, 0) IS NULL THEN 'Quantity is zero'
            ELSE 'Valid quantity'
        END AS quantity_status
  ```

- Example: Using with COALESCE.

  ```sql
    SELECT employee_name,
        bonus,
        COALESCE(NULLIF(bonus, 0), 'No Bonus') AS bonus_status
    FROM employees;
  ```
