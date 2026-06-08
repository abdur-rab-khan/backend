import path from "node:path";
import { open, readFile, readFileSync } from "node:fs";
import { readFile as readFilePromise } from "node:fs/promises";

// 🟡 Read API, required to have a file otherwise it will return an error.

// 👉 Blocking way, for writing into the file
const fileData = readFileSync(
  path.resolve(__dirname, "./file-system.ts"),
  "utf-8",
); // It's a blocking methods the following code won't run until this finishes

console.log(fileData);

// 👉 Non-Blocking but using callback (older) way to write into a file
readFile(path.resolve(__dirname, "./file-system.ts"), "utf-8", (err, data) => {
  if (err) {
    throw err;
  }

  console.log("🧾 Current file data is: \n", data);
});

// 👉 Non-Blocking but using promises (modern) to write into the file
readFilePromise(path.resolve(__dirname, "./file-system.ts"), "utf-8")
  .then((fileData) => {
    console.log("🧾 Current file data is: \n", fileData);
  })
  .catch((err) => {
    console.error("❌ Something went wrong: ", err);
  });
