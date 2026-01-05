/* <==============================> CREATING JSON DATA <==============================> */ 

-- "jsonb_build_array()": Used to build json array using list of values from the table
SELECT
    jsonb_build_array(
        CONCAT(first_name, ' ', last_name),
        age,
        address
    ) -- ["Alice Parker", 20, {...address} ]
FROM
    students;


-- "jsonb_build_object()": Used to build json object from customer key and table values
SELECT
    json_build_object(
        'full_name', first_name || ' ' || last_name,
        'age', age,
        'address', address
    ) -- {'full_name': 'Alice Parker', 'age': 20, address: {...address}}
FROM
    students;

-- "jsonb_object()": Used to build an json object from a text array, it will convert into json object json passed in a text format.


/* 
<==============================> SEARCHING JSON DATA <==============================> 

- It's helpful for searching value using key, it provides several expression for that:

    1. "$": It represent the root element to query.
    2. ".key": It is used to access the property of matched "key", (.*) to access all properties of a json object
    3. [n]: It is used to access element from json_array using index, [*] to access all array elements.
    4. @: It represent the current node being processed by filter predicate, like ( $.pet[*] ? '(@.species == "Cat" ))'
    5. [start: end]: For Array Slice
    6. [?(expression)]: For filtering array elements based on expression.

* Suppose data looks like that

{
  "name": "John",
  "age": 30,
  "city": "New York",
  "pets": [
    {"name": "Max", "species": "Dog"},
    {"name": "Whiskers", "species": "Cat"}
  ]
}
*/

-- "jsonb_path_query(column_name --> jsonb_data, 'expression to get')": Used to get properties based on query
SELECT
    jsonb_build_object(
        'person_name', jsonb_path_query(info, '$.name'), -- or we can use info->>'name'
        '0th_index_pet', jsonb_path_query(info, '$.pets[0]'),
        'pet_with_name_whiskers', jsonb_path_query(info,
        '$.pets[*] ? (@.name == "Whiskers")'
        )
    )
FROM
    person

-- "jsonb_path_query_first(column_name --> jsonb_data, 'query expression')": It's similar to "jsonb_path_query" but it always return first matched result.

-- "jsonb_path_exists(column_name --> jsonb_data, 'query expression')": It returns boolean value (true/false) it that element exists on the jsonb data.

/* 
<==============================> QUERYING JSON DATA <==============================> 
*/

-- "jsonb_extract_path(column_name --> jsonb_data, 'path', 'path', ...)": It is used to query properties from json data using function instead of using these operators '.->>'table_name'

SELECT
    jsonb_build_object(
        'first_pet', jsonb_extract_path(info, 'pets')
    )
FROM
    person;