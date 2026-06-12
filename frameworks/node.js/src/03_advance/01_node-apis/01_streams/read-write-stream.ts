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
 * 🟡 Writable Streams are the final destination of streams, within the pipeline they consume data given by "writable" or "transform" streams.
      🔸  
 */

const readableStream = createReadStream(resolve(__dirname, "./sample.txt"), {
  encoding: "utf-8",
});

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
  resolve(__dirname, "./sample-upper.txt"),
);

pipeline(readableStream, upperCaseTransformer, writableStreams)
  .then(() => console.log("Success transform the data"))
  .catch((err) => console.error(err));
