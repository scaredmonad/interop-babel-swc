// Copyright (c) 2021 Saddam M. All rights reserved.
// @ts-nocheck
import {
  ParseOptions,
  Module,
  Identifier,
  NumericLiteral,
  VariableDeclaration,
  parseSync,
  transformSync as transformMorphedAST,
} from "@swc/core";
import { CallExpression, Expression } from "@swc/core";
import SWCVisitor from "@swc/core/Visitor.js";
import {
  interop_mapSpanToLocObject,
  interop_morphIdentifier,
} from "./helpers.js";
// @ts-ignore
import BabelTraverse from "@babel/traverse";
import * as t from "@babel/types";

export interface InteropConfig {
  swc?: ParseOptions;
  babel?: any;
}

const { default: Visitor } = SWCVisitor;
const { default: traverse } = BabelTraverse;

class InteropVisitor extends Visitor {
  // Refer to https://github.com/swc-project/plugin-strip-console/issues/2
  visitVariableDeclaration(v: VariableDeclaration): VariableDeclaration {
    interop_mapSpanToLocObject(v);
    return super.visitVariableDeclaration(v);
  }

  visitIdentifier(ident: Identifier): Identifier {
    interop_mapSpanToLocObject(ident);
    interop_morphIdentifier(ident);
    return ident;
  }

  visitNumericLiteral(lit: NumericLiteral): NumericLiteral {
    interop_mapSpanToLocObject(lit);
    return lit;
  }

  visitExpressionStatement(e: ExpressionStatement) {
    interop_mapSpanToLocObject(e);
    return e;
  }
}

// @babel/core has a more deeper implementation.
function traverseAST(ast: Module, plugins: Function[]) {
  for (const plugin of plugins) {
    const { visitor } = plugin({ t, traverse });
    traverse(ast, visitor);
  }
}

export function transformSync(
  src: string,
  options: InteropConfig = {}
): string {
  // Phase 1: Parsing.
  const ast = parseSync(src, options.swc);
  new InteropVisitor().visitProgram(ast);
  ast.type = "Program";
  interop_mapSpanToLocObject(ast);
  // console.log(ast.body[0].declarations);
  // /!\ Take note of the order of parameters. Silent errors are imminent.
  // const { ast } = transformFromAstSync(ast, src, options.babel);

  // Phase 2: AST Traversal.
  if (options.babel && options.babel.plugins) {
    traverseAST(t.file(ast), options.babel.plugins);
  }

  // console.log(ast.body[0].declarations);

  // Phase 3: Code generation.
  // const reversedAST = interop_reverseAST(ast);
  // const { code } = transformMorphedAST(reversedAST, options.swc);
  // console.log(code);

  return "output";
}
