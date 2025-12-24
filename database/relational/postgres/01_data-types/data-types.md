# Datatype in PostgreSQL

> PostgreSQL supports a wide range of data types to store different kinds of data. Here are some of the most commonly used data types in PostgreSQL:

- [Datatype in PostgreSQL](#datatype-in-postgresql)
  - [Boolean Type](#boolean-type)
  - [Numeric Types](#numeric-types)
    - [Example](#example)
  - [Character Types: CHAR, VARCHAR, TEXT](#character-types-char-varchar-text)
  - [Array Types](#array-types)
    - [Accessing All Elements](#accessing-all-elements)
    - [Getting Array Length](#getting-array-length)
    - [Updating Array Elements](#updating-array-elements)
    - [Search Condition with ANY and ALL](#search-condition-with-any-and-all)
  - [Enum Types](#enum-types)
    - [Altering Enum Types](#altering-enum-types)
  - [JSON and JSONB Types](#json-and-jsonb-types)
    - [Querying JSON and JSONB Data](#querying-json-and-jsonb-data)
    - [Important JSON Operators and Functions](#important-json-operators-and-functions)
  - [UUID Type](#uuid-type)

## Boolean Type

- PostgreSQL has a built-in `BOOLEAN` data type to store logical values. It supports three states: `TRUE`, `FALSE`, and `NULL` (unknown).
- Postgres allows us to use various literals to represent boolean values:

  | True Values | False Values |
  | ----------- | ------------ |
  | `TRUE`      | `FALSE`      |
  | `t`         | `f`          |
  | `yes`       | `no`         |
  | `y`         | `n`          |
  | `1`         | `0`          |

- Here is an example of how to create a table with a boolean data type in PostgreSQL:

  ```sql
  CREATE TABLE stock_availability (
      product_id SERIAL PRIMARY KEY,
      in_stock BOOLEAN NOT NULL -- Boolean field to indicate stock availability
  );

  INSERT INTO stock_availability (product_id, in_stock) VALUES
  (1, TRUE),
  (2, FALSE),
  (3, NULL), -- Unknown stock status
  (4, 't'), -- Using 't' as TRUE
  (5, 'f'), -- Using 'f' as FALSE
  (6, 'yes'), -- Using 'yes' as TRUE
  (7, 'no'), -- Using 'no' as FALSE
  (8, 1), -- Using 1 as TRUE
  (9, 0), -- Using 0 as FALSE
  ```

## Numeric Types

- In postgres you will commonly deals with the following numeric types:

  | Data Type  | Description                            | Number in Range                                          | Storage Size | Example                          |
  | ---------- | -------------------------------------- | -------------------------------------------------------- | ------------ | -------------------------------- |
  | `SMALLINT` | Small integer                          | -32,768 to +32,767                                       | 2 bytes      | `PRICE SMALLINT NOT NULL`        |
  | `INTEGER`  | Integer                                | -2,147,483,648 to +2,147,483,647                         | 4 bytes      | `QUANTITY INTEGER NOT NULL`      |
  | `BIGINT`   | Big integer                            | -9,223,372,036,854,775,808 to +9,223,372,036,854,775,807 | 8 bytes      | `COUNT BIGINT NOT NULL`          |
  | `DECIMAL`  | Exact numeric                          | User-defined precision and scale                         | Variable     | `PRICE DECIMAL(10, 2) NOT NULL`  |
  | `NUMERIC`  | Exact numeric                          | User-defined precision and scale                         | Variable     | `AMOUNT NUMERIC(15, 4) NOT NULL` |
  | `REAL`     | Single precision floating-point number | 6 decimal digits precision                               | 4 bytes      | `FLOAT4`                         |
  | `DOUBLE`   | Double precision floating-point number | 15 decimal digits precision                              | 8 bytes      | `FLOAT8`                         |

- These data types allow you to store various kinds of numeric values efficiently in your PostgreSQL database.

### Example

- Here is an example of how to create a table with different numeric data types in PostgreSQL:

  ```sql
  CREATE TABLE products (
      product_id SERIAL PRIMARY KEY,
      product_name VARCHAR(100) NOT NULL,
      price DECIMAL(10, 2) NOT NULL, -- Price with 2 decimal places (eg. 99999999.99)
      quantity INTEGER NOT NULL, -- Whole number for quantity (eg. 100, 2500)
      weight REAL -- Weight in single precision (eg. 12.345, 67.890)
  );

  CREATE TABLE orders (
      order_id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(product_id),
      order_quantity SMALLINT NOT NULL, -- Small integer for order quantity (eg. 1, 5, 10)
      total_amount NUMERIC(12, 2) NOT NULL -- Total amount with 2 decimal places (eg. 9999999999.99)
  );
  ```

## Character Types: CHAR, VARCHAR, TEXT

- PostgreSQL provides several character data types to store text data:

  | Data Type    | Description                                     | Storage Size           | Example                    |
  | ------------ | ----------------------------------------------- | ---------------------- | -------------------------- |
  | `CHAR(n)`    | Fixed-length character string (means exactly n) | n bytes                | `NAME CHAR(50) NOT NULL`   |
  | `VARCHAR(n)` | Variable-length character string (up to n)      | 1 byte + actual length | `DESCRIPTION VARCHAR(255)` |
  | `TEXT`       | Variable-length character string (unlimited)    | 1 byte + actual length | `COMMENTS TEXT`            |

- `CHAR(n)` is used when the length of the string is known and fixed. It pads the string with spaces if it is shorter than n.
- `VARCHAR(n)` is used when the length of the string can vary but has a maximum limit of n characters.
- `TEXT` is used for storing large amounts of text without a specific length limit.

- Here is an example of how to create a table with different character data types in PostgreSQL:

  ```sql
  CREATE TABLE employees (
      employee_id SERIAL PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL, -- Variable-length string up to 50 characters
      last_name CHAR(50) NOT NULL, -- Fixed-length string of exactly 50 characters
      bio TEXT -- Large text field for employee biography
  );

  CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL, -- Variable-length string up to 200 characters
      content TEXT NOT NULL -- Large text field for article content
  );
  ```

## Array Types

- PostgreSQL supports array data types, allowing you to store multiple values in a single column.
- Every data types in PostgresSQL have their array equivalent by appending `[]` to the data type, for example `INTEGER[]`, `TEXT[]`, `BOOLEAN[]`, etc.
- Array can also be used with custom composite types, allowing you to create arrays of user-defined types.
- Here is an example of how to create a table with array data types in PostgreSQL:

  ```sql
  CREATE TABLE students (
      student_id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      grades INTEGER[] -- Array of integers to store grades
  );

  INSERT INTO students (student_id, name, grades) VALUES
  (1, 'Alice', ARRAY[85, 90, 78]),
  (2, 'Bob', ARRAY[88, 92, 80]),
  (3, 'Charlie', ARRAY[70, 75, 80]);
  ```

  - As you can see in the example we use the `ARRAY` constructor to insert an array of integers into the `grades` column, alternatively you can also use the following syntax:

    ```sql
        INSERT INTO students (student_id, name, grades) VALUES
        (4, 'David', '{95, 88, 92}'),
        (5, 'Eva', '{78, 85, 80}');
    ```

- Let's access the array elements using indexing:

  ```sql
  SELECT name, grades[1] AS first_grade, grades[2] AS second_grade
  FROM students;
  ```

  - This query retrieves the first and second grades for each student from the `grades` array.

### Accessing All Elements

- You can access all elements of an array using the `unnest` function:

  ```sql
  SELECT name, unnest(grades) AS grade
  FROM students;
  ```

  - This query retrieves each grade for every student as separate rows.
  - The `unnest` function expands an array to a set of rows, allowing you to work with individual elements of the array.

### Getting Array Length

- You can get the length of an array using the `array_length` function:

  ```sql
  SELECT name, array_length(grades, 1) AS number_of_grades
  FROM students;
  ```

  - This query retrieves the number of grades for each student from the `grades` array. The second argument `1` specifies that we want the length of the first dimension of the array.

### Updating Array Elements

- You can update specific elements of an array using their index:

  ```sql
  UPDATE students
  SET grades[1] = 95 -- Update the first grade to 95
  WHERE student_id = 2;
  ```

  - This query updates the first element of the `grades` array for the student with `student_id` 2 to 95.

### Search Condition with ANY and ALL

- PostgreSQL provides the `ANY` and `ALL` operators to work with array data types in search conditions.
- `ANY`: Returns true if any element of the array satisfies the condition.
- `ALL`: Returns true if all elements of the array satisfy the condition.

  ```sql
  -- Using ANY to find students with any grade greater than 90
  SELECT *
  FROM students
  WHERE 90 < ANY (grades);

  -- Using ALL to find students with all grades greater than 70
  SELECT *
  FROM students
  WHERE 70 < ALL (grades);
  ```

- **_Note_** that array indexing in PostgreSQL starts at 1, not 0.

## Enum Types

- PostgreSQL allows you to create custom enumerated types (enums) to represent a fixed set of values.
- Enum type is useful when you want to restrict a column to a specific set of values, improving data integrity and readability.
- Here is an example of how to create and use an enum type in PostgreSQL:

  ```sql
  -- Create an enum type for order status
  CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'delivered', 'canceled');

  -- Create a table using the enum type
  CREATE TABLE orders (
      order_id SERIAL PRIMARY KEY,
      customer_name VARCHAR(100) NOT NULL,
      status order_status NOT NULL -- Using the custom enum type
  );

  -- Insert data into the table
  INSERT INTO orders (customer_name, status) VALUES
  ('Alice', 'pending'),
  ('Bob', 'shipped'),
  ('Charlie', 'delivered'),
  ('David', 'canceled');

  -- Query the table
    SELECT *
    FROM orders
    WHERE status = 'shipped';
    ORDER BY status;
  ```

- Enum are **_case-sensitive_**, so 'Pending' and 'pending' would be considered different values.

### Altering Enum Types

- You can alter an existing enum type to add new values using the `ALTER TYPE` command:

  ```sql
  -- Add a new value 'returned' to the order_status enum type
  ALTER TYPE order_status ADD VALUE [IF NOT EXISTS] 'returned';

  -- Now you can use the new value in the orders table
  INSERT INTO orders (customer_name, status) VALUES
  ('Eva', 'returned');
  ```

  - The optional `IF NOT EXISTS` clause prevents an error if the value already exists in the enum type.

- Let's rename an existing enum value:

  ```sql
  -- Rename the enum value 'canceled' to 'cancelled'
  ALTER TYPE order_status RENAME VALUE 'canceled' TO 'cancelled';
  ```

## JSON and JSONB Types

- PostgreSQL allows unstructured data to be stored using the `JSON` and `JSONB` data types.
- `JSON`: Stores JSON data as plain text. It preserves the original formatting, including whitespace.
- `JSONB`: Stores JSON data in a binary format. It takes time to convert JSON to binary format when inserting, but it is more efficient for querying and indexing.

- Here is an example of how to create a table with JSON and JSONB data types in PostgreSQL:

  ```sql
  CREATE TABLE products (
      product_id SERIAL PRIMARY KEY,
      product_name VARCHAR(100) NOT NULL,
      specifications JSON, -- JSON data type for product specifications
      metadata JSONB -- JSONB data type for product metadata
  );

  INSERT INTO products (product_name, specifications, metadata) VALUES
  ('Laptop', '{"processor": "Intel i7", "ram": "16GB", "storage": "512GB SSD"}', '{"warranty": "2 years", "rating": 4.5}'),
  ('Smartphone', '{"processor": "Snapdragon 888", "ram": "8GB", "storage": "256GB"}', '{"warranty": "1 year", "rating": 4.7}');
  ```

  - Mostly we use `JSONB` over `JSON` due to its efficiency in querying and indexing.
  - But in some cases where preserving the exact formatting of the JSON data is important, you might choose to use the `JSON` data type instead.

### Querying JSON and JSONB Data

- You can query JSON and JSONB data using various operators and functions provided by PostgreSQL.
- Here are some examples of querying JSON and JSONB data:

  ```sql
  -- Retrieve product specifications for a specific product
  SELECT product_name, specifications->>'processor' AS processor
  FROM products
  WHERE product_id = 1;

  -- Retrieve all products with a rating greater than 4.6
  SELECT product_name, metadata->>'rating' AS rating
  FROM products
  WHERE (metadata->>'rating')::FLOAT > 4.6;

  -- Update the warranty information in the metadata JSONB column
  UPDATE products
  SET metadata = jsonb_set(metadata, '{warranty}', '"3 years"')
  WHERE product_id = 1;
  ```

- In the examples above, we use the `->>` operator to extract values from JSON and JSONB columns, and the `jsonb_set` function to update values in a JSONB column.
- `->` operator retrieves a JSON object field by key, while `->>` retrieves the field as text, which can be useful for comparisons and type casting.

### Important JSON Operators and Functions

- Here are some important operators for working with JSON and JSONB data in PostgreSQL:

  | Operator | Description                               | Example                       |
  | -------- | ----------------------------------------- | ----------------------------- |
  | `->`     | Get JSON object field by key              | `specifications->'processor'` |
  | `->>`    | Get JSON object field as text             | `specifications->>'ram'`      |
  | `#>`     | Get JSON object at specified path         | `metadata#>'{warranty}'`      |
  | `#>>`    | Get JSON object at specified path as text | `metadata#>>'{rating}'`       |

- Here are some important functions for working with JSON and JSONB data in PostgreSQL:

  | Function               | Description                             | Example                                                         |
  | ---------------------- | --------------------------------------- | --------------------------------------------------------------- |
  | `jsonb_set`            | Update value in JSONB column            | `jsonb_set(metadata, '{warranty}', '"4 years"')`                |
  | `jsonb_array_elements` | Expand JSONB array to set of rows       | `jsonb_array_elements(specifications->'features')`              |
  | `to_jsonb`             | Convert value to JSONB                  | `to_jsonb(product_name)`                                        |
  | `jsonb_build_object`   | Build JSONB object from key-value pairs | `jsonb_build_object('key1', 'value1', 'key2', 'value2')`        |
  | `jsonb_set`            | Update value in JSONB column            | `jsonb_set(metadata, '{warranty}', '"4 years"')`                |
  | `jsonb_insert`         | Insert value into JSONB array           | `jsonb_insert(specifications, '{features,0}', '"New Feature"')` |

## UUID Type

- PostgreSQL provides a built-in `UUID` data type to store Universally Unique Identifiers (UUIDs), commonly used as unique keys in distributed systems.
- UUIDs are 128-bit values represented as 32 hexadecimal characters, typically displayed in five groups separated by hyphens (e.g., `550e8400-e29b-41d4-a716-446655440000`).
- Here is an example of how to create a table with a UUID data type in PostgreSQL:

  ```sql
  CREATE TABLE users (
      user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- UUID primary key with default value
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL
  );

  INSERT INTO users (username, email) VALUES
    ('alice', 'alice@gmail.com),
    ('bob', 'bob@gmail.com');
  ```

- In the example above, we use the `gen_random_uuid()` function to generate a random UUID for the `user_id` column by default.
- To use the `gen_random_uuid()` function, you may need to enable the `pgcrypto` extension in your database:

  ```sql
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
  ```

- You can also generate UUIDs using other functions like `uuid_generate_v4()` from the `uuid-ossp` extension, which you may need to install separately.

  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```
