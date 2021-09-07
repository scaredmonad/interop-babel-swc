import { test } from "uvu";
import * as assert from "uvu/assert";
import { add } from "../src/index.js";

test("add()", () => {
  assert.is(add(2, 2), 4);
  // assert.is(add(2, 2), 5);
});

test.run();
