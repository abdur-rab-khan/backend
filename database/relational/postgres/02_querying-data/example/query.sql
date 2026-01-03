-- Getting student and there hobbies where the name is "Alice"
SELECT
    s.student_id,
    CONCAT(s.first_name, ' ', s.last_name) AS full_name,
    s.age,
    h.hobbies
FROM
    students AS s
INNER JOIN
    hobbies AS h
ON
    s.student_id = h.student_id
WHERE
    s.first_name = 'Alice';

-- Getting student that participate on sem 1
SELECT
    s.student_id,
    CONCAT(s.first_name, ' ', s.last_name) AS full_name,
    r.semester
FROM
    students AS s
INNER JOIN
    user_result AS ur
ON
    s.student_id = ur.student_id
INNER JOIN
    result AS r
USING(result_id)
WHERE
    semester = 'Sem 1';

-- Getting students based on there semester
SELECT
    semester,
    json_agg(
    json_build_object(
        'student_id', s.student_id,
        'full_name', CONCAT(s.first_name, ' ', s.last_name),
        'marks', r.marks,
        'hobbies', h.hobbies
    )
) AS students
FROM
    students AS s
INNER JOIN
    user_result
USING(student_id)
INNER JOIN
    result AS r
USING(result_id)
INNER JOIN
    hobbies AS h
USING(student_id)
WHERE
    'Chess' = ANY(h.hobbies) OR 'Camping' = ANY(h.hobbies)
GROUP BY
    r.semester
ORDER BY
    r.semester