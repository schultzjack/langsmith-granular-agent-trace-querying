# Document granular LangSmith CLI run querying

## Summary

- Documents `--include-all` in the LangSmith CLI page.
- Adds examples for querying trace-tree containment with `--tree-filter`.
- Adds examples for arbitrary-depth run and trace-tree queries with `--agent-type`, `--min-depth`, and hydrated JSON-path filters.
- Updates the CLI filter/detail flag tables with the new granular querying flags.

## Motivation

The companion CLI change adds hyper-granular run querying for agent traces, including hydrated run JSON, derived `depth`, and `agent_type` fields. This docs update keeps the public LangSmith CLI reference aligned with those flags and clarifies which filters run server-side versus client-side. It also notes that local depth, agent type, and field filters on `trace list` and `trace export` match any run in the trace tree.

## Companion CLI PR

This docs patch is intended to accompany the `langchain-ai/langsmith-cli` change titled:

`Add hyper-granular LangSmith run querying`

## Testing

```bash
git diff --check
```

The local checkout used for this patch was sparse, so a full docs build was not run locally.
