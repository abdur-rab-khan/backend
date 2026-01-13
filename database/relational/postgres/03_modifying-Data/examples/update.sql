-- Increasing AGE of student which has 'Chess' IN hobbies
UPDATE students
    SET age = age + 1
    FROM hobbies AS h
    WHERE
        'Chess' = ANY(h.hobbies);

-- Updating the age of the student that's first_name is "Alice"
UPDATE students
    SET age = age + 2
WHERE
    first_name = 'Alice';