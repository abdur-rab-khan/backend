import { createReadStream, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { Transform, TransformCallback } from "node:stream";
import { pipeline } from "node:stream/promises";

/*
 * 🟡 Readable Streams are a streams that get data from source and pass it for consume, It could be consume of "writableStreams" or "transformStream" like zLib, crypto or custom transformer.
 * ".on": It's use to handle events of stream:
 *      1. "data": This event accept one callback function with chunk argument, mean it will call the callback and give data in chunks
 *      2. "end": This event accepts one callback function and it will call when streams got ended.
 */

/*
 * 🟡 "Readable Stream:"
 *                      Used to read data from "files", "network request" and send data as a "chunk", and that chunk of data that be pipe to "writableStream" or "transformStream" like "zlib", "createWritableStream"
 *                      🔶 Important methods provided:
 *                             1. "on": These are event listeners that call's the callback function when certain event occurs like "data", "end", "error", "close"
 *                             2. "pause/resume": resume/pause are used to pause/resume the stream flow, Sometime writeStreams are slower than readStream that's why we pause if "writeStream.write("data")" returns false.
 *                             3. "setEncoding":
 *
 * 🟡 "Writable Stream:"
 *                      Used to write on "files", "network request" data that we got from "readable streams", "transformer" through pipes.
 *                      🔶 Important methods provided:
 *                           1. "on": Event listeners that call's the callback function when certain event occurs like "drain (event call when writeStream.write("data") returns false)"
 *                           2. "write": Used to write data in a chunks, and return boolean if the buffer memory got full.
 */

const readableStream = createReadStream(
  resolve(__dirname, "./playing/sample.txt"),
  {
    encoding: "utf-8",
  },
);

// Can also set option via methods
readableStream.setEncoding("utf-8");

readableStream
  .on("data", (chunk) => console.log("CHUNKS ARE: ", chunk, "\n\n"))
  .on("end", () =>
    console.log(
      "<----------------------------------> STREAM ENDED <---------------------------------->",
    ),
  );

// Let's use pipe to transform data and add it into new file
class CustomTransformer extends Transform {
  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    const upper = chunk.toString().toUpperCase();
    this.push(upper + "\n\n");
    callback();
  }
}

const upperCaseTransformer = new CustomTransformer();
const writableStreams = createWriteStream(
  resolve(__dirname, "./playing/sample-upper.txt"),
);

pipeline(readableStream, upperCaseTransformer, writableStreams)
  .then(() => console.log("Success transform the data"))
  .catch((err) => console.error(err));
