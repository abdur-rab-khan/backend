// Import object is a object that contains information about the current module, such as:
//  1. "dirname": The directory name of the current module.
//  2. "filename": The file name of the current module.
//  3. "main": A boolean value that indicates whether the current module is the main module.
//  4. "url": The URL of the current module.

console.log("Current module information:");
console.log("Directory name:", import.meta.dirname);
console.log("File name:", import.meta.filename);
console.log("Is main module:", import.meta.main);
console.log("Module URL:", import.meta.url);
