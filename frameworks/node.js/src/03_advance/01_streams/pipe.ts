import { createReadStream, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

/*
 * 🟡 Pipes are the ways to flow the data between multiple streams, like suppose:
 *      1. Got data from readable stream and passing these chunks to transform stream
 *      2. Got chunk of data from "readable stream" perform some transformation and pass to destination stream "writableStream"
 *      3. Got chunk of data from "transform", now i'll add it into file.
 *
 * ⭐ Similar to other node.js API's these one also have 2 types of streams:
 *      2. Non-Blocking (pipe (callback, promise))
 */
const readStream = createReadStream(
  resolve(__dirname, "./playing/sample-upper.txt"),
);
readStream.setEncoding("utf-8");

const zlib = createGzip();

const writeStream = createWriteStream(
  resolve(__dirname, "./playing/sample-zip.txt.gz"),
);

pipeline(readStream, zlib, writeStream)
  .then(() => console.log("Successfully zipped the file"))
  .catch((err) =>
    console.error("Something went wrong while zipping it. ", err),
  );
