/*
    <====================> EXCEPTION HANDLING IN PL/pgSQL <====================>

🟡 In PL/pgSQL, exception handling is done using the EXCEPTION block within a BEGIN...END block, when any exception occurs during the execution of the code inside the BEGIN block, control is transferred to the EXCEPTION block where specific actions can be taken based on the type of exception.
🟡 Inside the EXCEPTION block, we can define handlers for specific exceptions using WHEN clauses, there are also predefined exceptions like NO_DATA_FOUND, TOO_MANY_ROWS, etc. See the list of predefined exceptions "https://www.postgresql.org/docs/current/errcodes-appendix.html"
🔵 Syntax for exception

    BEGIN
        -- PL/pgSQL code that may raise exceptions
    EXCEPTION
        WHEN exception_name1 THEN
            -- Handle exception_name1
        WHEN exception_name2 THEN
            -- Handle exception_name2
        WHEN OTHERS THEN
            -- Handle all other exceptions
    END;
*/


-- Example: Exception handling in a PL/pgSQL function
DO $$
DECLARE
    result INTEGER;
BEGIN
    -- Attempt to divide by zero to raise an exception
    result := 10 / 0;
    RAISE NOTICE 'Result: %', result;
EXCEPTION
    WHEN division_by_zero THEN
        RAISE NOTICE 'Error: Division by zero is not allowed.';
    WHEN OTHERS THEN
        RAISE NOTICE 'An unexpected error occurred: %', SQLERRM;
END;
$$;


-- Example: Handling NO_DATA_FOUND exception
DO $$
DECLARE
    film_id INTEGER := 9999; -- Assuming this ID does not exist
    film_title VARCHAR;
BEGIN
    SELECT title INTO film_title FROM film WHERE film_id = film_id;
    RAISE NOTICE 'Film Title: %', film_title;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE NOTICE 'Error: No film found with ID %', film_id;
    WHEN OTHERS THEN
        RAISE NOTICE 'An unexpected error occurred: %', SQLERRM;
END;


-- Example: Handling Custom Exception
DO $$
DECLARE
    age INTEGER := -5; -- Invalid age
BEGIN
    IF age < 0 THEN
        RAISE EXCEPTION 'Invalid age: %', age;
    END IF;
    RAISE NOTICE 'Age: %', age;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM;
END;
$$;


-- Example: Handling using ERRCODE
DO $$
DECLARE
    value INTEGER := 300;
BEGIN
    IF value > 255 THEN
        RAISE EXCEPTION 'Value % exceeds the maximum allowed limit of 255.', value
            USING ERRCODE = '22003'; -- Numeric value out of range
    END IF;
    RAISE NOTICE 'Value: %', value;
EXCEPTION
    WHEN SQLSTATE '22003' THEN
        RAISE NOTICE 'Error: Numeric value out of range - %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'An unexpected error occurred: %', SQLERRM;