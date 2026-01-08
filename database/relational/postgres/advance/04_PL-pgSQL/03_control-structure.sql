/*
    <=====================> CONTROL STRUCTURE IN PL/pgSQL <=====================>

🟡 In PL/pgSQL, control structures are used to manage the flow of execution within a block of code. They include conditional statements, loops, and exception handling mechanisms.

1. =================> IF ELSIF ELSE STATEMENT

🟡 The "IF ELSIF ELSE" statement in PL/pgSQL is used to execute different blocks of code based on certain conditions. It allows for conditional branching in the code.
🟡 If similar to other programming languages, only difference is the syntax.

🔵 Syntax:

    IF condition1 THEN
        -- code block to be executed if condition1 is true
    ELSIF condition2 THEN
        -- code block to be executed if condition2 is true
    ELSE
        -- code block to be executed if none of the above conditions are true
    END IF;
*/

-- 🔵 Example: To check if a film exists based on film_id
DO $$
DECLARE
	selected_film film%rowtype;
	input_film_id film.film_id%type = 100;
BEGIN
	SELECT *
	FROM
		film
	INTO 
		selected_film
	WHERE
		film_id = input_film_id;

	IF NOT FOUND THEN
		RAISE NOTICE 'The film % could not be found', input_film_id;
	ELSE
		RAISE NOTICE 'The film title is %', selected_film.title;
	END IF;
END;
$$;

-- 🔵 Example: To categorize film length
DO $$
DECLARE
	v_film film%rowtype;
	len_description VARCHAR(255);
BEGIN
	SELECT *
	FROM
		film
	INTO v_film
	WHERE
		film_id = 10;

	IF NOT FOUND THEN
		RAISE NOTICE 'Film not found';
	ELSE
		IF v_film.length > 0 AND v_film.length <= 50 THEN
			len_description := 'Sort';
		ELSIF v_film.length > 50 AND v_film.length < 120 THEN
			len_description := 'Medium';
		ELSIF v_film.length > 120 THEN
			len_description := 'Long';
	END IF;

	RAISE NOTICE 'The % film is %.',
		v_film.title,
		len_description;
	END IF;
END;
$$;

-- 🔵 Example: Nested Block with IF condition, to find a film with length greater than a specified value 
DO $$
<<outer_block>>
DECLARE
	find_length INT = 120;
	selected_film_id film.film_id%type;
	selected_film_title film.title%type;
BEGIN
	<<inner_block>>
	BEGIN
		SELECT
			film_id
		FROM
			film
		INTO selected_film_id
		WHERE
			length > find_length
		LIMIT
			1;

		IF NOT FOUND THEN
			RAISE 'There is no film greater then % length', find_length;
		END IF;
	END inner_block;

	SELECT
		title
	FROM
		film
	INTO selected_film_title
	WHERE
		film_id = selected_film_id;

	RAISE NOTICE 'Film % length is greater then %', selected_film_title, find_length;
END outer_block;
$$;

/*
2. =================> CASE STATEMENT

🟡 In PL/pgSQL, the "CASE" statement is used to execute one block of code from multiple options based on the value of an expression. It provides a way to perform conditional branching similar to the "IF ELSIF ELSE" statement but is often more concise when dealing with multiple discrete values.

🔵 Syntax:

    CASE expression
        WHEN value1 THEN
            -- code block to be executed if expression equals value1
        WHEN value2 THEN
            -- code block to be executed if expression equals value2
        ELSE
            -- code block to be executed if expression does not match any of the above values
    END CASE;
*/

-- 🔵 Example: To categorize film rental rate
DO $$
DECLARE
	rate film.rental_rate%type;
	price_segment VARCHAR(50);
BEGIN
	SELECT
		rental_rate
	INTO
		rate
	FROM
		film
	WHERE
		film_id = 100;

	IF FOUND THEN
		CASE rate
			WHEN 0.99 THEN
				price_segment = 'Mass';
			WHEN 2.99 THEN
				price_segment = 'Mainstream';
			WHEN 4.99 THEN
				price_segment = 'High End';
			ELSE
				price_segment = 'Unspecified';
			END CASE;

		 RAISE NOTICE '%', price_segment;
	ELSE
		RAISE NOTICE 'Film not found';
	END IF;
END;
$$;


-- 🔵 Example: To determine customer service level based on total payment
DO $$
DECLARE
	cus_id customer.customer_id%type = 8;
	total_payment INT;
	customer_name VARCHAR(255);
	service_level VARCHAR(255);
BEGIN
	SELECT
		c.first_name || ' ' || c.last_name AS full_name,
		SUM(amount) AS total_sum
	FROM
		customer c
	INTO
		customer_name, total_payment
	INNER JOIN	
		payment
	USING(customer_id)
	WHERE
		customer_id = cus_id
	GROUP BY
		c.customer_id;

	IF NOT FOUND THEN
		RAISE 'Customer not found';
	ELSE
		CASE 
			WHEN total_payment > 200 THEN
				service_level = 'Platinum';
			WHEN total_payment > 100 THEN 
				service_level = 'Gold';
			ELSE
				service_level = 'Silver';
			END CASE;
	
		RAISE NOTICE 'Customer name is %, and service level is %',
		customer_name,
		service_level;
	END IF;
END;
$$;


