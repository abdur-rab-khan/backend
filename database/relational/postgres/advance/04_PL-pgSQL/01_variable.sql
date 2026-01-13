/*
    <====================> VARIABLES IN PL/pgSQL <====================>

🟡 In PL/pgSQL, variables are used to store data temporarily during the execution of a function or a block of code, they can hold different types of data such as integers, text, dates, etc. Variables must be declared before they are used.
🟡 Syntax for declaring a variable in PL/pgSQL:

    DECLARE
        variable_name data_type [ := initial_value | = initial_value ];

🟡 In PL/pgSQL, we can refer the type of a column in a table using the "%type" attribute, this allows us to create a variable that has the same data type as a specific column in a table.
🟡 As we know that, we can use nested blocks in PL/pgSQL, each block can have its own set of variable declarations, and the scope of a variable is limited to the block in which it is declared.
🟡 If a variable is declared in an outer block, and same variable name is declared in an inner block, the inner block's variable will shadow the outer block's variable within the inner block.

⭐ We can also create 'CONSTANT' variables in PL/pgSQL using the 'CONSTANT' keyword, these variables cannot be modified after their initial assignment.

    DECLARE
        constant_variable_name data_type CONSTANT := initial_value;
*/

-- Example of variable declaration and usage in PL/pgSQL
DO
$$
DECLARE
    first_name VARCHAR(255);
BEGIN
    first_name = SPLIT_PART('John Doe', ' ', 1);
    RAISE NOTICE 'The first name is %', first_name;
END;
$$;

-- Example of a variable referring type from table
DO
$$
DECLARE
    film_title film.title%type;
    film_description film.description%type;
BEGIN
    SELECT
        title,
        description
    FROM
        film
    INTO
        film_title,
        film_description
    WHERE
        film_id = 100;

    RAISE NOTICE 'Film title of id 100 is % and description is %',
        film_title,
        film_description;
END;
$$;

/*
    <=====================> SELECT INTO STATEMENT <=====================>

🟡 In PL/pgSQL, the SELECT INTO statement is used to select data from a table and store it into variables. This is particularly useful when you want to retrieve a single row of data and assign its values to variables for further processing.
🟡 Syntax for SELECT INTO statement in PL/pgSQL:

    SELECT column1, column2, ...
    INTO variable1, variable2, ...
    FROM table_name
    WHERE condition;

🟡 The number of columns selected must match the number of variables specified in the INTO clause.
*/

-- Example of SELECT INTO statement in PL/pgSQL
DO
$$
DECLARE
	film_title film.title%type;
	film_description film.description%type;
	film_details JSONB;
BEGIN
	SELECT
		title,
		description,
		jsonb_build_object(
			'title', title,
			'description', description,
			'length', length,
			'rating', rating
		) AS film_details
	INTO
		film_title,
		film_description,
		film_details
	FROM
		film
	WHERE
		film_id = 100;

	RAISE NOTICE 'Film title is %, description is % and details is %',
		film_title,
		film_description,
		film_details;
END;
$$;


/*
    <=====================> RECORD TYPE VARIABLE <=====================>

🟡 In PL/pgSQL, a record type variable is similar to "%rowtype" but it is more flexible as it can hold a row of data from any table or a result set of a query, rather than being tied to a specific table structure.
🟡 Suppose we want to assign all columns of a table to a variable, without explicitly defining each column, we can use a record type variable.
🟡 Syntax for declaring a record type variable in PL/pgSQL:

    DECLARE
        record_variable RECORD;
    BEGIN
        SELECT * INTO record_variable FROM table_name WHERE condition;
    END;

🟡 After executing the SELECT INTO statement, the record variable will hold all the columns of the selected row, and we can access individual columns using dot notation (e.g., record_variable.column_name).
*/

-- Example of RECORD type variable in PL/pgSQL, assigning certain columns of a table to a variable 
DO
$$
DECLARE
	rec RECORD;
BEGIN
	SELECT film_id, title, length
	INTO rec
	FROM
		film
	WHERE
		film_id = 200;

	RAISE NOTICE '% % %', rec.film_id, rec.title, rec.length;
END;
$$;