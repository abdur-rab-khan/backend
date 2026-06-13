/*
 *
 */

import { createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { stdout } from "node:process";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const sleep = (sleep: number = 1000) =>
  new Promise((resolve) => setTimeout(() => resolve(""), sleep));

async function* generateRow() {
  yield "Row 1\n";
  yield "Row 2\n";
  await sleep();
  yield "Row 3\n";
  yield "Row 4\n";
  await sleep(1500);
  yield "Row 5\n";
  yield "Row 6\n";
  yield "Row 7\n";
  await sleep(400);
  yield "Row 8\n";
  yield "Row 9\n";
  await sleep(5000);
}

const readableStream = Readable.from(generateRow());
const writableStream = createWriteStream(
  resolve(__dirname, "./playing/api-data-stream.txt"),
);

readableStream.pipe(stdout);

async function asyncOperations() {
  await pipeline(readableStream, writableStream);

  for await (const chunk of readableStream) {
    console.log("Chunk is: ", chunk);
  }
}

asyncOperations();
