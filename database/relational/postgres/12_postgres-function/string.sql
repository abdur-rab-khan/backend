-- "CONCAT('stringA', ' stringB') -> 'stringA stringB'": It merges two string into single one.
SELECT
    CONCAT(first_name, ' ', last_name)
FROM
    students;


-- "INITCAP('hi there') --> Hi There": Only capitalize the first latter of the word
SELECT
    INITCAP('hi there');


-- "SPLIT_PART('a-b-c-d', '-', 3) -> 'c'": It splits the string by given delimiter and returns the part based on given index.
SELECT
    SPLIT_PART('a-b-c-d', '-', 3); -- It's similar to .split() in other programming languages.

-- "LENGTH('hi there')": Returns the length of the given sentence
-- "LOWER('HI THERE')": Convert it into lower case
-- "UPPER('hi there')": Convert it into upper case
-- "TRIM('hi there       ')": Trim whitespaces from sentence. 