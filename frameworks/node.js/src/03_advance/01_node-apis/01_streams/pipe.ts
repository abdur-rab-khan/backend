/*
 * 🟡 Pipes are the ways to flow the data between multiple streams, like suppose:
 *      1. Got data from readable stream and passing these chunks to transform stream
 *      2. Got chunk of data from "readable stream" perform some transformation and pass to destination stream "writableStream"
 *      3. Got chunk of data from "transform", now i'll add it into file.
 *
 * ⭐ Similar to other node.js API's these one also have 2 types of streams:
 *      1. Blocking (pipeSync)
 *      2. Non-Blocking (pipe (callback, promise))
 */
