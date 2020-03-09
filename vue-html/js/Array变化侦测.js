const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse"
];

methodsToPatch.forEach(method => {
  const original = arrayMethods[method];
  Object.defineProperty(arrayMethods, method, {
    enumerable: false,
    configurable: true,
    writable: true,
    value(...args) {
      const result = original.apply(this, args);
      return result;
    }
  });
});

const arr1 = [];
arr1.push(123);
console.log(arr1);

// const obj1 = {}
// Object.defineProperty(obj1, "age", {
//   value: 26,
//   // writable: true          // 是否可改变
//   // configurable: true      // 是否可配置，删除
//   enumerable: false          // 是否可枚举
// })
// delete obj1.age
// console.log(obj1)
