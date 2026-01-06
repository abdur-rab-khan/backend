-- "CURRENT_DATE": Returning the current data based on the timezone is "yyyy-mm-dd" format
SELECT CURRENT_DATE;

-- "CURRENT_TIME": Returning the current time based on the timezone
SELECT CURRENT_TIME;


-- "CURRENT_TIMESTAMP": Returning the current time stamp based on the timezone
SELECT CURRENT_TIMESTAMP;

/*
-- EXTRACT THE "YEAR", "DAY", "MONTH", "HOUR" from the timestamp
*/
SELECT EXTRACT(DAY FROM CURRENT_TIMESTAMP);
SELECT EXTRACT(MONTH FROM CURRENT_TIMESTAMP);
SELECT EXTRACT(YEAR FROM CURRENT_TIMESTAMP);
SELECT EXTRACT(HOUR FROM CURRENT_TIMESTAMP);

-- TO_DATE(CURRENT_TIMESTAMP, format('yyyy-mm-dd')): Converts string from data
SELECT EXTRACT(YEAR FROM TO_DATE('2025-01-01', 'yyyy-mm-dd'));