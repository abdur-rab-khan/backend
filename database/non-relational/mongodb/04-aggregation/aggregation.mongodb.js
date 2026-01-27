/*
+----------------------------------------------------------------------+ AGGREGATION PIPELINE +---------------------------------------------------------------------+
|                                                                                                                                                                   |
| 🟡 Aggregation Pipeline is a framework for data aggregation modeled on the concept of data processing pipelines. Documents enter a multi-stage pipeline           |
|    where they can be transformed and aggregated in various ways. Each stage performs an operation on the input documents and passes the results to the next stage |
|                                                                                                                                                                   |
| 🔵 Important Stage in Mongodb Pipeline                                                                                                                            |
|                                                                                                                                                                   |
|  🔸 $match: Usually the first stage in a pipeline, it filters documents to pass only those that match the specified condition(s) to the next stage, Similar to    |
|        'WHERE' clause in SQL.                                                                                                                                     |
|                                                                                                                                                                   |
|  🔸 $group: This stage groups input documents by a specified identifier expression and applies accumulator expressions, such as sum, avg, max, min, etc., to      | 
|      compute aggregated values for each group. Similar to 'GROUP BY' in SQL. --> {_id: "field", ...other_expressions}                                             |
|                                                                                                                                                                   |
|  🔸 $project: This stage reshapes each document in the stream, such as by including, excluding, or adding new fields. Similar to 'SELECT' in SQL.                 |
|                                                                                                                                                                   |
|  🔸 $sort: This stage sorts all input documents and returns them in the specified order. Similar to 'ORDER BY' in SQL. --> { $sort: {field: 1 | -1 } }            |
|            -1: Descending order, 1: Ascending order                                                                                                               |
|                                                                                                                                                                   |
|  🔸 $limit: This stage limits the number of documents passed to the next stage in the pipeline. Similar to 'LIMIT' in SQL. --> { $limit: 5 }                      |
|                                                                                                                                                                   |
|  🔸 $skip: This stage skips over a specified number of documents from the input and passes the remaining documents to the next stage. Similar to 'OFFSET' in SQL. |
|            --> { $skip: 5 }                                                                                                                                       |
|                                                                                                                                                                   |
|  🔸 $unwind: This stage deconstructs an array field from the input documents to output a document for each element in the array.                                  |
|              Similar to flattening arrays. --> { $unwind: "$arrayField" }                                                                                         |
|                                                                                                                                                                   |
|  🔸 $lookup: This stage performs a left outer join to another collection in the same database to filter in documents from the "joined" collection for processing. |
|             Similar to 'JOIN' in SQL.                                                                                                                             | 
|        --> { from: "collection", localField: "field1", foreignField: "field2", as: "outputArrayField" }                                                           |
|                                                                                                                                                                   |
|  🔸 $addFields: This stage adds new fields to documents. Similar to adding computed columns in SQL. --> { $addFields: { newField: "value" } }                     |
|                                                                                                                                                                   |
|  🔸 $replaceRoot: This stage replaces the input document with the specified document. Useful for promoting embedded documents to the top level.                   |
|        --> { newRoot: "$embeddedDocumentField" }                                                                                                                  |
|                                                                                                                                                                   |
|  🔸 $facet: This stage allows for multiple concurrent aggregations on the same set of input documents, producing a multi-faceted result set.                      |
|        --> { $facet: { pipelineOne: [...stage], pipelineTwo: [...stage] } }                                                                                       |
|                                                                                                                                                                   |
|  🔸 $cond: A conditional operator that allows for if-then-else logic within aggregation expressions.                                                              |
|       --> { $cond: { if: <condition>, then: <true-case>, else: <false-case> } }                                                                                   |
|                                                                                                                                                                   |
|  🔸 $dateToString: This operator converts a date object to a string according to a specified format.                                                              |
|       --> { $dateToString: { format: "%Y-%m-%d", date: "$dateField" } }                                                                                           |
|                                                                                                                                                                   |
|  🔸 $set: This stage is an alias for $addFields, used to add new fields or modify existing fields in documents.                                                   |
|                                                                                                                                                                   |
|  🔸 $merge: This stage merges the documents from the aggregation pipeline into a specified collection, either inserting new documents or updating existing ones.  |
|       --> { into: "targetCollection", on: "_id", whenMatched: "replace", whenNotMatched: "insert" }                                                               |
|                                                                                                                                                                   |
|  🔸 $out: This stage writes the resulting documents of the aggregation pipeline to a specified collection. It can either create a new collection                  |
|         or replace an existing one.                                                                                                                               |
|       --> { $out: "outputCollection" }                                                                                                                            |
|                                                                                                                                                                   |
|  🔸 $expr: Allows the use of aggregation expressions within the query language.                                                                                   |
|      -- Example: { $expr: { $gt: ["$spent", "$budget"] } }                                                                                                        |
|                                                                                                                                                                   |
|                                                                                                                                                                   |
+--------------------------------------------------------------------------------+  +-------------------------------------------------------------------------------+
|                                                              MONGODB IMPORTANT AGGREGATION OPERATORS                                                              |
+--------------------------------------------------------------------------------+  +-------------------------------------------------------------------------------+
|                                                                                                                                                                   |
| 1️⃣. $sum: Calculates the sum of numeric values.                                                                                                                   |
|      -- Example: { $sum: "$field" }                                                                                                                               |
|                                                                                                                                                                   |
| 2️⃣. $avg: Calculates the average of numeric values.                                                                                                               |
|      -- Example: { $avg: "$field" }                                                                                                                               |
|                                                                                                                                                                   |
| 3️⃣. $min: Finds the minimum value.                                                                                                                                |
|      -- Example: { $min: "$field" }                                                                                                                               |
|                                                                                                                                                                   |
| 4️⃣. $max: Finds the maximum value.                                                                                                                                |
|      -- Example: { $max: "$field" }                                                                                                                               |
|                                                                                                                                                                   |
| 5️⃣. $push: Adds values to an array.                                                                                                                               |
|      -- Example: { $push: "$field" }                                                                                                                              |
|                                                                                                                                                                   |
| 6️⃣. $addToSet: Adds unique values to an array.                                                                                                                    |
|      -- Example: { $addToSet: "$field" }                                                                                                                          |
|                                                                                                                                                                   |
| 7️⃣. $first: Returns the first value in a group of documents.                                                                                                      |
|      -- Example: { $first: "$field" }                                                                                                                             |
|                                                                                                                                                                   |
| 8️⃣. $last: Returns the last value in a group of documents.                                                                                                        |
|      -- Example: { $last: "$field" }                                                                                                                              | 
|                                                                                                                                                                   | 
+------------------------------------------------------------------------------+ END +------------------------------------------------------------------------------+
*/

use("mongodb-tutorial");

db.users.aggregate([
  {
    $match: {
      department: {
        $in: ["IT", "HR", "Finance"],
      },
    },
  },
  {
    $project: {
      name: 1,
      age: 1,
      city: 1,
      salary: 1,
      department: 1,
      isAdult: {
        $cond: {
          if: {
            $gt: ["$age", 18],
          },
          then: true,
          else: false,
        },
      },
    },
  },
]);
