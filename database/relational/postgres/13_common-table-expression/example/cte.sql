WITH sem1_students AS (
    SELECT 
        student_id,
        first_name ||  ' ' || last_name AS full_name,
        age,
        semester,
        json_array(
            json_array('Maths', marks->>'Maths'),
            json_array('English', marks->>'English'),
            json_array('History', marks->>'History'),
            json_array('Science', marks->>'Science')
        )
    FROM
        students
    INNER JOIN
        user_result
    USING(student_id)
    INNER JOIN
        result
    USING(result_id)
    WHERE
        semester = 'Sem 1'
    ORDER BY
        age
)


-- Getting all sem1 students
SELECT * FROM sem1_students;