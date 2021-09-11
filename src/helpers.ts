// Copyright (c) 2021 Saddam M. All rights reserved.
// This module defines AST morphing helpers.
import { HasSpan, Identifier } from "@swc/core";

export function interop_mapSpanToLocObject(node: HasSpan) {
  const { start, end } = node.span;

  (node as any).loc = {
    start: { line: 0, column: start },
    end: { line: 0, column: end },
  };

  delete (node as any).span;
}

export function interop_morphIdentifier(ident: Identifier) {
  (ident as any).name = ident.value;
  delete (ident as any).value;
}
