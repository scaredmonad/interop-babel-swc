// @ts-nocheck
import { test } from "uvu";
// import * as assert from "uvu/assert";
import { transformSync } from "../src/index.js";

const src = `const digit = 5;`;

function loggerPluggin(babel: any) {
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

test("can interoperate ASTs", () => {
  transformSync(src, {
    babel: {
      plugins: [loggerPluggin, renameIdentifiersPlugin],
    },
  });
});

test.run();
