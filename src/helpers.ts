// Copyright (c) 2021 Saddam M. All rights reserved.
// This module defines AST morphing helpers.
import { Module, HasSpan, Identifier } from "@swc/core";
// @ts-ignore
import BabelTraverse from "@babel/traverse";
import * as t from "@babel/types";

const { default: traverse } = BabelTraverse;

export function interop_mapSpanToLocObject(node: HasSpan) {
  const { start, end } = node.span;

  (node as any).loc = {
    start: { line: 0, column: start },
    end: { line: 0, column: end },
  };

  delete (node as any).span;
}

export function interop_reverseLocObjectToSpan(node: any) {
  if (node.loc) {
    const {
      start: { line: start },
      end: { line: end },
    } = node.loc;
    node.span = { start, end, ctxt: 0 };
    delete node.loc;
  }
}

export function interop_morphIdentifier(ident: Identifier) {
  (ident as any).name = ident.value;
  delete (ident as any).value;
}

export function interop_reverseMorphedIdentifier(ident: t.Identifier) {
  (ident as any).value = ident.name;
  // delete (ident as any).name;
}

// @babel/core has a more deeper implementation.
export function interop_traverseAST(ast: Module, plugins: Function[]) {
  for (const plugin of plugins) {
    const { visitor } = plugin({ t, traverse });
    traverse(ast, visitor);
  }
}

export function interop_reverseAST(ast: Module): Module {
  interop_traverseAST(ast, [
    () => ({
      visitor: {
        enter(path: any) {
          console.log(path.node.type);
          interop_reverseLocObjectToSpan(path.node);
        },
        Program(path: any) {
          path.type = path.node.type = "Module";
        },
        Identifier(path: any) {
          interop_reverseMorphedIdentifier(path.node);
        },
      },
    }),
  ]);

  return ast;
}
