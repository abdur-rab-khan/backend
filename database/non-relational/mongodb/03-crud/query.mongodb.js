/*
🟡 db.collection_name.find({...filter}) -> It helps to find multiple documents
🟡 db.collection_name.findOne({...filter}) -> It helps to find one documents

🔵 AND
db.collection_name.find({
    first_name: 'Bruce',
    age: 30
}); ==> SELECT * FROM table_name WHERE first_name = 'Bruce' AND age = 30


🔵 OR 
db.collection_name.find({
    first_name: 'Bruce',
    $or: [
        {
        age: { $gt: 30 },
        },
        {
            last_name: 'Wayne'
        }
    ]
}); ==> SELECT * FROM table_name WHERE first_name = 'Bruce' OR (age > 30 AND last_name = 'Wayne') 
*/

use("mongodb-tutorial");

db.students.find({
  first_name: "Bruce",
  age: 30,
});

db.students.find({
  first_name: "Bruce",
  $or: [
    {
      age: { $gt: 30 },
    },
    {
      last_name: "Wayne",
    },
  ],
});
