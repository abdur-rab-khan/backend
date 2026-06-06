import path from "node:path";
import process from "node:process";

// 👉 Give the current path where the current working directory of node.js process.
// Unlike __dirname, that gives the current file directory.
const currentPath = process.cwd();
console.log("Current path where I'm is: ", currentPath); // C:\Users\abdur\Developer\Learning\backend-dev\frameworks\node.js
console.log("src Directory is: ", path.resolve(currentPath, "./src"));

console.log("__dirname: ", __dirname); //  C:\Users\abdur\Developer\Learning\backend-dev\frameworks\node.js\src\01_foundation\04_node_apis\05_process

// 👉 Gives the current "memory usages" by current Node.process right now.
const memoryUsage = process.memoryUsage();
const convertToMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(2) + "MB";

console.log({
  rss: convertToMB(memoryUsage.rss), // Total process memory
  headUsed: convertToMB(memoryUsage.heapUsed), // Memory used by our object
  heapTotal: convertToMB(memoryUsage.heapTotal), // Total Allocated
});

// 👉
