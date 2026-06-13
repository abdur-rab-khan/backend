// To export multiple things we need to do like this:
function add(a: number, b: number) {
  return a + b;
}

function mul(a: number, b: number) {
  return a * b;
}

module.exports = {
  mul,
  add,
};
