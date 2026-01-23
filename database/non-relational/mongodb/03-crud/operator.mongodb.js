/*
+-----------------------------------------------------+ MONGODB OPERATORS +-----------------------------------------------------+
|                                                                                                                               |
| 🟡 These operators are used to check match a filed value based on conditions like whether it's greater, smaller or equal etc. |
|                                                                                                                               |
+---------------------------------------------------+ COMPARISON OPERATORS +----------------------------------------------------+
|                                                                                                                               |
| 1️⃣. $eq: Matches values that are equal to a specified value. -- Example: { field: { $eq: value } }                            |
| 2️⃣. $ne: Matches all values that are not equal to a specified value. -- Example: { field: { $ne: value } }                    |
| 3️⃣. $gt: Matches values that are greater than a specified value. -- Example: { field: { $gt: value } }                        |
| 4️⃣. $gte: Matches values that are greater than or equal to a specified value. -- Example: { field: { $gte: value } }          |
| 5️⃣. $lt: Matches values that are less than a specified value. -- Example: { field: { $lt: value } }                           |
| 6️⃣. $lte: Matches values that are less than or equal to a specified value. -- Example: { field: { $lte: value } }             |
| 7️⃣. $in: Matches any of the values specified in an array. -- Example: { field: { $in: [value1, value2, ...] } }               |
| 8️⃣. $nin: Matches none of the values specified in an array. -- Example: { field: { $nin: [value1, value2, ...] } }            |
|                                                                                                                               |
|                                                                                                                               |
+--------------------------------------------------+ LOGICAL OPERATORS +--------------------------------------------------------+
|                                                                                                                               |
| 1️⃣. $and: Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.             |
|        -- Example: { $and: [ { field1: condition1 }, { field2: condition2 } ] }                                               |
| 2️⃣. $or: Joins query clauses with a logical OR returns all documents that match the conditions of either clause.              |
|       -- Example: { $or: [ { field1: condition1 }, { field2: condition2 } ] }                                                 |
| 3️⃣. $not: Inverts the effect of a query expression and returns documents that do not match the query expression.              |
|        -- Example: { field: { $not: { <operator>: <value> } } }                                                               |
| 4️⃣. $nor: Joins query clauses with a logical NOR returns all documents that fail to match both clauses.                       |
|        -- Example: { $nor: [ { field1: condition1 }, { field2: condition2 } ] }                                               |
|                                                                                                                               |
+---------------------------------------------------+ ARRAY OPERATORS +---------------------------------------------------------+
|                                                                                                                               |
| 1️⃣. $all: Matches arrays that contain all elements specified in the query.                                                    |
|     -- Example: { field: { $all: [value1, value2, ...] } }                                                                    |               
| 2️⃣. $elemMatch: Matches documents that contain an array field with at least one element that matches all the specified        |
|     query criteria. -- Example: { field: { $elemMatch: { <query1>, <query2>, ... } } }                                        |
| 3️⃣. $size: Matches any array with the specified number of elements.                                                           |
|     -- Example: { field: { $size: <number> } }                                                                                |
|                                                                                                                               |
+--------------------------------------------------+ ELEMENT OPERATORS +--------------------------------------------------------+
|                                                                                                                               |
| 1️⃣. $exists: Matches documents that have the specified field.                                                                 |
|    -- Example: { field: { $exists: <boolean> } }                                                                              |
| 2️⃣. $type: Matches documents where the field is of the specified type.                                                        |
|    -- Example: { field: { $type: <BSON type> } }                                                                              |
|                                                                                                                               |
+--------------------------------------------------+ EVALUATION OPERATORS +-----------------------------------------------------+
|                                                                                                                               |
| 1️⃣. $regex: Provides regular expression capabilities for pattern matching strings in queries.                                 |
|   -- Example: { field: { $regex: /pattern/, $options: 'i' } }                                                                 |
| 2️⃣. $expr: Allows the use of aggregation expressions within the query language.                                               |
|   -- Example: { $expr: { $gt: ["$spent", "$budget"] } }                                                                       |                               
| 3️⃣. $where: Allows the use of JavaScript expressions to query documents.                                                      |
|   -- Example: { $where: function() {                                                                                          |
|            return this.name.length > 5;                                                                                       |
|     }}                                                                                                                        |
|                                                                                                                               |
| // OR                                                                                                                         |
|  -- Example: { $expr: {                                                                                                       |
|         $function: {                                                                                                          |
|             body: function(name) { return name.length > 5; },                                                                 |                                      
|             args: [ "$name" ],                                                                                                |                                              
|             lang: "js"                                                                                                        |                                                
|        }                                                                                                                      |
|      }}                                                                                                                       |                                   
|                                                                                                                               |
+------------------------------------------------------------+ END +------------------------------------------------------------+


+-----------------------------------------------------+ IMPORTANT TO NOTE +-----------------------------------------------------+
|                                                                                                                               |
| ⭐ Operators in MongoDB works in two contexts.                                                                                |
|                                                                                                                               |
|    1️⃣. Query Context: Used to filter documents based on specified criteria.                                                   |
|          🔸 find()                                                                                                            |                               
|          🔸 $match                                                                                                            |                               
|                                                                                                                               |
|    ♦️ Example:                                                                                                                |
|         db.collection.find({ age: { $gt: 25 } }); // Query Context                                                            |
|         db.collection.aggregate([                                                                                             |
|           { $match: { age: { $gt: 25 } } } // Query Context                                                                   |
|         ]);                                                                                                                   |
|                                                                                                                               |
|    2️⃣ Expression Context: Used to compute values or perform operations on fields within documents.                            |
|        🔸 Aggregation Pipeline Stages:                                                                                        |                      
|          🔹 $project                                                                                                          |
|          🔹 $group                                                                                                            |
|          🔹 $addFields                                                                                                        |
|          🔹 $set                                                                                                              |
|          🔹 $cond                                                                                                             |
|          🔹 $expr                                                                                                             |
|                                                                                                                               |
|    ♦️ Example:                                                                                                                |
|         db.collection.aggregate([                                                                                             |
|           { $project: { isAdult: { $gt: ["$age", 18] } } } // Expression Context                                              |
|         ]);                                                                                                                   |
|        db.collection.aggregate([                                                                                              |
|           { $addFields: { totalPrice: { $multiply: ["$price", "$quantity"] } } } // Expression Context                        |
|         ]);                                                                                                                   |
|        db.collection.aggregate([                                                                                              |
|           { $match: { $expr: { $gt: ["$spent", "$budget"] } } } // Expression Context                                         |
|        ]);                                                                                                                    |
|        db.collection.aggregate([                                                                                              |
|           { $match: {                                                                                                         |                            
|               $and: [                                                                                                         |
|                   { $expr: { $gt: ["$age", 18] } },                                                                           |
|                   { $expr: { $lt: ["$age", 30] } }                                                                            |
|               ]                                                                                                               |
|           } // Expression Context                                                                                             |
|         ]);                                                                                                                   |
|                                                                                                                               |
| ⭐ In Mongodb, there is two level of operators:                                                                               |
|                                                                                                                               |
|   1️⃣. Top-Level Operators: These operators are used directly within the query document to filter documents based on specified |
|      criteria. Examples include $and, $or, $match, $group                                                                     |
|                                                                                                                               |
|   ♦️ Example:                                                                                                                 |
|     db.collection.find({ $and: [ { age: { $gt: 25 } }, { status: "A" } ] }); // Top-Level Operator                            | 
|     db.collection.aggregate([                                                                                                 |
|       { $match: { status: "A" } }, // Top-Level Operator                                                                      |
|       { $group: { _id: "$cust_id", total: { $sum: "$amount" } } } // $group Top-Level Operator                                |  
|     ]);                                                                                                                       |
|                                                                                                                               |
|   2️⃣. Field-Level Operators: These operators are used within field to compute values or perform operations on fields.         |
|       Examples include $gt, $sum, $avg, $cond, $expr                                                                          |
|                                                                                                                               |
|   ♦️ Example:                                                                                                                 |
|     db.collection.find({ age: { $gt: 25 } }); // Expression-Level Operator                                                    |
|     db.collection.aggregate([                                                                                                 |
|       { $project: { isAdult: { $gt: ["$age", 18] } } }, // Expression-Level Operator + Expression Context                     |
|       { $group: { _id: "$cust_id", total: { $sum: "$amount" } } } // $sum Expression-Level Operator                           |
|     ]);                                                                                                                       |
|                                                                                                                               |
|                                                                                                                               |
|                                                                                                                               |
+------------------------------------------------------------+ END +------------------------------------------------------------+

*/
use("mongodb-tutorial");

// Example usage of some MongoDB operators:

db.users.find({ first_name: { $eq: "John" } }); // Using $eq operator
db.users.find({ age: { $gt: 25 } }); // Using $gt operator
db.users.find({ $and: [{ age: { $gte: 18 } }, { age: { $lte: 30 } }] });
db.users.find({ hobbies: { $all: ["reading", "traveling"] } });
db.users.find({ address: { $exists: true } });
db.users.find({ name: { $regex: /^J/, $options: "i" } });
db.users.find({ $expr: { $gt: ["$spent", "$budget"] } });
db.users.find({
  $where: function () {
    return this.first_name.length < 5;
  },
});
