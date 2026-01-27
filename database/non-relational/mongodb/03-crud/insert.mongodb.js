use("mongodb-tutorial");

/* 
🟡 Inserting Multiple Documents
------------------------------

1️⃣. db.collection.insertOne() - Inserts a single document into a collection.
2️⃣. db.collection.insertMany() - Inserts multiple documents into a collection.

*/
db.results.insertMany([
  {
    name: "Alice",
    score: 85,
    passed: true,
    marks: {
      math: 90,
      english: 80,
      science: 85,
      history: 75,
    },
  },
  {
    name: "Bob",
    score: 92,
    passed: true,
    marks: {
      math: 95,
      english: 88,
      science: 90,
      history: 93,
    },
  },
]);
