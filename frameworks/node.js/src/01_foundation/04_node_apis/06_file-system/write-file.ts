import { resolve } from "node:path";
import { existsSync, mkdirSync, Mode, writeFile, writeFileSync } from "node:fs";
import { writeFile as writeFilePromise } from "node:fs/promises";

// 🟡 If no file exists, it will automatically create it and then add data into it, 👉 But the folder should be there.
// 🟡 This API, fully replace the content of the file, It any content data already exists into the file it will replace it.
// 🟡 To only append the data without replacing it we have to use append api then.

// 👉 Let's create a sample folder for doing the file-write
const FOLDER_PATH = resolve(__dirname, "./playing");

// 👉 First checking whether "FILE" actually exists or not, If not then we are creating file
if (!existsSync(FOLDER_PATH)) {
  mkdirSync(FOLDER_PATH);
}

const data = {
  name: "Abdur Rab Khan",
  role: "Backend Developer",
  language: "TypeScript",
  framework: "Node.js",
  status: "Learning file system APIs",
  experience: "1+ years",
  location: "Mumbai, Maharashtra",
  email: "abdur@example.com",
  skills: ["Node.js", "TypeScript", "Express", "MongoDB"],
};

// 👉 Blocking way for writing into the file
writeFileSync(
  resolve(FOLDER_PATH, "sample-data.json"),
  JSON.stringify(data, null, 2),
);

// 👉 No-Blocking way using callback (older) for writing into a file
writeFile(
  resolve(FOLDER_PATH, "sample-data-2.json"),
  JSON.stringify(data, null, 2),
  (err) => {
    if (err) {
      console.error("❌ Error while writing on file: ", err);
    }
  },
);

// 👉 No-Blocking way using promise (older) for writing into a file
writeFilePromise(
  resolve(FOLDER_PATH, "./sample-data-3.json"),
  JSON.stringify(data, null, 2),
)
  .then((value) => {
    console.log(value);
  })
  .catch((err) => {
    console.error("❌ Error while writing on file: ", err);
  });
