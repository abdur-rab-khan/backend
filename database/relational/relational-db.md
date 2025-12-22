# Relational Databases

> A **Relational Database** is provides a way to make a relationship between one point of data to another point of data, allowing for complex queries and data integrity. It uses tables to store data and SQL (Structured Query Language) to manage and manipulate that data.

- [Relational Databases](#relational-databases)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Important Concepts](#important-concepts)
    - [Normalization](#normalization)
    - [Denormalization](#denormalization)
    - [Splitting Tables](#splitting-tables)

## Overview

- **Tables:** Tables are used to store data in rows and columns. Each table represents an entity (e.g., Users, Orders) and each row represents a record.

- **Relationship:** For complex data structures, Relationship is necessary to link tables together, that allows for efficient data retrieval and management.

- **SQL:** SQL is the standard language used to interact with relational databases. It allows for querying, updating, and managing data.

- **ACID Properties:** One of the key features of relational databases is that they adhere to ACID properties (Atomicity, Consistency, Isolation, Durability) to ensure reliable transactions.

  - **Atomicity:** Ensures that all operations within a transaction are completed successfully or none are.
  - **Consistency:** Ensures that a transaction brings the database from one valid state to another.
  - **Isolation:** Ensures that concurrent transactions do not interfere with each other.
  - **Durability:** Ensures that once a transaction is committed, it will remain so, even in the event of a system failure.

- **Normalization:** Normalization is the process of organizing data and make schema design to reduce redundancy and improve data integrity, core principles include:

  - Eliminating redundant data
  - Ensuring data dependencies make sense
  - Example: Suppose we have a table that stores customer orders. If the customer's address is stored in multiple rows, it can lead to inconsistencies. Normalization would involve creating a separate table for customers and linking it to the orders table via a foreign key.

- **Indexes:** Indexes are used to improve the speed of data retrieval operations on a database table, it use a data structure (like B-tree or hash) to quickly locate data without having to scan the entire table, **its similar to finding data in a array using an index.**

- **Joins:** Joins are used to combine rows from two or more tables based on a related column between them. Common types of joins include:

  - **INNER JOIN:** Returns records that have matching values in both tables.
  - **LEFT JOIN:** Returns all records from the left table and the matched records from the right table.
  - **RIGHT JOIN:** Returns all records from the right table and the matched records from the left table.
  - **FULL JOIN:** Returns all records when there is a match in either left or right table.

- **Transactions:** Transactions are a sequence of operations performed as a single logical unit of work, ensuring data integrity and consistency.

- **Stored Procedures:** Stored procedures are precompiled SQL statements similar to functions in programming languages, they can accept parameters and return results, allowing for code reuse and improved performance.

- **Views:** Views are virtual tables that are based on the result of more complex queries like joins and aggregations, using views can simplify data access and enhance security by restricting access to specific data.

- **Foreign Keys/Primary Keys:** Primary keys uniquely identify each record in a table, while foreign keys establish relationships between tables by referencing primary keys in other tables.

- **Common Relational Database Management Systems (RDBMS):**
  - MySQL
  - ⭐ PostgreSQL
  - Oracle Database
  - Microsoft SQL Server
  - SQLite

## Key Features

- **Separation of Logical and Physical Structures:** The relational model separates logical data structures (tables, views, indexes) from physical storage, allowing database administrators to manage storage independently without affecting data access.

- **Logical vs Physical Operations:** Logical operations define what data is needed, while physical operations determine how to access and retrieve that data, providing a clear distinction between application requirements and implementation.

- **Integrity Rules:** Relational databases enforce integrity (integrity means accuracy and consistency of data) rules to maintain data accuracy and consistency, such as preventing duplicate rows in tables to ensure data reliability.

- **Locking Mechanisms:** Locking mechanisms works when multiple users try to update, delete or insert data simultaneously, it make a lock on that row to prevent conflicts and ensure data integrity during concurrent transactions.

- **Atomicity:** Ensures that all operations within a transaction are completed successfully or none are, maintaining data integrity. Suppose a bank transfer involves debiting one account and crediting another; atomicity ensures that both operations succeed or neither does.

- **Consistency:** Ensures that a transaction brings the database from one valid state to another, maintaining database rules. For example, if a transaction violates a unique constraint, it will be rolled back to preserve consistency.

- **Isolation:** Ensures that concurrent transactions do not interfere with each other, preventing data anomalies. For instance, if two transactions are updating the same record simultaneously, isolation ensures that one transaction's changes are not visible to the other until it is complete.

- **Durability:** Ensures that once a transaction is committed, it will remain so, even in the event of a system failure. For example, if a power outage occurs after a transaction is committed, the changes will still be present when the system is restored.

- **Data Integrity:** Relational databases enforce data integrity through constraints (like primary keys, foreign keys, unique constraints) to ensure accuracy and consistency of data. For example, a foreign key constraint ensures that a record in a child table cannot reference a non-existent record in a parent table.

- **Scalability:** While relational databases are traditionally scaled vertically (by adding more resources to a single server), modern RDBMSs also support horizontal scaling (distributing data across multiple servers) through techniques like sharding and replication.

## Important Concepts

### Normalization

- Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. The main goals of normalization are to eliminate redundant data and ensure that data dependencies make sense.

- There are several normal forms (1NF, 2NF, 3NF, BCNF, etc.), each with specific rules for structuring data. The most commonly used normal forms are:

  - **First Normal Form (1NF):** Ensures that each column contains atomic values and that each record is unique.

    - Example: A table with a column that contains multiple phone numbers for a single customer would violate 1NF. To comply with 1NF, each phone number should be stored in a separate row or in a separate table linked by a foreign key.

      ```mermaid
      erDiagram
          CUSTOMER {
              int CustomerID PK
              string CustomerName
          }
          PHONE {
              int PhoneID PK
              int CustomerID FK
              string PhoneNumber
          }
          CUSTOMER ||--o{ PHONE : has
      ```

  - **Second Normal Form (2NF):** Builds on 1NF by ensuring that all non-key attributes are fully functionally dependent on the primary key.

    - Example: In a table with a composite primary key (e.g., OrderID and ProductID), if a non-key attribute (e.g., ProductName) depends only on ProductID, it violates 2NF. To comply with 2NF, ProductName should be moved to a separate table linked by ProductID.

      ```mermaid
      erDiagram
          ORDER {
              int OrderID PK
              int ProductID PK
              int Quantity
              string ProductName❌
          }
          PRODUCT {
              int ProductID PK
              string ProductName✅
          }
          ORDER ||--o{ PRODUCT : contains
      ```

  - **Third Normal Form (3NF):** Builds on 2NF by ensuring that all attributes are only dependent on the primary key and not on other non-key attributes.

    - Example: If a table contains CustomerID, CustomerName, and CustomerAddress, and CustomerAddress depends on CustomerName, it violates 3NF. To comply with 3NF, CustomerAddress should be moved to a separate table linked by CustomerID.

      ```mermaid
      erDiagram
          CUSTOMER {
              int CustomerID PK
              string CustomerName
              string CustomerAddress❌
          }
          ADDRESS {
              int AddressID PK
              int CustomerID FK
              string CustomerAddress✅
          }
          CUSTOMER ||--o{ ADDRESS : has
      ```

### Denormalization

- **Denormalization** is the process of intentionally introducing redundancy into a database by combining tables or adding redundant data to improve read performance. It is often used in scenarios where read operations are more frequent than write operations.
- For example, in a reporting database where complex queries are common, denormalization can reduce the number of joins required to retrieve data, thereby improving query performance.

  - Example: Suppose we have social media application with separate table for Posts and Likes, denormalization would involve adding a LikesCount column to the Posts table to avoid counting likes each time we retrieve posts.

    ```mermaid
    erDiagram
        POST {
            int PostID PK
            string Content
            int LikesCount✅
        }
        LIKE {
            int LikeID PK
            int PostID FK
            int UserID
        }
        POST ||--o{ LIKE : has
    ```

    - Instead of using `SELECT count(*) FROM LIKE WHERE PostID = ?` each time to get the number of likes for a post, we can directly read the `LikesCount` from the `POST` table, improving read performance at the cost of some redundancy.

### Splitting Tables

- **Splitting Tables** is a database design technique used to improve performance, manageability, and scalability by dividing a large table into smaller, more manageable pieces. This can be done in several ways:

  - **Vertical Splitting:** Dividing a table into multiple tables based on columns. For example, separating frequently accessed columns from infrequently accessed ones.

    ```mermaid
    erDiagram
        USER {
            int UserID PK
            string UserName
            string Email
        }
        USER_PROFILE {
            int UserID PK
            string Bio
            string ProfilePicture
        }
        USER ||--o{ USER_PROFILE : has
    ```

  - **Horizontal Splitting (Sharding):** Dividing a table into multiple tables based on rows. For example, splitting user data by geographic region.

    ```mermaid
    erDiagram
        USER_US {
            int UserID PK
            string UserName
            string Region "US"
        }
        USER_EU {
            int UserID PK
            string UserName
            string Region "EU"
        }
    ```

  - **Functional Splitting:** Dividing a table based on functionality or usage patterns. For example, separating transactional data from archival data.

    ```mermaid
    erDiagram
        ORDER_ACTIVE {
            int OrderID PK
            int UserID FK
            string Status "Active"
        }
        ORDER_ARCHIVE {
            int OrderID PK
            int UserID FK
            string Status "Archived"
        }
    ```

- Splitting tables can lead to improved query performance, easier maintenance, and better scalability, especially in large databases with high transaction volumes.
