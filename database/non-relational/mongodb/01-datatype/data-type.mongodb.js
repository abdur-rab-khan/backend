/*
+-----------------------------------------------------------------------------------------------------------------------------------+
|------------------------------------------- MONGODB DATA TYPES --------------------------------------------------------------------|
|-----------------------------------------------------------------------------------------------------------------------------------|
|                                                                                                                                   |
| 🟡 MongoDB supports all types of data which already JSON supports, I mean it's because of mongodb store data                      |
|     in jsonb format that's similar to json.                                                                                       |
| 🟡 But MongoDB goes beyond default types and give some custom data types we'll see them below.                                    |
|                                                                                                                                   |
|-----------------------------------------------------------------------------------------------------------------------------------|
| ⭐ MongoDB Data Types:                                                                                                            | 
|-----------------------------------------------------------------------------------------------------------------------------------|
| 1️⃣. OBJECTID: A unique identifier for documents, typically used as the primary key. Example: ObjectId("507f1f77bcf86cd799439011") |
| 2️⃣. STRING: Sequence of characters. Example: "Hello, World!"                                                                      |
| 3️⃣. NUMBER: Numeric values, including integers and floating-point numbers. Example: 42, 3.14                                      |
| 4️⃣. BOOLEAN: Represents true or false values. Example: true, false                                                                |
| 5️⃣. OBJECT: A document or a record, represented as key-value pairs. Example: { "name": "Alice", "age": 30 }                       |
| 6️⃣. NULL: Represents a null or missing value. Example: null                                                                       |
| 7️⃣. DATE: Represents date and time values. Example: ISODate("2023-10-01T00:00:00Z")                                               |
| 8️⃣. ARRAY: Collection of values in an ordered list. Example: [ "apple", "banana", "cherry" ]                                      |
| 9️⃣. BINARY DATA: Represents binary data, such as images or files. Example: BinData(0, "base64encodeddata")                        |
| 1️⃣0️⃣. REGULAR EXPRESSION: Used for pattern matching within strings. Example: /pattern/i                                           |
| 1️⃣1️⃣. JAVASCRIPT: Embeds JavaScript code within a document. Example: function() { return true; }                                  |
| 1️⃣2️⃣. DECIMAL128: High-precision decimal values, useful for financial calculations. Example: NumberDecimal("19.99")               | 
+-----------------------------------------------------------------------------------------------------------------------------------+
*/

use("mongodb-tutorial");

// Removing existing collection if any
db.dataTypes.drop();

// Example document showcasing various MongoDB data types
db.dataTypes.insertOne({
  _id: ObjectId("507f1f77bcf86cd799439011"), // OBJECTID
  name: "Alice", // STRING
  age: 30, // NUMBER
  isActive: true, // BOOLEAN
  address: {
    street: "123 Main St",
    city: "Wonderland",
  }, // OBJECT
  phone: null, // NULL
  createdAt: ISODate("2023-10-01T00:00:00Z"), // DATE
  favoriteFruits: ["apple", "banana", "cherry"], // ARRAY
  profilePicture: BinData(0, "iVBORw0KGgoAAAANSUhEUgAAAAUA"), // BINARY DATA
  regexExample: /pattern/i, // REGULAR EXPRESSION
  customFunction: function (a, b) {
    return a + b;
  }, // JAVASCRIPT
  accountBalance: NumberDecimal("19.99"), // DECIMAL128
});

// Query to verify the inserted document
db.dataTypes.find().pretty();
