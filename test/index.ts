// @ts-nocheck
import { readFileSync } from "fs";
import { test } from "uvu";
// import * as assert from "uvu/assert";
import { transformSync } from "../src/index.js";
import { transformSync as babel_transformSync, parseSync } from "@babel/core";

// test("benchmark", benchmark);
test("can interoperate", () => {
  // console.log(JSON.stringify(parseSync(readFileSync("./fixtures/basic.js").toString(), null, 2)))
  const out = transformSync(readFileSync("./fixtures/basic.js").toString(), {
    babel: {
      plugins: [loggerPluggin, renameIdentifiersPlugin],
    },
  });
  console.log(out && out.code);
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
        console.log(path.parent.type);
        path.node.name = path.node.name.split("").reverse().join("");
      },
    },
  };
}
