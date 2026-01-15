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
            <name> ,               // Name of the collection to be created. (String)                                                |    
            {                             // Optional. Additional options for creating the collection.                              |                                  
                capped: <boolean>,            // Optional. If true, creates a capped collection.                                    |            
                timeSeries: {                   // Optional. Defines the collection as a time-series collection.                    |
                    timeField: <string>,        // The name of the field that contains the date.                                    |        
                    metaField: <string>,        // Optional. The name of the field that contains metadata.                          |
                    granularity: <string>       // Optional. The granularity of the time-series data (seconds, minutes, hours).     |
                },                                                                                                                  |
                validator: { <validation rules> }, // Optional. Specifies validation rules for the collection.                      |
                validationLevel: <string>,     // Optional. Specifies the validation level (off, strict, moderate).                 |
                validationAction: <string>     // Optional. Specifies the validation action (error, warn).                          |
                size: <number>,               // Optional. Specifies the maximum size of the capped collection in bytes.            |
                max: <number>                 // Optional. Specifies the maximum number of documents in the capped collection.      |
                pipeline: [ <aggregation stages> ] // Optional. Specifies a pipeline for pre-processing documents before insertion. |
                collation: <string>          // Optional. Specifies the collation for the collection.                               |
                writeConcern: <document>     // Optional. Specifies the write concern for the collection.                           |
                expiresAfterSeconds: <number> // Optional. Specifies the expiration time for documents in a time-series collection. |
                viewOn: <string>              // Optional. Specifies the source collection for a view.                              |
            }                                                                                                                       |    
    )                                                                                                                               | 
|                                                                                                                                   | 
+-----------------------------------------------------------------------------------------------------------------------------------+
| 🔵 Syntax for db.runCommand({ collMod: "collection", option })                                                                    |                              
+-----------------------------------------------------------------------------------------------------------------------------------+
|                                                                                                                                   | 
| db.runCommand(                                                                                                                    |
|       {                                                                                                                           |          
            collMod: <collection_name>,   // Name of the collection to be modified. (String)                                        |
|           {                             // Additional options for modifying the collection.                                       |                                  
                validator: {                                                                                                        |        
                    bsonType: "object",          // Specifies the new validation rules for the collection.                          |
                    required: [ "name", "age" ], // Example: Specifies required fields.                                             |
                    properties: {                // Example: Specifies properties and their types.                                  |
                        name: {                                                                                                     |                   
                            bsonType: "string",                                                                                     |                                 
                            description: "must be a string and is required"                                                         |                       
                        },                                                                                                          |                                                  
                        age: {                                                                                                      |
                            bsonType: "int",                                                                                        |
                            minimum: 0,                                                                                             |
                            description: "must be an integer greater than or equal to 0 and is required"                            |
                        }                                                                                                           |
                    }                                                                                                               |                                
                },                                                                                                                  |                           
                validationLevel: <string>,     // Optional. Specifies the new validation level (off, strict, moderate).             |
                validationAction: <string>     // Optional. Specifies the new validation action (error, warn).                      |
            }                                                                                                                       |
        }                                                                                                                           |
    )                                                                                                                               |                             
|                                                                                                                                   |                                  
+-----------------------------------------------------------------------------------------------------------------------------------+
*/
