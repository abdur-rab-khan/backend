import process from "node:process";

// "process.exit()"
// Exit Code:
//              0 --> Successfully existed
//              1 --> Something failed (used when we want to exit the program like when some configurations are missing)

if (process.env["MY_USERNAME"]) {
  process.exit(1); // I want to failed the process because main configuration is not where.
}

// Listening "exit" event that will call when ""process got exit""
process.on("exit", () => {
  console.log("Calling after Program got existed");
});

console.log("Ending the program using 0 (successfully ended)");
process.exit(0); // If process come till here and if we don't add this line "node.js will automatically stop it, using ""process.exit(0)""
