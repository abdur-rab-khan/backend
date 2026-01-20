-- ORDER OF EXECUTION
-- SUBQUERY
--    ↓
-- FROM
--    ↓
-- JOIN / ON
--    ↓
-- WHERE
--    ↓
-- GROUP BY
--    ↓
-- HAVING
--    ↓
-- WINDOW FUNCTIONS
--    ↓
-- SELECT
--    ↓
-- DISTINCT
--    ↓
-- UNION / INTERSECT / EXCEPT
--    ↓
-- ORDER BY
--    ↓
-- LIMIT / OFFSET

-- ❌ ONE OF THE MASSIVE PROBLEM HERE IS THAT, IF YOU SEE IN ORDER OF EXECUTION BEFORE "GROUP BY" IT RUNS "JOIN / ON"
-- ❌ MEANS IT WILL RUN JOIN FOR ALL CUSTOMER, WHICH IS WRONG BECAUSE WE DON'T WANT THAT, AFTER GROUP ONLY FEWS CUSTOMER WILL BE THERE
-- ✅ BELOW SQL QUERY IS OPTIMIZE ONE, FIRST WE WILL USE WITH TO EXTRACT MASSIVE PAYMENTS AFTER THAT WILL JOIN IT.  
SELECT
    customer_id,
    COUNT(customer_id) total_customers,
    JSONB_BUILD_OBJECT(
        'full_name', CONCAT(first_name, ' ', last_name),
        'email', email
    ) AS customer,
    JSONB_AGG(
        JSONB_BUILD_OBJECT(
            'address', address,
            'district', district,
            'phone', phone
        )
    ) AS customer_address
FROM 
    payment
    JOIN 
        customer
    USING(customer_id)
    JOIN
        address
    USING(address_id)
GROUP BY
    customer_id
ORDER BY
    total_customers DESC;


-- OPTIMIZED QUERY USING WITH CLAUSE
-- THE PROBLEM WITH THE ABOVE QUERY IS THAT IT WILL JOIN ALL THE TABLES FIRST AND THEN GROUP BY CUSTOMER_ID
-- WHICH IS INEFFICIENT IF THE PAYMENT TABLE IS LARGE.
-- INSTEAD, WE CAN FIRST AGGREGATE THE PAYMENTS USING A CTE (COMMON TABLE EXPRESSION) AND THEN JOIN THE RESULT WITH THE CUSTOMER AND ADDRESS TABLES.
WITH
  payment_summary AS (
    SELECT
      customer_id,
      SUM(amount) AS total_amount
    FROM
      payment
    GROUP BY
      customer_id
)
SELECT
  customer_id,
  total_amount,
  JSONB_BUILD_OBJECT(
    'full_name', CONCAT(first_name, ' ', last_name),
    'email', email
  ) AS customer_details,
  JSONB_AGG(
    JSONB_BUILD_OBJECT(
      'address', address,
      'district', district,
      'phone', phone
    )
  ) AS address_details
FROM
  payment_summary
  JOIN
      customer
  USING(customer_id)
  JOIN
      address
  USING(address_id)
GROUP BY
  customer_id,
  total_amount;