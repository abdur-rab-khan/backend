/*
+-----------------------------------------------------------------------------------------------------------------------------------+
|------------------------------------------------------ COLLECTION IN MONGO --------------------------------------------------------|
|-----------------------------------------------------------------------------------------------------------------------------------|
|                                                                                                                                   |              
| 🟡 Mongodb stores data in a "bson" format, which is similar to "JSON" like documents, and all these documents gathered in a       |  
|   collection. A collection is similar to a table in relational databases.                                                         |   
| 🟡 Mongodb does not need to explicity define collection, when we add data to our database it will create automatically without    |  
|    any schema validation.                                                                                                         |  
| 🟡 Mongodb does not relay on any schema validation unlike relation database, but we can specify schema for our database.          |     
| 🟡 Collections are created inside a database.                                                                                     | 
|                                                                                                                                   | 
+-----------------------------------------------------------------------------------------------------------------------------------+
| 🔵 Methods For Handling Collection in MONGODB                                                                                     |                              
+-----------------------------------------------------------------------------------------------------------------------------------+
|                                                                                                                                   |            
| 🟡 Using "db.createCollection("name", "option") --> Creates collection with schema optional validation.                           |   
| 🟡 Using "db.runCommand({collMod: "collection", option}) --> Modifies existing collection with new schema validation.             | 
|                                                                                                                                   |            
+-----------------------------------------------------------------------------------------------------------------------------------+
| 🔵 Syntax for db.createdCollection()                                                                                              |                              
+-----------------------------------------------------------------------------------------------------------------------------------+
|                                                                                                                                   | 
| db.createCollection(                                                                                                              |                       
|            <name> ,               // Name of the collection to be created. (String)                                               |    
|                                                                                                                                   |
|           // Optional. Additional options for creating the collection.                                                            |
|            {                                                                                                                      |
|               // Optional. If true, creates a capped collection (fixed size).                                                     |                     
|               capped: <boolean>,                                                                                                  |            
|                                                                                                                                   |
|               // Optional. Defines the collection as a time-series collection (for storing time-series data).                     |
|               timeSeries: {                                                                                                       |
|                   timeField: <string>,        // The name of the field that contains the date.                                    |        
|                   metaField: <string>,        // Optional. The name of the field that contains metadata.                          |
|                   granularity: <string>       // Optional. The granularity of the time-series data (seconds, minutes, hours).     |
|               },                                                                                                                  |
|                                                                                                                                   |
|                // Optional. Specifies validation rules for the collection.                                                        |                              
|               validator: { <validation rules> },                                                                                  |
|               validationLevel: <string>,     // Optional. Specifies the validation level (off, strict, moderate).                 |
|               validationAction: <string>     // Optional. Specifies the validation action (error, warn).                          |
|                                                                                                                                   |
|               size: <number>,  // Optional. Specifies the maximum size of the capped collection in bytes, onces reaches older     |
|                                                documents will be deleted automatically.                                           |
|               max: <number>    // Optional. Specifies the maximum number of documents in the capped collection.                   |
|                                                                                                                                   |       
|               pipeline: [ <aggregation stages> ] // Optional. Specifies a pipeline for pre-processing documents before insertion. |
|               collation: <string>          // Optional. Specifies the collation for the collection.                               |
|               writeConcern: <document>     // Optional. Specifies the write concern for the collection.                           |
|               expiresAfterSeconds: <number> // Optional. Specifies the expiration time for documents in a time-series collection. |
|               viewOn: <string>              // Optional. Specifies the source collection for a view.                              |
|           }                                                                                                                       |    
|   )                                                                                                                               | 
|                                                                                                                                   | 
+-----------------------------------------------------------------------------------------------------------------------------------+
| 🔵 Syntax for db.runCommand({ collMod: "collection", option })                                                                    |                              
+-----------------------------------------------------------------------------------------------------------------------------------+
|                                                                                                                                   | 
| db.runCommand(                                                                                                                    |
|       {                                                                                                                           |          
|            collMod: <collection_name>,   // Name of the collection to be modified. (String)                                       |
|           {                             // Additional options for modifying the collection.                                       |                                  
|               validator: {                                                                                                        |        
|                   bsonType: "object",          // Specifies the new validation rules for the collection.                          |
|                   required: [ "name", "age" ], // Example: Specifies required fields.                                             |
|                   properties: {                // Example: Specifies properties and their types.                                  |
|                       name: {                                                                                                     |                   
|                           bsonType: "string", // Specifies the type of the "name" field (string, array, object, number, etc.).    |
|                           description: "must be a string and is required"                                                         |                       
|                       },                                                                                                          |                                                  
|                       age: {                                                                                                      |
|                           bsonType: "int",                                                                                        |
|                           minimum: 0,                                                                                             |
|                           description: "must be an integer greater than or equal to 0 and is required"                            |
|                       }                                                                                                           |
|                   }                                                                                                               |                                
|               },                                                                                                                  |                           
|               validationLevel: <string>,     // Optional. Specifies the new validation level (off, strict, moderate).             |
|               validationAction: <string>     // Optional. Specifies the new validation action (error, warn).                      |
|           }                                                                                                                       |
|       }                                                                                                                           |
|   )                                                                                                                               |                             
|                                                                                                                                   |                                  
+-----------------------------------------------------------------------------------------------------------------------------------+
*/

