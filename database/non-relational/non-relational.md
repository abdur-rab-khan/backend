# Non Relational Databases

> Non-relational databases, also known as NoSQL databases, provides different way to store and retrieve data compared to traditional relational databases. \
> They use flexible, schema-less data models, making them suitable for handling `unstructured` or `semi-structured` data. \
> Each no-sql database has its `own way of storing and retrieving data`, optimized for specific use cases.

- [Non Relational Databases](#non-relational-databases)
  - [Types of Non-Relational Databases](#types-of-non-relational-databases)
  - [Advantages of Non-Relational Databases](#advantages-of-non-relational-databases)
    - [1. Scalability](#1-scalability)
    - [2. Flexibility](#2-flexibility)
    - [3. High Availability and Fault Tolerance](#3-high-availability-and-fault-tolerance)
    - [4. Big Data and Real-Time Applications](#4-big-data-and-real-time-applications)
  - [BASE (Basically Available, Soft state, Eventual consistency)](#base-basically-available-soft-state-eventual-consistency)
    - [1. Basically Available](#1-basically-available)
    - [2. Soft state](#2-soft-state)
    - [3. Eventual consistency](#3-eventual-consistency)
  - [When to Use Non-Relational Databases or Relational Databases](#when-to-use-non-relational-databases-or-relational-databases)

## Types of Non-Relational Databases

1. **Document Databases**: Stores data in JSON-like documents. Each document can have a different structure, allowing for flexibility.  
   _Examples_: MongoDB, CouchDB
2. **Key-Value Stores**: Data is stored as a collection of key-value pairs. So by using a unique key, you can retrieve the associated value.  
   _Examples_: Redis, DynamoDB
3. **Wide-Column Stores**: Data is stored in tabular format but it's more flexible than traditional relational tables. Each row can have a different number of columns.  
   _Examples_: Apache Cassandra, HBase
4. **Graph Databases**: Designed to represent and store data in graph structures, with nodes, edges, and properties. Ideal for applications involving complex relationships.
   _Examples_: Neo4j, Amazon Neptune

## Advantages of Non-Relational Databases

### 1. Scalability

- Unlike traditional relational databases that often require vertical scaling (upgrading existing hardware), non-relational databases uses horizontal scaling (adding more servers to distribute the load).
- This makes them well-suited for handling large volumes of data and high traffic loads, making them ideal for modern web applications and big data scenarios.

### 2. Flexibility

- Non-relational databases allow for dynamic schema design, meaning that the structure of the data can evolve over time without requiring a predefined schema.
- This flexibility makes it easier for tasks like rapid development, prototyping, and handling diverse data types.
- Developers can easily adapt to changing requirements and store various types of data without the constraints of a rigid schema.

### 3. High Availability and Fault Tolerance

- Many non-relational databases are designed with built-in mechanisms for replication and distribution of data across multiple nodes or servers.
- This ensures high availability, as data can be accessed even if some nodes fail.
- Additionally, these databases often implement strategies for automatic failover and data recovery, enhancing fault tolerance and minimizing downtime.

### 4. Big Data and Real-Time Applications

- Non-relational databases are perform well in areas where write-heavy operations are common, such as logging, real-time analytics, and content management systems.
- They can efficiently handle large volumes of data and provide low-latency access, making them suitable for applications that require real-time data processing and analysis.

## BASE (Basically Available, Soft state, Eventual consistency)

### 1. Basically Available

- Non-relational databases prioritize availability over strict consistency.
- This means that the system guarantees that every request receives a response, but it may not always be the most up-to-date data.

### 2. Soft state

- The state of the system may change over time, even without input.
- This is due to the eventual consistency model, where updates to the database may take time to propagate across all nodes.

### 3. Eventual consistency

- Non-relational databases often use eventual consistency, meaning that while data may not be immediately consistent across all nodes, it will eventually become consistent.
- This approach allows for higher availability and partition tolerance, making it suitable for distributed systems.

## When to Use Non-Relational Databases or Relational Databases

- This decision is totally based on the specific use case and requirements of the application.
  - Consider using non-relational databases when:
    - The data is unstructured or semi-structured.
    - The application requires high scalability and flexibility.
    - Rapid development and iteration are needed.
    - The application involves real-time data processing or big data analytics.
    - High availability and fault tolerance are critical.
  - On the other hand, relational databases are more suitable when:
    - The data is structured and requires complex relationships.
    - ACID (Atomicity, Consistency, Isolation, Durability) properties are essential.
    - The application requires complex queries and transactions.
    - Data integrity and consistency are top priorities.
    - The schema is well-defined and unlikely to change frequently.
- In some cases, a hybrid approach may be beneficial, where both relational and non-relational
