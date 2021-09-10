// Copyright (c) 2021 Saddam M. All rights reserved.
import { Module, ParseOptions, parseSync } from "@swc/core";
// @ts-ignore
import { transformFromAst } from "@babel/core";
// import { BabelConfig } from "@babel/types";

export interface InteropConfig {
  swc?: ParseOptions;
  babel?: any;
}

export function interop(ast: Module): Module {
  console.log(ast);
  // Step 1: Set type from "Module" to "Program" (standalone scripts).
  (ast as any).type = "Program";
  // It is paramount to make a plugin that morphs the AST. The problem
  // lies with SWC planning to deprecate its ES plugin API for a Rust one.
  return ast;
}

export function transformSync(
  src: string,
  options: InteropConfig = {}
): string {
  const ast = parseSync(src, options.swc);
  const output = transformFromAst(interop(ast), options.babel || {});
  return output;
}
