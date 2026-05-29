# Add hyper-granular LangSmith run querying

## Summary

- Adds `--include-all` to `run` and `trace` commands so callers can request all selectable run fields from the LangSmith API and emit the raw hydrated run JSON.
- Adds server-side passthrough filters for existing LangSmith query capabilities: `--parent-run-id`, `--trace-filter`, and `--tree-filter`.
- Adds client-side filters over hydrated runs for predicates that are not currently expressible in the server DSL: `--agent-type`, `--min-depth`, `--max-depth`, and repeatable `--field path=value`.
- Makes `trace list` and `trace export` apply those local depth/agent/path filters against any run in each candidate trace tree, so callers can find traces containing n-depth subagent spans.
- Adds derived JSON fields for hierarchy-oriented analysis: `run_id`, `depth`, and `agent_type`.
- Documents examples for querying nested agent/subagent runs and trace-tree containment.

## Motivation

LangSmith traces already contain enough public run data to support very granular agent debugging: parent/child relationships, `parent_run_ids`, `dotted_order`, `extra.metadata`, events, inputs, outputs, feedback stats, token/cost fields, and other selected fields. This change exposes those fields through the CLI and adds lightweight local filtering for arbitrary-depth run queries, including subagent spans tracked via `extra.metadata.ls_agent_type`.

The implementation keeps server-side filtering where LangSmith supports it (`filter`, `trace_filter`, `tree_filter`, `parent_run_id`) and only applies local filtering for hydrated field/depth predicates that the server query DSL does not currently cover.

## Example Usage

```bash
langsmith run list --project my-app --include-all --agent-type subagent --min-depth 3 --max-depth 3
langsmith run list --project my-app --include-all --field extra.metadata.phase=planning
langsmith trace list --project my-app --include-all --show-hierarchy --agent-type subagent --min-depth 2
langsmith trace list --project my-app --tree-filter 'eq(name, "RetrieveDocs")'
langsmith trace get <trace-id> --project my-app --include-all
```

## Testing

```bash
GOCACHE=/tmp/go-build GOMODCACHE=/tmp/go-mod-cache go test -count=1 ./...
GOCACHE=/tmp/go-build GOMODCACHE=/tmp/go-mod-cache go vet ./...
GOCACHE=/tmp/go-build GOMODCACHE=/tmp/go-mod-cache CGO_ENABLED=0 go build -o /tmp/langsmith-cli-build ./cmd/langsmith
GOCACHE=/tmp/go-build GOMODCACHE=/tmp/go-mod-cache golangci-lint run
git diff --check
```

Additional coverage included in `go test`:

- Unit coverage for all-field selection, derived hierarchy fields, local depth/agent/path filters, and trace-tree local filter splitting.
- HTTP command coverage for trace-tree containment filters.
- Fixture-backed e2e/golden coverage generated from the real Cobra root command and real LangSmith SDK client against a deterministic LangSmith-shaped `httptest` server, covering `run list`, `run export`, `trace list`, `trace list --show-hierarchy`, `trace export`, and emitted `/runs/query` request bodies.
