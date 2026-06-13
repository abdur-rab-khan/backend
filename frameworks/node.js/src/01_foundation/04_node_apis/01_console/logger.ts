import ConsoleModule = require("node:console");
const { Console } = ConsoleModule;
import fs = require("node:fs");
import path = require("path");

const currentPath = module.path;
const output = fs.createWriteStream(path.join(currentPath, "stdout.log"));
const error = fs.createWriteStream(path.join(currentPath, "stderr.log"));

const logger = new Console({
  stdout: output,
  stderr: error,
});

logger.log("Start");
logger.log("Hello world");
logger.log("Hello world");
logger.log("Hello world");
logger.log("Hello world");
logger.log("Hello world");
logger.log("Hello world");
logger.log("End");

logger.trace("Here's the issue");
logger.warn("It's warning man");

logger.error("First error is here");
logger.error("second error is here");
logger.error("third error is here");

logger.log(process.env);
