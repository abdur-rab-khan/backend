import gzip from "node:zlib";
import { resolve } from "node:path";
import { pipeline } from "node:stream";
import { createServer } from "node:http";
import { createReadStream, createWriteStream } from "node:fs";

/*
 * 🟡 A Stream in Node.js is a way to handle data "chunk by chunk" instead of loading everything into memory at once.
 *
 * 🟡 Imagine you need water for a farm, but the water source is far away.
 *
 * 🔷 There are two solutions:
 *    1️⃣. The Tank Solution (No Stream):
 *                                      Build a massive tank by the farm, fill it completely, and then use the water. This works, but it is expensive because buying a huge tank requires too much space (RAM/Memory).
 *                                      If you need more water than the tank can hold, your system crashes.
 *
 *    2️⃣. The Pipe Solution (Stream):
 *                                   Connect a long pipe from the source to the farm. Water flows through the pipe in a continuous, manageable line.
 *                                   It is cheap because you do not need a massive container, and you can process the water the exact moment it arrives.
 *
 * 🔶 Types of Streams:
 *    1️⃣ Readable Stream:
 *                      Used to read data in chunks. It serves as the starting point of a pipeline and can be piped into other streams.
 *                     🔸 Examples: req (in HTTP servers), fs.createReadStream()
 *
 *    2️⃣ Writable Stream: Used to accept chunks of data. It acts as the final destination ("sink") because it consumes data but does not output anything further.
 *                     🔸Examples: res (in HTTP servers), fs.createWriteStream()
 *
 *    3️⃣ Duplex Stream: Has both a readable and a writable channel, but they operate independently.
 *                     🔸 Examples: A TCP net socket, crypto.createCipheriv (can act as duplex).
 *
 *    4️⃣ Transform Stream: A special type of Duplex stream where the output is directly calculated from the input (Read ➡️ Modify ➡️ Write).
 *                         This is what you use to build custom processing steps by overriding the _transform method.
 *        🔸Examples: zlib.createGzip(), custom text filters.
 */
const server = createServer((req, res) => {
  const fileData = createReadStream(resolve(__dirname, "./video.mp4"));

  pipeline(
    fileData,
    gzip.createGzip(),
    createWriteStream(resolve(__dirname, "./video.mp4.gz")),
    (err) => {
      if (err) {
        res.statusCode = 500;
        res.end("Internal Server Error");
      } else {
        res.end("Successfully created the zip file");
      }
    },
  );
});

server.listen(8080, () => console.log("Server is listening on port 8080"));
