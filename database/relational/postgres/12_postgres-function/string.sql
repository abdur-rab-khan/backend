-- "CONCAT('stringA', ' stringB') -> 'stringA stringB'": It merges two string into single one.
SELECT
    CONCAT(first_name, ' ', last_name)
FROM
    students;


-- "INITCAP('hi there') --> Hi There": Only capitalize the first latter of the word
SELECT
    INITCAP('hi there');


-- "LENGTH('hi there')": Returns the length of the given sentence
-- "LOWER('HI THERE')": Convert it into lower case
-- "UPPER('hi there')": Convert it into upper case
-- "TRIM('hi there       ')": Trim whitespaces from sentence. 