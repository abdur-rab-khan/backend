import { resolve } from "node:path";
import { Console } from "node:console";
import { createWriteStream } from "node:fs";

const output = createWriteStream(
  resolve(__dirname, "../public/logs/output.log"),
);
const err = createWriteStream(resolve(__dirname, "../public/logs/error.log"));

const logger = new Console({
  stdout: output,
  stderr: err,
});

export default logger;
