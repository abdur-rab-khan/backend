# Cast in PostgreSQL

> In PostgreSQL, casting is the process of **`converting a value from one data type to another`**. This can be useful when you need to perform operations that require specific data types or when you want to ensure that data is in the correct format.

- [Cast in PostgreSQL](#cast-in-postgresql)
  - [Syntax for Casting](#syntax-for-casting)
  - [Examples of Casting](#examples-of-casting)
    - [1. Converting String to Integer](#1-converting-string-to-integer)
    - [2. Converting Integer to String](#2-converting-integer-to-string)
    - [3. Converting String to Date](#3-converting-string-to-date)
    - [4. Converting String to Boolean](#4-converting-string-to-boolean)
    - [5. Converting Numeric to Float](#5-converting-numeric-to-float)
    - [6. Converting String to Array](#6-converting-string-to-array)
    - [7. Using CAST During Querying](#7-using-cast-during-querying)

## Syntax for Casting

- There are two primary ways to cast data types in PostgreSQL:

  1. Using the `CAST` operator, `CASE(expression AS target_data_type)`.
  2. Using the `::` operator, `expression::target_data_type`.

- If you try to cast a value that is not compatible with the target data type, PostgreSQL will raise an error.

## Examples of Casting

### 1. Converting String to Integer

```sql
SELECT '123'::INTEGER AS int_value,
       CAST('456' AS INTEGER) AS another_int_value;
```

### 2. Converting Integer to String

```sql
SELECT 789::TEXT AS str_value,
       CAST(101112 AS TEXT) AS another_str_value;
```

### 3. Converting String to Date

```sql
SELECT '2024-01-01'::DATE AS date_value,
       CAST('2024-12-31' AS DATE) AS another_date_value;
```

### 4. Converting String to Boolean

```sql
SELECT 'true'::BOOLEAN AS bool_value,
       CAST('false' AS BOOLEAN) AS another_bool_value;
```

### 5. Converting Numeric to Float

```sql
SELECT 100::FLOAT AS float_value,
       CAST(200 AS FLOAT) AS another_float_value;
```

- If a match is found, the corresponding result is returned.

### 6. Converting String to Array

```sql
SELECT '{1,2,3}'::INT[] AS int_array,
       CAST('a,b,c' AS TEXT[]) AS text_array;
```

### 7. Using CAST During Querying

```sql
SELECT employee_id,
         salary::NUMERIC(10, 2) AS precise_salary,
         CAST(hire_date AS TIMESTAMP) AS hire_timestamp
FROM employees;
```
