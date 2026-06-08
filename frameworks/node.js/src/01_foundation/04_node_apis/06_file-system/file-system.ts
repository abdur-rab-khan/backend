import { existsSync, readdir, readdirSync, statSync } from "node:fs";
import path from "node:path";

const CURRENT_PATH = path.resolve(__dirname, "../../../../");

console.log(readdirSync(CURRENT_PATH));
