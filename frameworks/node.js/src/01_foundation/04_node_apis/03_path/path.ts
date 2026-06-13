import path from "path";

// 👉 Helps to "join" multiple directory/file names into a path, It automatically handle "slash" based on "Operating System"
const configPath = path.join("users", "home", "project", "configuration"); // --> "/users/home/project/configuration"
console.log(configPath);

// 👉 It turn "relative path", into full "absolute path" starting from root of the system.
// 👉 We can also use "../../config", .resolve will automatically handle it.
const absPath = path.resolve(__dirname, "config"); // --> C:\Users\abdur\Developer\Learning\backend-dev\frameworks\node.js\src\01_foundation\04_node_apis\03_path\config
console.log("Absolute Path is: ", absPath);

// 👉 Node.js provides "two variable" in every file "__dirname" (Gives full directory path), "__filename" (Gives full directory path with filename).
// 👉 With import/export we can access using "import.meta.path","import.meta.url"
console.log("Current Path is: ", __dirname);
console.log("Current Path with filename is: ", __filename);

// 👉 parse in "node.js" is parse the path and return an object with all the details like "root", "ext", "name"
// 🟡 Using "format" we can build path from parsed object.
const parsed = path.parse("/src/utils/helper.ts");
console.log(parsed);

parsed.ext = ".js";
parsed.base = parsed.name + parsed.ext;
console.log("After changing the extension: ", path.format(parsed)); // --> /src/utils\helper.js

// 👉 It's used to generate a relative path from "one" path to "another"
const from = "/project/src/pages/home.js";
const to = "/project/src/utils/format.js";

path.relative(from, to); // '../utils/format.js'
