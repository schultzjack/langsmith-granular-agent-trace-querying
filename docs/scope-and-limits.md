# Scope And Limits

## Server-Side Querying

LangSmith supports several query surfaces that are useful for agent trace inspection:

- `parentRunId`: select direct children of a run.
- `traceFilter`: filter root runs in a trace.
- `treeFilter`: filter traces where any run in the tree matches.
- Run filters: select by run type, status, metadata, time range, tags, and other exposed fields.
- Field selection: request the returned run fields needed for downstream analysis.

These are the right tools when the predicate can be expressed in the LangSmith query DSL or query parameters.

## Hydrated Local Analysis

Some useful debugging questions are better expressed after loading the trace tree:

- What is the maximum trace depth?
- Which traces contain a depth-3 agent or subagent span?
- Which hydrated `inputs`, `outputs`, `extra`, or provider-specific tool-call fields match a nested JSON path?
- Where do parent/child relationships differ from the expected agent topology?

For those cases, query a candidate set server-side, hydrate the trace tree, then compute exact predicates locally.

## Current Boundary

The evidence in this repo supports this practical boundary:

- LangSmith can find root runs, child runs, and traces containing matching tree members server-side.
- LangSmith returns enough run/tree data to compute exact depth and arbitrary field-path predicates locally.
- Native exact-depth search and arbitrary hydrated JSON-path search would require additional hosted indexing or query semantics.

That boundary is useful. It keeps the current workflow honest while pointing directly at possible product improvements.
