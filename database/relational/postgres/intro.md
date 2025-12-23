# Intro to Postgres

> **Postgres**, or **PostgreSQL**, is a powerful, open-source relational database management system (RDBMS) known for its robustness, extensibility, and standards compliance. It is widely used for storing and managing structured data in various applications, from small projects to large-scale enterprise systems.

- [Intro to Postgres](#intro-to-postgres)
  - [Key Features of Postgres](#key-features-of-postgres)
    - [1. User-defined types and functions](#1-user-defined-types-and-functions)
      - [User-defined types](#user-defined-types)
      - [Function](#function)
      - [Stored Procedures](#stored-procedures)
    - [2. Table Inheritance](#2-table-inheritance)
    - [3. Sophisticated Locking Mechanisms](#3-sophisticated-locking-mechanisms)
    - [4. Views and Subqueries](#4-views-and-subqueries)
    - [5. Nested Transactions and Savepoints](#5-nested-transactions-and-savepoints)
    - [6. Multi-version concurrency control (MVCC)](#6-multi-version-concurrency-control-mvcc)
    - [6. Asynchronous replication](#6-asynchronous-replication)

## Key Features of Postgres

- Postgres supports many advanced features, that makes it a popular choice among developers and database administrators:

### 1. User-defined types and functions

#### User-defined types

- Postgres allows us to create our own custom data types and functions, enabling us to tailor the database to our specific application needs. This extensibility is one of Postgres's standout features, allowing for greater flexibility in data modeling and processing.
- User-defined types includes:

  - **Composite types**: We can create complex data structures by combining multiple fields with predefined data types, it's similar to creating a struct in programming languages.
  - **Domain types**: These are simple data types with added constraints, like defining string with email format, number within a specific range, etc.
  - **Enum types**: We can define a set of named values, useful for representing categorical data, like status codes or predefined options.

- User-defined functions can be written in various programming languages, including SQL, PL/pgSQL (Postgres's procedural language), Python, and more. This allows us to encapsulate complex logic and reuse it across our database operations.
- Example of creating a user-defined composite type:

  ```sql
  -- 🔷 CREATING A COMPOSITE TYPE FOR ADDRESS
  CREATE TYPE address AS (
      street VARCHAR(100),
      city VARCHAR(50),
      state VARCHAR(50),
      zip_code VARCHAR(10)
  );

  -- USING THE COMPOSITE TYPE IN A TABLE
  CREATE TABLE customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      home_address address
  );

  -- 🔷 CREATING DOMAIN TYPE
  CREATE DOMAIN email AS VARCHAR(255)
      CHECK (VALUE ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

  -- USING THE DOMAIN TYPE IN A TABLE
  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50),
      email email
  );

  -- 🔷 CREATING ENUM TYPE
  CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'delivered', 'canceled');

  -- USING THE ENUM TYPE IN A TABLE
  CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES customers(id),
      status order_status
  );
  ```

#### Function

- User defined functions in Postgres allow us to create reusable pieces of code that can perform specific tasks or calculations within the database, it's similar to stored procedures but they can return values and be used in SQL queries.
- It's similar to functions in programming languages, allowing us to encapsulate logic and improve code organization.
- Example of creating a user-defined function:

  ```sql
    -- 🔷 CREATING A FUNCTION TO CALCULATE DISCOUNTED PRICE
    CREATE OR REPLACE FUNCTION calculate_discounted_price(
        original_price NUMERIC,
        discount_percentage NUMERIC
    ) RETURNS NUMERIC AS $$

    BEGIN
        RETURN original_price - (original_price * discount_percentage / 100);
    END;
    $$ LANGUAGE plpgsql;

    -- USING THE FUNCTION IN A QUERY
    SELECT calculate_discounted_price(100, 15) AS discounted_price;
  ```

#### Stored Procedures

- Stored procedures in Postgres are similar to user-defined functions, but they are designed to perform a series of operations without returning a value. They can be used to encapsulate complex business logic, data manipulation, and transaction management.
- There are some key difference between functions and stored procedures in Postgres:

  - **Transaction Control:** Stored procedures can manage transactions (commit, rollback) while functions cannot.
  - **Return Values:** Functions return values and can be used in SQL queries, while stored procedures do not return values.
  - **Method of Execution:** While procedures are invoked using the `CALL` statement, functions are called as part of SQL expressions, like it can be used in `SELECT`, `WHERE`, etc.
    - `WHERE calculate_discounted_price(price, discount) < 50`.
    - `CALL update_order_status(123, 'shipped');`
  - **Usages in Queries:** Function can be used directly in SQL queries, while stored procedures are invoked separately using the `CALL` statement.

- Example of creating a stored procedure:

  ```sql
    -- 🔷 CREATING A STORED PROCEDURE TO UPDATE ORDER STATUS
    CREATE OR REPLACE PROCEDURE update_order_status(
        order_id INT,
        new_status order_status
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE orders
        SET status = new_status
        WHERE id = order_id;
    END;
    $$;

    -- USING THE STORED PROCEDURE
    CALL update_order_status(123, 'shipped');
  ```

### 2. Table Inheritance

- Postgres supports table inheritance, It's similar to object-oriented programming, where a child table can inherit columns and constraints from a parent table, it we access parent table, it will include data from child tables as well.
- This feature allows us to create more flexible and organized database schemas, enabling us to model hierarchical relationships between entities effectively.
- Example of table inheritance:

  ```sql
  -- 🔷 CREATING A PARENT TABLE
  CREATE TABLE vehicles (
      id SERIAL PRIMARY KEY,
      make VARCHAR(50),
      model VARCHAR(50),
      year INT
  );

  -- 🔷 CREATING A CHILD TABLE THAT INHERITS FROM THE PARENT TABLE
  CREATE TABLE cars (
      num_doors INT
  ) INHERITS (vehicles);

  CREATE TABLE motorcycles (
      has_sidecar BOOLEAN
  ) INHERITS (vehicles);

  -- INSERTING DATA INTO CHILD TABLES
  INSERT INTO cars (make, model, year, num_doors)
  VALUES ('Toyota', 'Camry', 2020, 4);

  INSERT INTO motorcycles (make, model, year, has_sidecar)
  VALUES ('Harley-Davidson', 'Street 750', 2019, FALSE);

  -- QUERYING THE PARENT TABLE TO GET DATA FROM BOTH CHILD TABLES
  SELECT * FROM vehicles;
  ```

- In this example, we created a parent table `vehicles` and two child tables `cars` and `motorcycles` that inherit from it. When we query the `vehicles` table, it returns data from both child tables, demonstrating the inheritance feature in Postgres.
- `ONLY` keyword can be used to query only the parent table without including data from child tables:

  ```sql
  -- QUERYING ONLY THE PARENT TABLE WITHOUT CHILD TABLES
  SELECT * FROM ONLY vehicles;
  ```

### 3. Sophisticated Locking Mechanisms

- Postgres provides sophisticated locking mechanisms to manage concurrent access to data, ensuring data integrity and consistency in multi-user environments.

- Suppose there is a banking application where multiple users are trying to update the same account balance simultaneously. Postgres's locking mechanisms help prevent race conditions and ensure that each transaction is executed in a controlled manner.

- By default, Postgres uses **MVCC (Multi-Version Concurrency Control)** to handle concurrent transactions. This allows multiple transactions to read and write data simultaneously without blocking each other, improving performance and scalability.

- However, in certain scenarios, explicit locks may be necessary to prevent conflicts and ensure data integrity.

- Postgres supports various types of locks, including:

  - **Row-level locks**: These locks are applied to individual rows in a table, allowing multiple transactions to access different rows concurrently without interfering with each other.
  - **Table-level locks**: These locks are applied to entire tables, preventing other transactions from accessing the table while a transaction is in progress.
  - **Advisory locks**: These are application-defined locks that can be used to coordinate access to resources outside of the database.

- Examples of locking mechanisms:

  - **Row-level lock using `SELECT ... FOR UPDATE`**:

    ```sql
    -- Commonly used in scenarios where we need to update a specific row and want to prevent other transactions from modifying it until the current transaction is complete. Like in banking application example.

    BEGIN;

    -- Locking a specific row for update
    SELECT * FROM accounts
    WHERE account_id = 123
    FOR UPDATE; -- Tell Postgres to lock this row for update

    -- Performing the update (application logic goes here)
    UPDATE accounts
    SET balance = balance + 100
    WHERE account_id = 123;

    COMMIT; -- Commit the transaction to release the lock
    ```

  - **Table-level lock using `LOCK` statement**:

    ```sql
    -- Commonly used for maintenance operations such as truncating a table, dropping a table, or altering its structure.

    BEGIN;

    -- Locking the entire table for exclusive access
    LOCK TABLE activities_log IN ACCESS EXCLUSIVE MODE;

    -- Performing operations on the locked table (application logic goes here)
    TRUNCATE TABLE activities_log;

    COMMIT; -- Commit the transaction to release the lock
    ```

  - **Advisory lock using `pg_advisory_lock`**:

    ```sql
    -- Commonly used in scenarios where we need to coordinate access to resources outside of the database, like file access or external services.

    -- This function returns 'true' if it gets the lock, 'false' if someone else has it.
    -- We use a random big integer (e.g., 999) as a unique ID for this specific task.
    SELECT pg_try_advisory_lock(999);

    -- If the result was 'true', run your logic:
    UPDATE accounts SET balance = balance * 1.01;

    -- When finished, unlock it manually (or it will unlock when the session ends)
    SELECT pg_advisory_unlock(999);
    ```

  - Handling **`WAIT`** and **`NOWAIT`** options:

    ```sql
    -- Using NOWAIT to avoid waiting for a lock
    BEGIN;

    -- Attempting to lock a row without waiting
    SELECT * FROM accounts
    WHERE account_id = 123
    FOR UPDATE NOWAIT; -- If the row is already locked, it will raise an error immediately

    -- Performing the update (application logic goes here)
    UPDATE accounts
    SET balance = balance + 100
    WHERE account_id = 123;

    COMMIT; -- Commit the transaction to release the lock
    ```

### 4. Views and Subqueries

- Postgres supports views and subqueries, which are powerful tools for organizing and simplifying complex queries.
- **Views** are virtual tables that are defined by a SQL query. They allow us to encapsulate complex queries and present them as simple tables, making it easier to work with complex data structures.

- Example of creating a view:

  ```sql
  -- 🔷 CREATING A VIEW TO SIMPLIFY COMPLEX QUERY
  CREATE VIEW active_customers AS
  SELECT id, name, email
  FROM customers
  WHERE status = 'active';

  -- USING THE VIEW IN A QUERY
  SELECT * FROM active_customers;
  ```

- In this example, we created a view called `active_customers` that encapsulates a complex query to retrieve active customers. We can then use this view in our queries as if it were a regular table.
- **Subqueries** are queries nested within other queries. They allow us to break down complex queries into smaller, more manageable parts, improving readability and maintainability.
- Example of using a subquery:

  ```sql
  -- 🔷 USING A SUBQUERY TO FIND CUSTOMERS WITH ORDERS ABOVE A CERTAIN AMOUNT
  SELECT id, name
  FROM customers
  WHERE id IN (
      SELECT customer_id
      FROM orders
      WHERE total_amount > 1000
  );
  ```

- In this example, we used a subquery to find customers who have placed orders with a total amount greater than 1000. The subquery retrieves the relevant customer IDs, which are then used in the outer query to fetch customer details.

### 5. Nested Transactions and Savepoints

- Postgres supports nested transactions and savepoints, which allow us to manage complex transaction workflows with greater control and flexibility.
- **Nested transactions** enable us to create transactions within other transactions. This is useful when we want to perform a series of operations that can be committed or rolled back independently of the outer transaction.
- Key concepts

  - **Savepoints**: Savepoints makes a bookmark or a point within a transaction that helps us to roll back to that specific point without affecting the entire transaction.
  - **The Hierarchy**: In Postgres, nested transactions are implemented using savepoints. Each nested transaction creates a new savepoint, allowing us to roll back to that point if needed. If outer (parent) transaction failed, all inner (child) transactions will also be rolled back.

- Example of using nested transactions and savepoints:

  ```sql
  -- 1. Start the main "Top-Level" transaction
  BEGIN;

  -- 2. Execute the Mandatory Task: Book the Flight
  -- Let's assume we are updating the 'flights' table
  UPDATE flights
  SET status = 'BOOKED', passenger_name = 'CS Student'
  WHERE flight_id = 101 AND seats_available > 0;

  -- 3. Create the "Nested" marker (Savepoint)
  -- This marks the point where the Flight is safe.
  SAVEPOINT hotel_booking_start;

  -- 4. Attempt the Optional Task: Book the Hotel
  -- We try to book Hotel 'Grand Plaza'
  UPDATE hotels
  SET status = 'RESERVED', guest_name = 'CS Student'
  WHERE hotel_id = 505 AND rooms_available > 0;

  -- 5. SCENARIO: The Hotel is actually full (The query above affected 0 rows)
  -- In a real app, your code would check if the hotel booking failed.
  -- If it failed, we ROLLBACK only to our marker:
  ROLLBACK TO SAVEPOINT hotel_booking_start;

  -- 6. (Optional) Try an alternative hotel since the first one failed
  -- Because we rolled back to the savepoint, we can try again
  -- without affecting the Flight booking.
  UPDATE hotels
  SET status = 'RESERVED', guest_name = 'CS Student'
  WHERE hotel_id = 707 AND rooms_available > 0;

  -- 7. Finalize everything
  -- This makes the Flight and the second Hotel choice permanent.
  COMMIT;
  ```

### 6. Multi-version concurrency control (MVCC)

- Older database systems often use locking mechanisms when multiple users try to access the same data simultaneously. This can lead to performance bottlenecks and reduced concurrency.
- Postgres uses Multi-Version Concurrency Control (MVCC) to handle concurrent transactions more efficiently. MVCC allows multiple versions of a data item to exist simultaneously, enabling readers to access a consistent snapshot of the data without being blocked by writers.
- With MVCC, when a transaction modifies data, it creates a new version of that data item rather than overwriting the existing version. This allows other transactions to continue reading the old version until they are ready to see the new version.
- Example scenario:
  - Transaction A starts and reads a row from a table.
  - Transaction B starts and updates the same row, creating a new version.
  - Transaction A continues to see the old version of the row until it completes, while Transaction B can proceed with its update without blocking Transaction A.
  - Once Transaction A completes, it can choose to see the new version of the row if it starts a new transaction.
  - This approach improves concurrency and reduces contention between transactions, leading to better overall performance in multi-user environments.
- Example of MVCC in action:

  ```sql
  -- Transaction A
  BEGIN;

  SELECT * FROM accounts WHERE account_id = 123; -- Reads the current version of the row

  -- Transaction B
  BEGIN;
  UPDATE accounts SET balance = balance + 100 WHERE account_id = 123; -- Creates a new version of the row
  COMMIT; -- Commits the update

  -- Back to Transaction A
  SELECT * FROM accounts WHERE account_id = 123; -- Still sees the old version of the row
  COMMIT; -- Completes Transaction A
  ```

### 6. Asynchronous replication

- Postgres supports asynchronous replication, which allows us to create standby replicas of our primary database server. This feature is useful for improving read scalability, disaster recovery, and high availability.
- In asynchronous replication, the primary server sends write-ahead log (WAL) records to the standby servers, but it does not wait for the standby servers to acknowledge receipt of the data before committing transactions. This means that there may be a slight delay between when data is written to the primary server and when it becomes available on the standby servers.
- Example of setting up asynchronous replication:

  - Configure the primary server to enable replication and specify the standby servers.
  - Set up the standby servers to connect to the primary server and start receiving WAL records.
  - Monitor the replication status to ensure that the standby servers are up-to-date with the primary server.
  - Example configuration settings for asynchronous replication in `postgresql.conf`:

  ```conf
  # On the primary server
  wal_level = replica
  max_wal_senders = 5
  wal_keep_size = 16MB
  ```

  ```conf
  # On the standby server
  primary_conninfo = 'host=primary_host port=5432 user=replicator
  standby_mode = 'on'
  ```

- Once set up, we can use the standby servers for read-only queries, offloading read traffic from the primary server and improving overall performance.
