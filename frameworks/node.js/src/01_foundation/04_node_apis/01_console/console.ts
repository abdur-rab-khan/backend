/*
 * "console" module provides two things:
 *      1. "console" -> It's an "object" that provides some method which is there below.
 *      2. "Console" -> It's a class, used to build custom logger, So that we can store logs into the a file based "stdout", "stderr", and return "console" object.
 *
 * In "console" module we can create custom logger using "Console" class, using it we can store log messages into a file
 *      1. "stdout"
 *      2. "stderr"
 *
 * Common "console object" methods:
 *  1. "log" -> It's standard output, and it will treaded as "stdout"
 *  2. "error" -> It's standard output, and it will treaded as "stderr".
 *  3. "warn" -> It's used for showing an warning and it's will treaded as "stderr".
 *  4. "trace" -> It's used to trace where actually an error is happen, So suppose we a "stderr" log is there we at the above this "console.trace" is there than it will print the trace
 *              where actually an error is happened.
 *  5. "dir" -> Normal, "console.log", sometime does not print nested object, Using "console.dir" We can easily print nested objects.
 *  6. "table" -> Print "array of objects", is a tabular form.
 *  7. ".time/timeEnd" -> console.time("key"), console.timeEnd("key") -> It will give how much time it takes to run the between program
 *  8. ".count" -> Print how many time this console ran.
 */

import fs from "node:fs";
import path from "node:path";
import { Console } from "node:console";

// "dir"
const response = { data: { user: { id: 1, roles: ["admin"] } } };
console.dir(response);

// table
const users = [
  { name: "Ali", role: "admin" },
  { name: "Sara", role: "editor" },
  { name: "Reza", role: "viewer" },
];

/*
┌───┬──────┬────────┐
│   │ name │ role   │
├───┼──────┼────────┤
│ 0 │ Ali  │ admin  │
│ 1 │ Sara │ editor │
│ 2 │ Reza │ viewer │
└───┴──────┴────────┘
*/
console.table(users);

// time/timeEnd
console.time("how long???");
for (let i = 0; i < 999999; i++) {
  const x = i + 10000;
}
console.timeEnd("how long???");

// Console class
const output = fs.createWriteStream(path.join(__dirname, "output-logs.log"));

const logger = new Console({
  stdout: output,
});

logger.log("[Log] Send the request.....");
logger.log("[Log]Getting the response....");

logger.error("[Error] Here's the first error");
logger.warn("[Warn] Here's the first error");

logger.table(users);
