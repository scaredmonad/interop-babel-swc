// @ts-ignore
import b from 'benny'
import { transformSync } from "../src/index.js";
// @ts-ignore
import { transformSync as babel_transformSync } from "@babel/core";

const code = `const a = 5; alert(5);`;

function loop(fn: Function, iterations: number = 100) {
  for (let i = 0; i < iterations; i++) {
    fn();
  }
}

async function run() {
  await b.suite(
    'Compare post-optimized Babel transformations',
    b.add('babel', () => {
      loop(() => babel_transformSync(code))
    }),
    b.add('optimized-babel', () => {
      loop(() => transformSync(code))
    }),
    b.cycle(),
    b.complete(),
  )
}

run().catch((e) => {
  console.error(e)
})
