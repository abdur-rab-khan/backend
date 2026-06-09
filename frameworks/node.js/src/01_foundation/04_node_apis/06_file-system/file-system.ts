import path from "node:path";
import {
  existsSync,
  globSync,
  mkdirSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { rm } from "node:fs/promises";

const PLAYING_PATH = path.resolve(__dirname, "./playing");

console.log("Current working directory is: ", process.cwd());

// 👉 unlink: It's used to delete a file permanently, We also path array of paths for delete multiple files.
try {
  unlinkSync(path.resolve(__dirname, "./playing/sample-data.json")); // 👉 Throw an error if no file exists in this path.
} catch (err) {
  console.error(
    `Something went wrong: `,
    err instanceof Error ? err.message : "",
  );
}

// 👉 rm: It's similar to linux "rm" command, like that i can delete both folders and files and also it can recursively delete nested folder and files.
globSync(path.resolve(PLAYING_PATH, "./*.json")).forEach((playingPath) => {
  //   unlink(playingPath); --> Only deletes files
  rm(playingPath, {
    force: true,
    recursive: true,
  });
});

// Create a sample file
writeFileSync(
  path.resolve(PLAYING_PATH, "./new-data.json"),
  JSON.stringify({ name: "Abdur Rab Khan" }, null, 2),
);

// 👉 mkdir: It's also similar to linux "mkdir", Used to create folder and it can recursively create nested folders.
mkdirSync(path.resolve(PLAYING_PATH, "./data/sale/report/2024"), {
  recursive: true,
});

// 👉 readdir: Returns all the "folders" and "files" there in the folder but i only give one level of "folders" and "files", But by passing ""recursive:true"" we can also get file/folder from nested file/files also, using "withFileTypes" we can get more information.
console.log(
  "Folders and files are: ",
  readdirSync(PLAYING_PATH, {
    recursive: true,
  }),
);

// 👉 stat: Used to get information (metadata) about folder/files, like there size, it they are "isFile", "isDirectory", "mTime (last modified)", "size"
console.log("Playing folder stat is: ", statSync(PLAYING_PATH));

// 👉 existsSync: Returns boolean and It's used to check whether file/folder exists or not, and we can also check recursively.
console.log("Is playing folder exists or not: ", existsSync(PLAYING_PATH));
