// Copyright (c) 2021 Saddam M. All rights reserved.
// @ts-nocheck
import { Module, ParseOptions, parseSync } from "@swc/core";
import { CallExpression, Expression } from "@swc/core";
import SWCVisitor from "@swc/core/Visitor.js";
// @ts-ignore
import { transformFromAst } from "@babel/core";
// import { BabelConfig } from "@babel/types";

export interface InteropConfig {
  swc?: ParseOptions;
  babel?: any;
}

const { default: Visitor } = SWCVisitor;

class InteropVisitor extends Visitor {
  visitModule(m: Module) {
    // Step 1: Set type from "Module" to "Program" (standalone scripts).
    m.type = "Program";
  }
}

export function transformSync(
  src: string,
  options: InteropConfig = {}
): string {
  const ast = parseSync(src, options.swc);
  new InteropVisitor().visitProgram(ast);
  console.log(ast);
  // const output = transformFromAst(ast, options.babel || {});
  return "output";
}
