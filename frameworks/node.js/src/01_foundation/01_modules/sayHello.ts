// It's good, when we want to export a single function, class, objects etc.
// Actually, module.exports is an "OBJECT", using it we can export things.
// If we directly override "module.exports" mean when we add "require('file_name')" instead of returning object it directly give function.
module.exports = function sayHello() {
  console.log("Hello");
};
