import { dateSame } from "./moreDateFunctions.js";

const obj = {
  key1: {
    key1a: {
      key1a1: 2,
      key1a2: 3,
    },
    key2b: { key2b1: 4, key2b2: 5 },
  },
  key2: 6,
  key3: { key3a: { key3a1: { key3a1a: 9 } } },
};

function read(obj) {
  for (const [key, val] of Object.entries(obj)) {
    console.log(key);
    read(obj[key]);
  }
}
console.log(obj);
console.log("-----------------STARTING");
read(obj);
console.log("-----------------FINISHED");