use("mongodb-tutorial");

db.users.drop(); // Delete existing collection "user"
db.students.drop(); // Delete existing collection "students"

// Creating a collection named "users" with schema validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "User schema validation",
      required: ["first_name", "last_name", "age", "email"],
      properties: {
        first_name: {
          bsonType: "string",
          minLength: 2,
          description: "must be a string and is required",
        },
        last_name: {
          bsonType: "string",
          minLength: 2,
          not: {
            enum: ["Doe"], // last name cannot be "Doe", not is used to specify negation
          },
          description: "must be a string and is required",
        },
        age: {
          bsonType: "number",
          minimum: 0,
          maximum: 120,
          description: "must be a number and is required",
        },
        email: {
          bsonType: "string",
          pattern: "^.+@.+\\..+$", // Simple regex for email validation
          patternProperties: {
            "^.+@.+\\..+$": {
              bsonType: "string",
              description: "must be a valid email address",
            },
          },
          description: "must be a string and is optional",
        },
        status: {
          bsonType: "string",
          enum: ["active", "inactive"],
          description: "can only be one of the enum values and is optional",
        },
        hobbies: {
          bsonType: "array",
          items: {
            bsonType: "string",
            description: "must be a string",
          },
          anyOf: [{ minItems: 1 }, { maxItems: 5 }],
          description: "must be an array of strings and is optional",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

// Inserting valid document
db.users.insertOne({
  first_name: "John",
  last_name: "Smith",
  age: 28,
  email: "something@something.com",
});

// Insert one more field with valid validation schema
db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["first_name", "last_name", "age", "email", "phone"],
      properties: {
        first_name: {
          bsonType: "string",
          minLength: 2,
          description: "must be a string and is required",
        },
        last_name: {
          bsonType: "string",
          minLength: 2,
          not: {
            enum: ["Doe"],
          },
          description: "must be a string and is required",
        },
        age: {
          bsonType: "number",
          minimum: 0,
          maximum: 120,
          description: "must be a number and is required",
        },
        email: {
          bsonType: "string",
          pattern: "^.+@.+\\..+$",
          patternProperties: {
            "^.+@.+\\..+$": {
              bsonType: "string",
              description: "must be a valid email address",
            },
          },
          description: "must be a string and is optional",
        },
        phone: {
          bsonType: "string",
          pattern: "^[0-9]{10}$",
          description: "must be a string of 10 digits and is required",
        },
        status: {
          bsonType: "string",
          enum: ["active", "inactive"],
          description: "can only be one of the enum values and is optional",
        },
        hobbies: {
          bsonType: "array",
          items: {
            bsonType: "string",
            description: "must be a string",
          },
          anyOf: [{ minItems: 1 }, { maxItems: 5 }],
          description: "must be an array of strings and is optional",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

// Inserting document with new field "phone"
db.users.insertOne({
  first_name: "Jane",
  last_name: "Parker",
  age: 32,
  email: "something@something.com",
  phone: "1234567890",
});

db.users.find().pretty();

// Creating a collection named "students" with schema validation
db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["first_name", "last_name", "age", "email"],
      properties: {
        first_name: {
          bsonType: "string",
          minLength: 3,
          maxLength: 200,
          description: "first_name must be a string and is required",
        },
        last_name: {
          bsonType: "string",
          minLength: 3,
          maxLength: 50,
          not: {
            enum: ["Doe"],
          },
          description: "last_name must be a string and is required",
        },
        age: {
          bsonType: "number",
          minimum: 0,
          maximum: 120,
          description: "age must be a number and is required",
        },
        email: {
          bsonType: "string",
          pattern: "^.+@.+\\..+$", // Simple regex for email validation
          description: "email is required and should be a string",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

db.students.insertMany([
  {
    first_name: "Peter",
    last_name: "Parker",
    age: 21,
    email: "peter@gmail.com",
  },
  {
    first_name: "Bruce",
    last_name: "Wayne",
    age: 30,
    email: "bruce@gmail.com",
  },
]);

db.students.find();
db.users.find();
