// @ts-nocheck
import { test } from "uvu";
// import * as assert from "uvu/assert";
import { transformSync } from "../src/index.js";

const src = `const a = 5;
console.log(a);`;

test("can interoperate ASTs", () => {
  transformSync(src, {});
  // assert.is(add(2, 2), 5);
});

test.run();
