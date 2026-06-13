import { appendFile } from "node:fs/promises";
import { resolve } from "node:path";

const log = `[${new Date().toISOString()}] User logged in\n`;

// 🟡 Similar to "read" and "write" node api, it also have three ways to append the file but we'll going to see only "promise" one.
const LOG_PATH = resolve(__dirname, "./playing/logging-logs.log");

appendFile(LOG_PATH, log)
  .then(() => {
    console.log("Successfully logged: ");
  })
  .catch((err) => {
    console.error("❌ Failed to log the log", err);
  });
