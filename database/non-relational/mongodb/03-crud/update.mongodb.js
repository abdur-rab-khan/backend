use("mongodb-tutorial");

/*
🟡 Updating Documents
------------------------------

1️⃣. db.collection.updateOne() - Used to update single document
2️⃣. db.collection.updateMany() - Used to update multiple document using single command
3️⃣. db.collection.replaceOne() - Used to replace the whole document with update one.

🟡 Additional methods
------------------------------

1️⃣. db.collection.findOneAndReplace() - Replace the single document based on filter
2️⃣. db.collection.findOneAndUpdate() - Update the single document based on filter
3️⃣. db.collection.findAndModify() - Update the document and return document, by default it return older one, but using "new" we can get modified one "({ ...filter&update, new:true })""
4️⃣. db.collection.bulkWrite() - Perform multiple operation on single "collection", with controls of order of execution 

🟡 Update Operators
------------------------------
- To update any document mongodb provides various update operators, some of them are listed below:

⭐ Fields -- Operators

1️⃣. $set - Used to set the value of a field in a document, add new if not exists -- { $set: { field: value } }
2️⃣. $unset - Used to removed field from a document -- {$unset: { quantity: "" }}
3️⃣. $rename - Used to rename the field - {$rename: {instock: "stocks"}}
4️⃣. $inc, $min, $max, $mul - Used to perform maths operations
    -- $inc - increment the value -- {$inc: { quantity: 10 }}
    -- $min - set the field to a value if the specified value is less than the current value of the field -- {$min: { quantity: 5 }}
    -- $max - set the field to a value if the specified value is greater than the current value of the field -- {$max: { quantity: 50 }}
    -- $mul - multiply the value of the field by a number -- {$mul: { quantity: 2 }}

⭐ Array -- Operators

1️⃣. $pop - Used to remove the first or last item of an array -- ${pop: {scores: -1}} // -1 first element || 1 last element
2️⃣. $push - Used to add an item to an array -- {$push: {scores: 80}} --> [76, 84, 75, "80"]
3️⃣. $pull - Used to remove elements from an array using query -- { $pull:{ fruits: { $in: ["apples", "oranges"] }, vegetables: "onion" } }
4️⃣. $pullAll - Used to remove elements but without using any query -- { $pullAll: {scores: ["apples", "oranges"]} }

⭐ Modifiers -- Operators

1️⃣. $each - Used with "$push" and "$addToSet" for appending multiple items in an array
2️⃣. $sort - Used to sort an element during push operations, 1 for ascending || -1 for descending

⭐⭐ Mongodb provides some pre-defined variables, like NOW (for current datetime), we can use them using "$$".
*/

use("mongodb-tutorial");

db.products.deleteMany({});

db.products.insertMany([
  { item: "chisel", sku: "C001", quantity: 4, instock: true },
  { item: "hammer", sku: "unknown", quantity: 3, instock: true },
  { item: "nails", sku: "unknown", quantity: 100, instock: true },
]);

db.products.updateOne(
  {
    sku: "unknown",
  },
  {
    $unset: {
      quantity: "",
      instock: "",
    },
  },
);

db.products.find({}); // [...others, {"sku": "unknown"}]

db.products.updateOne(
  {
    sku: "C001",
  },
  {
    $inc: {
      quantity: 10,
    },
  },
);

db.products.find({}); // [{"item": "chisel", "sku": "C001", "quantity": 14, "instock": true}, ...others]

// Add more marks into an array
db.students.updateMany(
  {},
  { $push: { marks: { $each: [11, 22, 33, 44], $sort: { marks: -1 } } } },
);
