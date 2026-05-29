# LangSmith Hyper-Granular Agent Trace Querying

How granularly can LangSmith agent traces be queried today, especially when traces contain nested agents, subagents, tool calls, and deep parent/child run trees?

Short answer: very granularly, with one important boundary. LangSmith exposes server-side filters for root runs, child runs, tree membership, metadata, run type, and selected run fields. Exact depth predicates and arbitrary hydrated JSON-path predicates can be computed locally after loading the full trace tree.

This repo is an evidence-backed investigation, not a general agent demo. It is written for people building or evaluating agent observability workflows, including the teams and ecosystems around [LangChain](https://www.langchain.com/) and [Blitzy](https://blitzy.com/). The useful part is the boundary line: what can be queried server-side today, what can be proved from hydrated traces, and what would need first-class product support to become native search.

## What This Proves

- Direct child-run lookup via `parentRunId`.
- Root-run filtering via `traceFilter`.
- Any-run-in-tree filtering via `treeFilter`.
- Run selection by run type, including `llm`, `chain`, and `tool`.
- Metadata filtering for scenario IDs and run IDs.
- Full trace hydration with child runs loaded.
- Local `min_depth` / `max_depth` analysis over hydrated trace trees.
- Tool-call evidence detection in LLM outputs and tool runs.
- DeepAgents traces with meaningful nested parent/child structure.

## Evidence Snapshot

Live proof was recorded against official OpenAI and real LangSmith tracing:

```text
run_id: redacted-live-suite-run-id
project: langsmith-hyper-granular-agent-trace-querying
project_id: redacted-langsmith-project-id
workspace_id: redacted-langsmith-workspace-id
target: https://api.openai.com/v1
model: gpt-5.5
status: passed
```

Scenario coverage:

| Scenario | Result | Evidence |
| --- | --- | --- |
| OpenAI SDK Chat Completions tool call | passed | LLM run present; tool-call evidence found |
| OpenAI SDK Chat Completions streaming tool call | passed | Incremental stream timing; tool-call evidence found |
| OpenAI SDK Responses structured output | passed | LLM run present; structured output parsed |
| OpenAI SDK Responses streaming text | passed | Incremental stream timing; completion event observed |
| LangChain `ChatOpenAI` tool trace | passed | `max_depth=1`, LLM child selected, tool-call evidence found |
| DeepAgents nested trace | passed | `max_depth=5`, `llm_run_count=4`, `tool_run_count=3` |

## Repo Map

- [EVIDENCE.md](EVIDENCE.md): capability matrix and live trace evidence.
- [docs/scope-and-limits.md](docs/scope-and-limits.md): exact server-side versus hydrated-local boundary.
- [docs/reproducibility.md](docs/reproducibility.md): how to rerun the examples and regenerate reports.
- [examples/](examples/): minimal OpenAI SDK, LangChain, DeepAgents, and LangSmith-query scripts.
- [reports/](reports/): redacted live reports and official OpenAI golden fixtures.
- [upstream/](upstream/): optional PR body drafts and patch artifacts for LangSmith CLI/docs follow-up work.

## Quick Start

```bash
cp .env.example .env
npm install
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

Add `OPENAI_API_KEY` and `LANGSMITH_API_KEY` to `.env`, then run the examples:

```bash
npm run example:openai
npm run example:langchain
npm run example:query
python examples/deepagents_nested_trace.py
```

## Scope

This repo does not claim that every hydrated field is natively indexed in hosted LangSmith search. It demonstrates the maximum practical query granularity available from public LangSmith/LangChain surfaces today:

- Server-side filtering where LangSmith exposes query arguments.
- Local analysis where the data is available after trace hydration.
- Clear product follow-up candidates for native exact-depth and arbitrary JSON-path search.
