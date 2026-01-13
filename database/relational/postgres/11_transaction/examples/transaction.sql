-- Increasing the age of student that id is 1
BEGIN;
    -- 1. Locking and SELECTING the student that student_id = 1 
    SELECT *
    FROM
        students
    WHERE
        student_id = 1
    FOR UPDATE;

    -- 2. Increasing their age by 1
    UPDATE
        students
    SET
        age = age + 1
    WHERE
        student_id = 1;

    -- 3. Getting the updated student
    SELECT *
    FROM
        students
    WHERE
        student_id = 1;

-- Commit the changes
COMMIT;