// Copyright (c) 2021 Saddam M. All rights reserved.
// @ts-nocheck
import {
  ParseOptions,
  Module,
  Identifier,
  NumericLiteral,
  VariableDeclaration,
  parseSync,
} from "@swc/core";
import { CallExpression, Expression } from "@swc/core";
import SWCVisitor from "@swc/core/Visitor.js";
import {
  interop_mapSpanToLocObject,
  interop_morphIdentifier,
} from "./helpers.js";
// @ts-ignore
import { transformFromAstSync } from "@babel/core";
// import { BabelConfig } from "@babel/types";

export interface InteropConfig {
  swc?: ParseOptions;
  babel?: any;
}

const { default: Visitor } = SWCVisitor;

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

export function transformSync(
  src: string,
  options: InteropConfig = {}
): string {
  const ast = parseSync(src, options.swc);
  new InteropVisitor().visitProgram(ast);
  ast.type = "Program";
  interop_mapSpanToLocObject(ast);
  // console.log(ast.body[0].declarations);
  const { code } = transformFromAstSync(ast, options.babel);
  return "output";
}
