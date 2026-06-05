import process from "node:process";

const commandArguments = process.argv;

console.log("Node path: ", commandArguments[0]); // Always the ""first"" arguments will be ""node path""
console.log("Script Path: ", commandArguments[1]); // Always the ""second"" argument will be ""script path""

// And after index "1", It will going to give me the custom arguments
const name = commandArguments[2]; // Let's assume the first argument will be a name

if (!name) {
  console.log("Name is required");
  process.exit(1);
}

console.log(`Hello! ${name}`);

// --> But there is a custom option where we can easily get the command arguments.
import nodeUtils from "node:util";

const options = {};

const { values, positionals } = nodeUtils.parseArgs({
  options: {
    name: {
      type: "string",
      short: "n",
    },
    age: {
      type: "string",
      short: "a",
    },
  },
  allowPositionals: true,
});

let message = "";
for (const value in values) {
  if (value === "name") {
    message += "Hello! " + values[value] + "\n";
  } else if (value === "age") {
    message += "\n Your age is: " + values[value] + " right???";
  }
}

console.log(message);
