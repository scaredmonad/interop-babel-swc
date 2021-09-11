// Copyright (c) 2021 Saddam M. All rights reserved.
// @ts-nocheck
import {
  ParseOptions,
  Module,
  Identifier,
  NumericLiteral,
  VariableDeclaration,
  AssignmentExpression,
  parseSync,
  transformSync as transformMorphedAST,
} from "@swc/core";
import SWCVisitor from "@swc/core/Visitor.js";
import {
  interop_mapSpanToLocObject,
  interop_morphIdentifier,
  interop_traverseAST,
  interop_reverseAST,
  interop_reverseLocObjectToSpan,
} from "./helpers.js";
import * as t from "@babel/types";

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

  visitNumericLiteral(lit: NumericLiteral): NumericLiteral {
    interop_mapSpanToLocObject(lit);
    return lit;
  }

  visitAssignmentExpression(
    a_expr: AssignmentExpression
  ): AssignmentExpression {
    interop_mapSpanToLocObject(a_expr);
    return super.visitAssignmentExpression(a_expr);
  }

  visitExpressionStatement(expr: ExpressionStatement) {
    interop_mapSpanToLocObject(expr);
    return super.visitExpressionStatement(expr);
  }
}

export function transformSync(
  src: string,
  options: InteropConfig = {}
): string {
  // Phase 1: Parsing.
  let ast = parseSync(src, options.swc);
  new InteropVisitor().visitProgram(ast);
  ast.type = "Program";
  interop_mapSpanToLocObject(ast);
  // console.log(ast.body[1].expression);
  // return;
  ast = t.file(ast);

  // Phase 2: AST Traversal.
  if (options.babel && options.babel.plugins) {
    interop_traverseAST(ast, options.babel.plugins);
  }

  // Phase 3: Code generation.
  interop_reverseAST(ast.program);
  interop_reverseLocObjectToSpan(ast.program);
  ast.program.type = "Module";
  const { code } = transformMorphedAST(ast.program, options.swc);
  console.log(code);

  return "output";
}
