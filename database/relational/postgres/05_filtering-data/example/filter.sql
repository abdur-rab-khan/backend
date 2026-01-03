-- Making json object of student details for student that age lies between 21 to 50
SELECT
    json_build_object(
        'student_id', student_id,
        'full_name', CONCAT(first_name, ' ', last_name),
        'age', age,
        'year', EXTRACT(YEAR FROM enrollment_date)
    ) AS details
FROM
    students
WHERE
    age BETWEEN 21 AND 50 