function currie() {
  const fn = arguments[0];
  const arg = [].slice.call(arguments, 1);
  return function() {
    const newArg = [].slice.call(arguments);
    if (newArg.length) {
      return currie.apply(this, [fn, ...arg, ...newArg]);
    } else {
      return fn.apply(this, arg);
    }
  };
}

const add = currie((a, b, c) => a + b + c);

console.log(add(1)(2)(3)());
