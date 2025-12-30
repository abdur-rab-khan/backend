# Datatype in PostgreSQL

> PostgreSQL supports a wide range of data types to store different kinds of data. Here are some of the most commonly used data types in PostgreSQL:

- [Datatype in PostgreSQL](#datatype-in-postgresql)
  - [Boolean Type](#boolean-type)
  - [Numeric Types](#numeric-types)
    - [Example](#example)
  - [Character Types: CHAR, VARCHAR, TEXT](#character-types-char-varchar-text)
  - [Array Types](#array-types)
    - [Accessing All Elements](#accessing-all-elements)
    - [Updating Array Elements](#updating-array-elements)
    - [Search Condition with ANY and ALL](#search-condition-with-any-and-all)
  - [Enum Types](#enum-types)
    - [Altering Enum Types](#altering-enum-types)
  - [JSON and JSONB Types](#json-and-jsonb-types)
    - [Querying JSON and JSONB Data](#querying-json-and-jsonb-data)
    - [Important JSON Operators and Functions](#important-json-operators-and-functions)
  - [UUID Type](#uuid-type)
  - [SERIAL Type](#serial-type)
  - [DATE, TIME and TIMESTAMP Types](#date-time-and-timestamp-types)
  - [BYTEA Types](#bytea-types)

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
- `VARCHAR(n)` is used when the length of the string can vary but has a maximum limit of n characters, it you does not define a length limit it behaves like `TEXT`.
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
- PostgreSQL have various [functions](../10_aggregate-function) and [operators](../11_operators) to work with array data types.

  - Important array functions:

    | Function          | Description                              | Example                                                  |
    | ----------------- | ---------------------------------------- | -------------------------------------------------------- |
    | `array_length`    | Get the length of an array               | `array_length(grades, 1)` -> 1 specifies about dimension |
    | `unnest`          | Expand an array to a set of rows         | `unnest(grades)`                                         |
    | `array_append`    | Append an element to the end of an array | `array_append(grades, 95)`                               |
    | `array_prepend`   | Prepend an element to the beginning      | `array_prepend(85, grades)`                              |
    | `array_cat`       | Concatenate two arrays                   | `array_cat(array1, array2)`                              |
    | `array_remove`    | Remove all occurrences of an element     | `array_remove(grades, 80)`                               |
    | `array_replace`   | Replace all occurrences of an element    | `array_replace(grades, 70, 75)`                          |
    | `array_position`  | Get the index of the first occurrence    | `array_position(grades, 90)`                             |
    | `array_to_string` | Convert an array to a string             | `array_to_string(grades, ', ')`                          |

  - Important array operators:

    | Operator | Description                   | Example                      |
    | -------- | ----------------------------- | ---------------------------- |
    | `@>`     | Contains                      | `grades @> ARRAY[90]`        |
    | `<@`     | Is contained by               | `ARRAY[85, 90] <@ grades`    |
    | `&&`     | Overlaps                      | `grades && ARRAY[70, 80]`    |
    | `\|\|`   | Concatenate                   | `grades \|\| ARRAY[95, 100]` |
    | `[]`     | Access array element by index | `grades[1]`                  |

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

## SERIAL Type

- PostgreSQL provides the `SERIAL` data type as a convenient way to create auto-incrementing integer columns, typically used for primary keys.
- When you define a column as `SERIAL` pseudo-type, PostgreSQL automatically creates a sequence object and sets the default value of the column to the next value from that sequence.
- Here is an example of how to create a table with a `SERIAL` data type in PostgreSQL:

  ```sql
  CREATE TABLE employees (
      employee_id SERIAL PRIMARY KEY, -- Auto-incrementing primary key
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      hire_date DATE NOT NULL
  );

  INSERT INTO employees (first_name, last_name, hire_date) VALUES
  ('Alice', 'Smith', '2022-01-15'),
  ('Bob', 'Johnson', '2022-02-20'),
  ('Charlie', 'Brown', '2022-03-10');
  ```

  - We can use `DEFAULT` keyword to insert the next value from the sequence explicitly:

    ```sql
    INSERT INTO employees (employee_id, first_name, last_name, hire_date)
    VALUES (DEFAULT, 'David', 'Wilson', '2022-04-05')
    RETURNING employee_id;
    ```

    - `RETURNING` clause returns the generated `employee_id` after the insert operation.

- Note that `SERIAL` is not a true data type but a shorthand for creating an integer column with an associated sequence. The actual data type of a `SERIAL` column is `INTEGER`.
- PostgreSQL also provides `BIGSERIAL` for larger auto-incrementing integers and `SMALLSERIAL` for smaller ones:

  | Data Type     | Description                     | Storage Size | Range                          |
  | ------------- | ------------------------------- | ------------ | ------------------------------ |
  | `SMALLSERIAL` | Auto-incrementing small integer | 2 bytes      | 1 to 32,767                    |
  | `SERIAL`      | Auto-incrementing integer       | 4 bytes      | 1 to 2,147,483,647             |
  | `BIGSERIAL`   | Auto-incrementing big integer   | 8 bytes      | 1 to 9,223,372,036,854,775,807 |

## DATE, TIME and TIMESTAMP Types

- These data types are used to store, handle, and manipulate date and time values in PostgreSQL.

- Here are the commonly used date and time data types in PostgreSQL:

  | Data Type     | Description                                  | Storage Size | Example                           |
  | ------------- | -------------------------------------------- | ------------ | --------------------------------- |
  | `DATE`        | Stores calendar date (year, month, day)      | 4 bytes      | `birth_date DATE NOT NULL`        |
  | `TIME`        | Stores time of day (hours, minutes, seconds) | 8 bytes      | `appointment_time TIME NOT NULL`  |
  | `TIMESTAMP`   | Stores both date and time (without timezone) | 8 bytes      | `created_at TIMESTAMP NOT NULL`   |
  | `TIMESTAMPTZ` | Stores both date and time with timezone      | 8 bytes      | `updated_at TIMESTAMPTZ NOT NULL` |

- **`DATE`**: Used to store calender dates in the format `YYYY-MM-DD`, e.g., `2023-10-15`.

  - If we want to create a table with a `DATA` column, that takes current data as default value, we can use `CURRENT_DATE`:

    ```sql
    CREATE TABLE post (
        message_id SERIAL PRIMARY KEY,
        message VARCHAR(100) NOT NULL,
        recipient VARCHAR(100) NOT NULL,
        post_date DATE DEFAULT CURRENT_DATE
    );
    ```

  - Postgres also provides various functions to manipulate and format date values, such as `AGE()`, `DATE_PART()`, `TO_CHAR()` and `EXTRACT()`.

    - For example, to calculate the age based on a birth date:

      ```sql
      SELECT name, birth_date, AGE(CURRENT_DATE, birth_date) AS age
      FROM users;
      ```

    - Format date using `TO_CHAR()` function:

      ```sql
      SELECT TO_CHAR(birth_date, 'DD Mon YYYY') AS formatted_date -- Returns date in '15 Oct 2023' format
      FROM users;
      ```

    - Extract specific parts of a date:

      ```sql
      SELECT EXTRACT(YEAR FROM birth_date) AS birth_year, -- eg. 1990
             EXTRACT(MONTH FROM birth_date) AS birth_month, -- eg. 10
             EXTRACT(DAY FROM birth_date) AS birth_day -- eg. 15
      FROM users;
      ```

  - We can see the current date, timestamp, now using the following commands:

    ```sql
    SELECT CURRENT_DATE; -- Returns the current date
    SELECT CURRENT_TIMESTAMP; -- Returns the current date and time
    SELECT NOW(); -- Returns the current date and time

    SHOW timezone; -- Displays the current timezone setting
    SET timezone = 'UTC'; -- Sets the timezone to UTC
    ```

- **`TIME`**: Used to store time of day in the format `HH:MI:SS`, e.g., `14:30:00`.

  - To create a table with a `TIME` column that takes current time as default value, we can use `CURRENT_TIME`:

    ```sql
    CREATE TABLE meetings (
        meeting_id SERIAL PRIMARY KEY,
        meeting_topic VARCHAR(100) NOT NULL,
        meeting_time TIME DEFAULT CURRENT_TIME
    );
    ```

  - Postgres provides various functions to manipulate and format time values, such as `TO_CHAR()`, `DATE_PART()`, and `EXTRACT()`.

    - Format time using `TO_CHAR()` function:

      ```sql
      SELECT TO_CHAR(meeting_time, 'HH12:MI AM') AS formatted_time -- Returns time in '02:30 PM' format
      FROM meetings;
      ```

    - Extract specific parts of a time:

      ```sql
      SELECT EXTRACT(HOUR FROM meeting_time) AS meeting_hour, -- eg. 14
             EXTRACT(MINUTE FROM meeting_time) AS meeting_minute, -- eg. 30
             EXTRACT(SECOND FROM meeting_time) AS meeting_second -- eg. 0
      FROM meetings;
      ```

  - Using `SELECT LOCALTIME AT TIME ZONE 'UTC';` we can convert local time to UTC time.

- **`TIMESTAMP/TIMESTAMPZ`**: Used to store both date and time in the format `YYYY-MM-DD HH:MI:SS`, e.g., `2023-10-15 14:30:00`.

  - `TIMESTAMP` does not store timezone information, while `TIMESTAMPTZ` stores timezone information along with date and time.
  - We can use `TIMESTAMP` to easily convert between time zones.

    ```sql
    SELECT '2023-10-15 14:30:00'::TIMESTAMP AT TIME ZONE 'America/New_York' AS ny_time,
           '2023-10-15 14:30:00'::TIMESTAMP AT TIME ZONE 'UTC' AS utc_time;
    ```

  - To create a table with a `TIMESTAMP` column that takes current timestamp as default value, we can use `CURRENT_TIMESTAMP`:

    ```sql
    CREATE TABLE events (
        event_id SERIAL PRIMARY KEY,
        event_name VARCHAR(100) NOT NULL,
        event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

  - Let's create a table with `created_at` and `updated_at` columns with triggers to automatically set timestamps:

    ```sql
    CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    ```

## BYTEA Types

- PostgreSQL provides the `BYTEA` data type to store binary data, such as images, files, or any other binary content.
- Here is an example of how to create a table with a `BYTEA` data type in PostgreSQL:

  ```sql
  CREATE TABLE files (
      file_id SERIAL PRIMARY KEY,
      file_name VARCHAR(100) NOT NULL,
      file_data BYTEA NOT NULL -- BYTEA column to store binary data
  );

  INSERT INTO files (file_name, file_data) VALUES
  ('example_image.png', decode('89504E470D0A1A0A0000000D49484452...', 'hex')),
  ('document.pdf', decode('255044462D312E350D0A25E2E3CFD30...', 'hex'));
  ```
