-- Counting the number of student in a same age group with their names
SELECT
    age,
    COUNT(student_id),
    array_agg(
        first_name || ' ' || last_name
    ) AS student_names
FROM
    students
GROUP BY
    age
ORDER BY
    age;


-- Grouping all students based on their age and sem with all student details
SELECT
    CASE semester
        WHEN 'Sem 1' THEN 'SEMESTER 1'
        WHEN 'Sem 2' THEN 'SEMESTER 2'
    END AS semester,
    age,
    COUNT(*) total_counts,
    json_agg(
        json_build_object(
            'student_id', student_id,
            'full_name', first_name || ' ' || last_name
        )
    ) AS student_details
FROM
    students
INNER JOIN
    user_result
USING(student_id)
INNER JOIN 
    result
USING(result_id)
GROUP BY
    age,
    semester
ORDER BY
    semester;

-- Grouping counts of film based on their rating
SELECT
    rating,
    COUNT(film_id) total_films
FROM
    film
GROUP BY
    rating