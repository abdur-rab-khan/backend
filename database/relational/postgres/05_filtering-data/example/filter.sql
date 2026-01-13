-- Making json object of student details for student that age lies between 21 to 50
SELECT
    student_id,
    json_build_object(
        'full_name', CONCAT(first_name, ' ', last_name),
        'age', age,
        'year', EXTRACT(YEAR FROM enrollment_date)
    ) AS details
FROM
    students
WHERE
    age BETWEEN 21 AND 50 
ORDER BY
    student_id;

-- Making json object of student details for student that age lies between 21 to 50
SELECT
    age,
    json_agg(
        json_build_object(
            'full_name', CONCAT(first_name, ' ', last_name),
            'age', age,
            'enrollment_year', EXTRACT(YEAR FROM enrollment_date),
            'address', address
        )
    )
FROM
    students
WHERE
    age BETWEEN 21 AND 50
GROUP BY
    age
ORDER BY
    age;


-- Only fetching 10 student in a json that age lies between 20 to 50
SELECT
    student_id,
    first_name,
    last_name,
    age,
    marks
FROM
    students
INNER JOIN
    user_result
USING(student_id)
INNER JOIN
    result
USING(result_id)
WHERE
    age BETWEEN 20 AND 50 
ORDER BY
    age
LIMIT
    10
OFFSET
    5;