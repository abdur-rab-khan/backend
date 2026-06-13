/*
    1. If during export "module.exports = fn" means it directly give us function. "const fn = require('path')".
    2. If during export "module.exports.add = () => 1 or modules.exports = { fn1, fn2 }", means it directly give us object of functions.
*/
const sayHello = require("./sayHello");
const math = require("./math");
const { add, x } = require("./numbers");

sayHello();

console.log(math.add(2, 2));
console.log(math.mul(2, 2));
console.log(add());
console.log(x());
console.log("Module id is: ", module.filename); // Path of current file.
console.log(
  "Childrens: ",
  module.children.map((c, idx) => `${idx + 1} --> ${c.filename}`).join("\n"),
); // Returns the list of modules that's required in the current file.