/*
  <=====================> LOOP STRUCTURES IN PL/pgSQL <=====================>

🟡 In PL/pgSQL, loop structures are used to execute a block of code repeatedly based on certain conditions. The main types of loops available in PL/pgSQL are:
    1. Basic LOOP
    2. WHILE LOOP
    3. FOR LOOP

🔵 Syntax for LOOP

1️⃣. Basic LOOP

    LOOP
        -- code block to be executed repeatedly
        EXIT WHEN condition;  -- condition to exit the loop
    END LOOP;

2️⃣. WHILE LOOP
    WHILE condition LOOP
        -- code block to be executed while the condition is true
    END LOOP;

3️⃣. FOR LOOP
    FOR counter_variable IN [REVERSE] start_value..end_value LOOP
        -- code block to be executed for each value of the counter_variable
    END LOOP;

🟡 PL/pgSQL have expression like EXIT and CONTINUE to control the flow of loops.

1️⃣. EXIT: Used to terminate the loop when a specific condition is met.
2️⃣. CONTINUE: Used to skip the current iteration of the loop and proceed to the next iteration.

🟡 These expressions used with a condition to control the flow of the loop effectively.
⭐ But PL/pgSQL supports LABELS to identify loops, especially when dealing with nested loops. Labels help in specifying which loop to exit or continue.

🔵 Example: Basic LOOP with EXIT

DO
$$
DECLARE
    counter INT := 1;
BEGIN
    LOOP
        RAISE NOTICE 'Counter value: %', counter;
        counter := counter + 1;
        EXIT [label] WHEN counter > 5;  -- Exit the loop when counter exceeds 5
    END LOOP;
*/


-- 🟡 Example of Basic LOOP with EXIT
DO $$
DECLARE
	counter int := 0;
BEGIN
	LOOP
		counter = counter + 1;
		RAISE NOTICE 'Current count is %', counter;

		IF counter = 10 THEN
			exit;
		END IF;

	END LOOP;
END;
$$;

-- 🟡 Example of Nested LOOP with LABELS
DO $$
DECLARE
	row_num INT = 0;
	col_num INT = 0;
BEGIN
	<<outer_loop>>
	LOOP
		row_num = row_num + 1;
		col_num = 0;
		<<inner_loop>>
		LOOP
			col_num = col_num + 1;
			RAISE NOTICE '(%, %)', row_num, col_num;
			EXIT inner_loop WHEN col_num = 3;
		END LOOP;
		EXIT outer_loop WHEN row_num = 3;
	END LOOP;
END;
$$;

/*
    <====================> FOR LOOP IN PL/pgSQL <====================>

🟡 In PL/pgSQL, the "FOR" loop is used to iterate over a range of values or through the results of a query. It allows you to execute a block of code multiple times, with a counter variable that takes on different values in each iteration.
🔵 Syntax:

    FOR counter_variable IN [REVERSE] start_value..end_value LOOP
        -- code block to be executed for each value of the counter_variable
    END LOOP;

🟡 We can iterate over the query result using FOR LOOP as well.

    FOR record_variable IN query LOOP
        -- code block to be executed for each row returned by the query
    END LOOP;

⭐ Using for loop we can iterate over dynamic query result as well using EXECUTE statement.

    FOR record_variable IN EXECUTE dynamic_query USING [parameters] LOOP
        -- code block to be executed for each row returned by the dynamic query
    END LOOP; 
*/

🔴 -- Example of FOR LOOP iterating over dynamic query result
DO $$
DECLARE
    v_category_name category.name%type;
BEGIN
    FOR v_category_name IN
        EXECUTE 'SELECT name FROM category WHERE category_id < $1' USING 5
    LOOP
        RAISE NOTICE 'Category Name: %', v_category_name;
    END LOOP;
END;
$$;

-- "$": It is used as a placeholder for parameters in the dynamic query. In this case, $1 represents the first parameter that will be passed to the query.


-- 🔵 Example of FOR LOOP to get top 10 longest films
DO $$
DECLARE
	f RECORD;
BEGIN
	FOR f IN SELECT title, length
			FROM	
				film
			ORDER BY
				length DESC
			LIMIT
				10
		LOOP
			RAISE NOTICE '% - (% mins)', f.title, f.length;
		END LOOP;
END;
$$;

-- 🔵 Example of FOR LOOP with dynamic query and conditional sorting
DO $$
DECLARE
	-- sort by 1: title, 2: release year
	sort_type SMALLINT := 1;

	-- return the number of films
	rec_count INT := 10;

	-- use to iterate over the film
	rec RECORD;

	-- dynamic query
	query TEXT;
BEGIN
	query := 'SELECT title, release_year FROM film';

	if sort_type = 1 THEN
		query = query || ' ORDER BY title';
	ELSIF sort_type = 2 THEN
		query = query || ' ORDER BY release_year';
	ELSE
		RAISE 'Invalid sort type %s', sort_type;
	END IF;

	query := query || ' limit $1';

	FOR rec in EXECUTE query USING rec_count
		LOOP
			RAISE NOTICE '% - %', rec.release_year, rec.title;
		END LOOP;
END;
$$;


-- 🔵 Example of FOR LOOP with dynamic query and USING clause
DO $$
DECLARE
	rec RECORD;
BEGIN
	FOR rec IN
		EXECUTE 'SELECT title, film_id FROM film WHERE film_id > $1 LIMIT $2' USING 100, 10
		LOOP
			RAISE NOTICE 'Id: %, Film title: %', rec.film_id, rec.title;
		END LOOP;
END;
$$;