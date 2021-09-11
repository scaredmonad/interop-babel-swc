// @ts-nocheck
import { test } from "uvu";
// import * as assert from "uvu/assert";
import { transformSync } from "../src/index.js";

const src = `const a = 5;`;

function logger(babel: any) {
  const { types: t, traverse } = babel;

  return {
    name: "babel-plugin-logger",
    visitor: {
      Program(path) {
        console.log("Traversed.");
      },
    },
  };
}

test("can interoperate ASTs", () => {
  transformSync(src, {
    babel: {
      plugins: [logger],
    },
  });
  // assert.is(add(2, 2), 5);
});

test.run();
