import path from "path";

const p = "/uploads/images/photo.jpg";

// 👉 Node.js gives some methods to get information about file like "filename", "basename", "extension name", "directory where file is there"
console.log("Base name is: ", path.basename(p)); // --> photo.jpg
console.log("Base name without extension: ", path.basename(p, ".jpg")); // --> photo
console.log("File directory name: ", path.dirname(p)); // --> "/uploads/images"
console.log("File extension name: ", path.extname(p)); // --> ".jpg"
