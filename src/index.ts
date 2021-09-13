// Copyright (c) 2021 Saddam M. All rights reserved.
// @ts-nocheck
import {
  ParseOptions,
  Module,
  Identifier,
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
  visitIdentifier(ident: Identifier): Identifier {
    interop_mapSpanToLocObject(ident);
    interop_morphIdentifier(ident);
    return ident;
  }

  visitBlockStatement(stmt: BlockStatement): BlockStatement {
    interop_mapSpanToLocObject(stmt);
    stmt.body = stmt.stmts;
    // @TODO: At another stage, use a custom visitor for block
    // statements that maps `stmt.body` instead of `stmt.stmts`.
    // delete stmt.stmts;
    return super.visitBlockStatement(stmt);
  }

  visitCallExpression(expr: CallExpression): CallExpression {
    interop_mapSpanToLocObject(expr);
    expr.callee = super.visitExpression(expr.callee);
    expr.arguments = expr.arguments.map((arg: any) =>
      super.visitExpression(arg.expression)
    );

    return expr;
  }

  constructor() {
    super();

    const identicalImplNodes = [
      "AssignmentExpression",
      "IfStatement",
      "BinaryExpression",
      "NumericLiteral",
      "VariableDeclaration",
      "MemberExpression",
      "ObjectExpression",
    ];

    for (const tt of identicalImplNodes) {
      this[`visit${tt}`] = (node: any): any => {
        interop_mapSpanToLocObject(node);
        // Refer to https://github.com/swc-project/plugin-strip-console/issues/2
        return super[`visit${tt}`](node);
      };
    }
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
  // console.log(ast.body[0].expression);
  // return;
  ast = t.file(ast);

  // Phase 2: AST Traversal.
  if (options.babel && options.babel.plugins) {
    interop_traverseAST(ast, options.babel.plugins);
  }

  // Phase 3: Code generation.
  interop_reverseAST(ast.program);
  interop_reverseLocObjectToSpan(ast.program);
  // console.log(JSON.stringify(ast.program, null, 2));
  ast.program.type = "Module";
  const { code } = transformMorphedAST(ast.program, options.swc);
  console.log(code);

  return "output";
}
