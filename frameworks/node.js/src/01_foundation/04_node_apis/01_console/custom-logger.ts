import { Console } from "console";
import { createWriteStream } from "fs";
import path from "path";

class CustomConsole extends Console {
  public constructor() {
    super({
      stdout: createWriteStream(path.resolve(__dirname, "output.log")),
      stderr: createWriteStream(path.resolve(__dirname, "error.log")),
    });
  }

  log(...data: any[]): void {
    Console.prototype.log.call(this, "[LOG] ", ...data);
  }

  error(...data: any[]): void {
    Console.prototype.error.call(this, "[ERROR] ", ...data);
  }

  warn(...data: any[]): void {
    Console.prototype.warn.call(this, "[WARN] ", ...data);
  }
}

const logger = new CustomConsole();

logger.log("Getting response from the server....");
logger.error("Something went wrong while getting the data from the server....");
logger.warn("There are some issue I'm facing right now.");
