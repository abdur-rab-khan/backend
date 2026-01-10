/*
  <==========================> PL/pgSQL Functions <==========================>

🟡 In PostgresSQL, we can convert anonymous code blocks into reusable functions using PL/pgSQL, the procedural language for PostgreSQL. Functions allow us to encapsulate logic, accept parameters, and return values.
🟡 Functions have following structure:
    1. HEADER: This section defines the function's name, parameters, return type, and language.
    2. BODY: This section contains the actual code that will be executed when the function is called.
🟡 Similar to functions in programming languages, it also supports function overloading, allowing multiple functions with the same name but different parameter lists.

🔴 DROP FUNCTION
    DROP FUNCTION [IF EXISTS] function_name(parameter1_data_type, parameter2_data_type, ...); -- As we know that functions can be overloaded, we need to specify the parameter to identify the exact function to drop.


🔵 Syntax of a function

CREATE [OR REPLACE] FUNCTION function_name(parameter1 data_type, parameter2 data_type, ...)
    RETURNS return_data_type
    LANGUAGE plpgsql
AS $$
DECLARE
    -- Variable declarations (if any)
BEGIN
    -- Function logic goes here
END;
$$;

🟡 Postgres function supports three types of parameters:
    1. IN: Default parameter type, used to pass values into the function.
    2. OUT: Used to return multiple values from the function, acting like output parameters. We don't need to use RETURN statement for OUT parameters.
    3. INOUT: Combines the features of IN and OUT parameters, allowing values to be passed in and modified within the function.

🔵 Example: Creating a simple function to add two numbers
CREATE OR REPLACE FUNCTION add_numbers(a INT, b INT)
    RETURNS INT
    LANGUAGE plpgsql
AS $$
BEGIN
    RETURN a + b;
END;
$$;

🟡 Postgres function supports many ways to return values:
    1. RETURNS [data_type]: Returns a single value of the specified data type.
    2. RETURNS TABLE(column1 data_type, column2 data_type, ...): Returns a set of rows with specified columns.
    3. RETURNS SETOF data_type: Returns a set of values of the specified data type.
    4. RETURNS VOID: Indicates that the function does not return a value.

Postgres also provides different ways to return values from functions:
    1. RETURN: Used to return a single value from the function.
    2. RETURN NEXT: It add row to the result set of a set-returning function. 
    3. RETURN QUERY: Used to return the result of a query directly from the function.

1. -- Example: Function with OUT parameters
CREATE OR REPLACE FUNCTION get_full_name(first_name TEXT, last_name TEXT, OUT full_name TEXT)
    LANGUAGE plpgsql
AS $$
BEGIN
    full_name := first_name || ' ' || last_name;
END;

2. -- Example: Set-returning function using RETURN NEXT
CREATE OR REPLACE FUNCTION generate_series_example(start INT, finish INT)
    RETURNS SETOF INT
    LANGUAGE plpgsql
AS $$
DECLARE
    i INT := start;
BEGIN
    WHILE i <= finish LOOP
        RETURN NEXT i;
        i := i + 1;
    END LOOP;
END;
$$;
*/

🔵 -- Example: Function using RETURNS QUERY to return the title of a film based on its ID
CREATE OR REPLACE FUNCTION get_film_title(film_id INT)
    RETURNS film.title%TYPE
    LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (SELECT title FROM film WHERE id = film_id);
END;
$$;

-- Example Let's SELECT title, description, length BASED on some operation using LOOP.
CREATE OR REPLACE FUNCTION get_film()
	RETURNS TABLE (
		title film.title%type,
		description film.description%type,
		length film.length%type
	)
	LANGUAGE plpgsql
AS $$
	BEGIN
		FOR title, description, length IN (
			SELECT
				f.title,
				f.description,
				f.length
			FROM film f
		)
			LOOP
				IF length > 180 THEN
					RETURN NEXT;
				END IF;
			END LOOP;
	END;
$$;

-- Example: Function using Return VOID to insert a new record based on film data.
CREATE OR REPLACE FUNCTION insert_film(f_length SMALLINT)
	RETURNS VOID
	LANGUAGE plpgsql
	AS $$
DECLARE
	rec RECORD;
BEGIN
	SELECT *
	FROM film
	INTO rec
	WHERE length > f_length
	LIMIT 1;

	IF NOT FOUND THEN
		RAISE 'film not found';
	ELSE 
		INSERT INTO x_table(film_id, name, description, length)
			VALUES(
				rec.film_id,
				rec.title,
				rec.description,
				rec.length
			);
		RAISE NOTICE 'Film % successfully added', rec.title;
	END IF;
END;
$$;

SELECT * FROM insert_film(90::SMALLINT);

/*
    <========================> PL/pgSQL Procedures <========================>

🟡 Procedures are similar to functions, functions in PL/pgSQL does not support transaction control commands like COMMIT and ROLLBACK. Procedures are designed to handle such operations.
🟡 Procedures does not return a value directly like functions, but they can use OUT parameters to return multiple values.
🟡 Procedures are invoked using the CALL statement.

🔵 Syntax of a procedure
    CREATE [OR REPLACE] PROCEDURE procedure_name(parameter1 data_type, parameter2 data_type, ...)
        LANGUAGE plpgsql
    AS $$
    DECLARE
        -- Variable declarations (if any)
    BEGIN
        -- Procedure logic goes here
    END;
    $$;

🔴 DROP PROCEDURES

    DROP PROCEDURE [IF EXISTS] procedure_name(parameter1_data_type, parameter2_data_type, ...); -- As we know that procedures can be overloaded, we need to specify the parameter to identify the exact procedure to drop.
*/

-- Example: Creating a transfer procedure to transfer amount between two accounts
-- Assuming we have an accounts table with id and balance columns
CREATE OR REPLACE PROCEDURE transfer(
	sender INT,
	receiver INT,
	amount DEC
)
LANGUAGE plpgsql
AS $$
DECLARE
	having_amount DEC;
BEGIN 
	SELECT balance
	INTO having_amount
	FROM accounts
	WHERE id = sender
	FOR UPDATE;

	IF NOT FOUND THEN
		RAISE 'There is not user with this % id', sender;
	END IF;

	-- Check balance
	IF having_amount < amount THEN
		RAISE 'Insufficient balance';
	END IF;

	-- Check receiver exists and lock row
	PERFORM 1
	FROM accounts
	WHERE id = receiver
	FOR UPDATE;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'Receiver with id % does not exist', receiver;
	END IF;
	
	-- Deduct from sender
	UPDATE accounts
	SET balance = balance - amount
	WHERE id = sender;

	-- Add to receiver
	UPDATE accounts
	SET balance = balance + amount
	WHERE id = receiver;
EXCEPTION
	WHEN OTHERS THEN
		RAISE NOTICE 'Error occurred: %', SQLERRM;
		RAISE;
END;
$$;


CALL transfer(1, 2, 10);

SELECT * FROM accounts;