// @ts-nocheck
import { test } from "uvu";
// import * as assert from "uvu/assert";
import { transformSync } from "../src/index.js";
import { transformSync as babel_transformSync } from "@babel/core";

const src = `const a = [0, 1, 2]; a.push({ alert });`;

// test("benchmark", benchmark);
test("can interoperate", () => {
  transformSync(src, {
    babel: {
      plugins: [loggerPluggin, renameIdentifiersPlugin],
    },
  });
});

test.run();

function benchmark() {
  const ITERATIONS = 10_000;
  console.time("Babel");
  for (let i = 0; i < ITERATIONS; i++) {
    babel_transformSync(src, {
      plugins: [loggerPluggin, renameIdentifiersPlugin],
    });
  }
  console.timeEnd("Babel");

  console.time("Interop");
  for (let i = 0; i < ITERATIONS; i++) {
    transformSync(src, {
      babel: {
        plugins: [loggerPluggin, renameIdentifiersPlugin],
      },
    });
  }
  console.timeEnd("Interop");
}

function loggerPluggin(babel: any) {
  const { types: t, traverse } = babel;

  return {
    name: "babel-plugin-logger",
    visitor: {
      Program(path) {
        // console.log("Traversed.");
      },
    },
  };
}

function renameIdentifiersPlugin(babel: any) {
  const { types: t, traverse } = babel;

  return {
    name: "babel-plugin-rename-identifiers",
    visitor: {
      Identifier(path: any) {
        path.node.name = path.node.name.split("").reverse().join("");
      },
    },
  };
}
