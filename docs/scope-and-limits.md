# Scope And Limits

## Server-Side Querying

LangSmith supports several query surfaces that are useful for agent trace inspection:

- `parentRunId`: select direct children of a run.
- `traceFilter`: filter root runs in a trace.
- `treeFilter`: filter traces where any run in the tree matches.
- Run filters: select by run type, status, metadata, time range, tags, and other exposed fields.
- System metadata filters: select exact run depth with `ls_run_depth`, including trace-level containment queries through `treeFilter`.
- Field selection: request the returned run fields needed for downstream analysis.

These are the right tools when the predicate can be expressed in the LangSmith query DSL or query parameters.

## Hydrated Local Analysis

Some useful debugging questions are better expressed after loading the trace tree:

- What is the maximum trace depth?
- Which hydrated `inputs`, `outputs`, `extra`, or provider-specific tool-call fields match a nested JSON path?
- Which exact path through the returned tree led to a matching run?
- Where do parent/child relationships differ from the expected agent topology?

For those cases, query a candidate set server-side, hydrate the trace tree, then compute exact predicates locally.

## Current Boundary

The evidence in this repo supports this practical boundary:

- LangSmith can find root runs, child runs, exact-depth runs, and traces containing matching tree members server-side.
- LangSmith returns enough run/tree data to compute aggregate depth summaries, exact tree paths, and arbitrary field-path predicates locally.
- Arbitrary hydrated JSON-path search and richer compound predicates over returned trace-tree payloads would require additional hosted indexing or query semantics if they should move from local analysis into first-class search.

That boundary is useful. It keeps the current workflow honest while pointing directly at possible product improvements.
