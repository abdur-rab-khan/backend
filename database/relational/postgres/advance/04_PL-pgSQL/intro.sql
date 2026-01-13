/*
<======================> PL/pgSQL Introduction <======================>

🟡 PL/pgSQL (Procedural Language/PostgreSQL) is a powerful procedural language, that allows us to write complex functions to execute multiple SQL statements in a single call. It is designed to be similar to Oracle's PL/SQL language, making it easier for developers familiar with that language to transition to PostgreSQL.
PL/pgSQL syntax 
🟡 PL/pgSQL block show the structure of a PL/pgSQL function or procedure. It consists of the following sections:
    1. DECLARE: This section is used to declare variables, constants, and cursors that will be used in the function.
    2. BEGIN: This section contains the main body of the function, where SQL statements and control structures are written.
    3. EXCEPTION: This section is used to handle exceptions and errors that may occur during the execution of the function.
    4. END: This section marks the end of the PL/pgSQL block.

🟡 Syntax of PL/pgSQL
do
$$
[<<label>>] -- Optional label for the block helps in identifying nested blocks
DECLARE
    -- Variable declarations go here
BEGIN
    -- Main code logic goes here
EXCEPTION
    -- Exception handling code goes here
END [label]; -- Optional label to match the opening label
$$;

⭐ We have to know that, unlike other programming languages, in PL/pgSQL logic must be enclosed within the strings or dollar-quoted strings ($$ ... $$) when creating functions or procedures.

1. DECLARE: It is where we declare our variables.

    Example:
            DECLARE
                total_sales NUMERIC;
                total_customers INT = 0;
                total_orders INT := 0; -- Both '=' and ':=' are same for assignment 

2. BEGIN: It is where we write our main code logic, In PL/pgSQL, every executable code must be inside the BEGIN and END block.

    Example:
            BEGIN
                SELECT SUM(amount) INTO total_sales FROM sales;
                SELECT COUNT(DISTINCT customer_id) INTO total_customers FROM sales;
                SELECT COUNT(order_id) INTO total_orders FROM orders;
            END;

3. EXCEPTION: It is an optional section where we can handle errors that may occur during the execution of the function.

    Example:
            EXCEPTION
                WHEN division_by_zero THEN
                    RAISE NOTICE 'Division by zero error occurred';
                WHEN others THEN
                    RAISE NOTICE 'An unexpected error occurred: %', SQLERRM;

4. END: It marks the end of the PL/pgSQL block.
    Example:
            END;


===> DOLLAR-QUOTED STRINGS ($$ ... $$) AND '' (SINGLE QUOTES)

🟡 In PL/pgSQL, we often use dollar-quoted strings ($tag]$...$[tag]$) to define the body of functions or procedures. This allows us to include single quotes (') within the code without needing to escape them.
🟡 Tag can be any sequence of characters (including an empty string) that helps to identify the start and end of the dollar-quoted string.

🟡 Syntax of PL/pgSQL without $$...$$

CREATE OR REPLACE FUNCTION function_name(parameters)
RETURNS return_type AS '
DECLARE
    -- Variable declarations go here
    count INT := 0;
BEGIN
    -- Main code logic goes here
    SELECT COUNT(*) INTO count FROM table_name;
    
    raise notice ''Total count: %'', count;    
END;

- Note that in this case, we have to escape single quotes by doubling them ('').

🟡 Syntax of PL/pgSQL with $[tag]$....$[tag]$


CREATE OR REPLACE FUNCTION function_name(parameters)
RETURNS return_type AS $func$
DECLARE
    -- Variable declarations go here
    count INT := 0;
BEGIN
    -- Main code logic goes here
    SELECT COUNT(*) INTO count FROM table_name;
    
    raise notice 'Total count: %', count;    
END;
$func$ LANGUAGE plpgsql;

- Using dollar-quoted strings ($func$...$func$) allows us to include single quotes (') directly without escaping them.
⭐ "INTO variable_name" is used to store the result of a SQL query into a PL/pgSQL variable.
⭐ "DO" statement does not belongs to any function or procedure, it is used to execute an anonymous code block of PL/pgSQL, anonymous code block means it does not have a name like functions or procedures.



===> NESTED BLOCKS IN PL/pgSQL 

🟡 PL/pgSQL allows us to create nested blocks within a main block. This is useful for organizing code and managing variable scope.
🟡 Each nested block can have its own DECLARE, BEGIN, EXCEPTION, and END sections.

🟡 Example:
    DO
    $$
    DECLARE
        outer_var INT := 10;
    BEGIN
        RAISE NOTICE 'Outer variable: %', outer_var;
        
        -- Nested block
        DECLARE
            inner_var INT := 20;
        BEGIN
            RAISE NOTICE 'Inner variable: %', inner_var;
            RAISE NOTICE 'Accessing outer variable from inner block: %', outer_var;
        END;
    END;
    $$;

🟡 Example using labels for nested blocks:
    DO
    $$
    <<outer_block>>
    DECLARE
        outer_var INT := 10;
    BEGIN
        RAISE NOTICE 'Outer variable: %', outer_var;
        
        -- Nested block with label
        <<inner_block>>
        DECLARE
            inner_var INT := 20;
        BEGIN
            RAISE NOTICE 'Inner variable: %', inner_var;
            RAISE NOTICE 'Accessing outer variable from inner block: %', outer_var;
        END inner_block;
    END outer_block;
    $$;
*/

-- Example: Count the total film in the film table
DO
$$
<<main_block>>
DECLARE
    film_count INT;
BEGIN
    SELECT
        COUNT(*) INTO film_count
    FROM
        film;
    
    RAISE NOTICE 'Total films count are: %', film_count;
END main_block;
$$;

-- Example: Nested PL/pgSQL
DO
$$
<<main_block>>
DECLARE
    x INT = 0;
BEGIN
    RAISE NOTICE 'The value of x is %', x;

    x = x + 2;

    <<inner_block>>
    DECLARE
        y INT = 0;
    BEGIN
        y = y + 5;
        RAISE NOTICE 'The value of y is %', y;
        RAISE NOTICE 'The value of x in inner block is %', x;
    END inner_block;
END main_block
$$