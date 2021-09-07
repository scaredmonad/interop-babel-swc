# tsdev

**tsdev** is a minimal starter for Node libraries written in TypeScript that target ESM.

**tsdev** uses [esbuild](https://esbuild.github.io/) to compile and bundle the library (during the `build` command).

**tsdev** uses the [uvu](https://github.com/lukeed/uvu) testing library to run tests via [ts-node](https://typestrong.org/ts-node/).

**tsdev** uses [pnpm](https://pnpm.io/) for faster package management.

## Commands

### Installing

The development dependencies include `uvu`, `typescript`, `ts-node` and `@types/node`. I have esbuild installed globally to use across different projects.

```$
$ pnpm install
```

### Building

Runs esbuild on `./src/index.ts` and outputs to `./lib/index.js`.

```$
$ pnpm build
```

### Running tests

Runs ts-node on `./tests/index.ts` directly.

```$
$ pnpm test
```
