/*
    <======================> REPORT MESSAGE AND ERRORS <======================>

1. ================> RAISE ERROR AND REPORT MESSAGE

🟡 In PL/pgSQL, we can use the "RAISE" statement to report messages and raise errors, "RAISE" in PL/pgSQL has several levels:
    1. DEBUG: Used for debugging messages.
    2. LOG: Used for logging messages.
    3. NOTICE: Used for informational messages.
    4. WARNING: Used for warning messages.
    5. EXCEPTION --> DEFAULT: Used to raise an error and terminate the execution of the function.

🟡 Syntax:
    
    RAISE level 'message' [, expression [, ... ] ];

🔵 Examples

-- Example of RAISE NOTICE WITH EXPRESSION
DO
$$
BEGIN
    RAISE NOTICE 'The current date is: %', CURRENT_DATE;
END;

⭐ If we can't specify any level, it will be treated as EXCEPTION by default. that means it will raise an error and terminate the execution.

⭐⭐⭐ At the EXCEPTION level, we can also specify the options there are:
    1. USING HINT = 'hint message'
    2. USING DETAIL = 'detail message'
    3. USING ERRCODE = 'sqlstate code' 

-- Example of RAISE EXCEPTION WITH OPTIONS
DO
$$
BEGIN
    RAISE EXCEPTION 'This is a custom error message.'
        USING HINT = 'Check the input values.',
              DETAIL = 'The input value exceeded the allowed range.',
              ERRCODE = '22003';  -- Numeric value out of range
END;
*/

-- Example of RAISE EXCEPTION (DEFAULT)
DO
$$
BEGIN
    RAISE 'This is a custom error message.';
END;
$$;

-- Example of RAISE ALL LEVELS
DO
$$
BEGIN
    RAISE DEBUG 'This is a debug message.';
    RAISE LOG 'This is a log message.';
    RAISE NOTICE 'This is an informational message.';
    RAISE WARNING 'This is a warning message.';
    RAISE EXCEPTION 'This is an error message.';
END;


/*
2. =================> ASSERT STATEMENT

🟡 The "ASSERT" statement in PL/pgSQL is used to check a condition and raise an error if the condition is not met. It is primarily used for debugging and validating assumptions in the code.

🟡 Syntax:

    ASSERT condition [, 'message' ];

🔵 Example:

-- Example of ASSERT STATEMENT
DO
$$
BEGIN
    ASSERT 1 + 1 = 2, 'Math is broken!';  -- This will pass without error
    ASSERT 1 + 1 = 3, 'Math is still broken!';  -- This will raise an error
END;
*/


-- Example of ASSERT STATEMENT, error if film count is not greater than 1000
DO
$$
DECLARE
    film_count INT;
BEGIN
    SELECT COUNT(*) INTO film_count FROM film;
    ASSERT film_count > 1000, 'Film count is not greater than 1000!';
END;