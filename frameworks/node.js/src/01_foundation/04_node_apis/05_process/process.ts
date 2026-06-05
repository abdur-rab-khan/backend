import process from "node:process";

// Give the current path, where this file exists, Unlike "__dirname" that give the ""director name"" where "script (starting point)" exists
const currentPath = process.cwd();
console.log("Current path where I'm is: ", currentPath);
