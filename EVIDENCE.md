# Evidence

## Live LangSmith Run

The live proof used official OpenAI endpoints and real LangSmith tracing.

```text
status: passed
run_id: redacted-live-suite-run-id
project: langsmith-hyper-granular-agent-trace-querying
project_id: redacted-langsmith-project-id
workspace_id: redacted-langsmith-workspace-id
target: https://api.openai.com/v1
model: gpt-5.5
```

## Scenario Results

| Scenario | Status | Trace evidence |
| --- | --- | --- |
| OpenAI SDK Chat Completions tool call | passed | LLM run present; tool-call evidence present |
| OpenAI SDK Chat Completions streaming tool call | passed | LLM run present; incremental stream timing observed |
| OpenAI SDK Responses structured output | passed | LLM run present; structured final output parsed |
| OpenAI SDK Responses streaming text | passed | LLM run present; completion event observed |
| LangChain `ChatOpenAI` tool trace | passed | `max_depth=1`, LLM child selected, tool-call evidence present |
| DeepAgents nested trace | passed | `max_depth=5`, `llm_run_count=4`, `tool_run_count=3` |

## Query Capability Matrix

| Capability | Server-side LangSmith query | Hydrated local analysis | Evidence status |
| --- | --- | --- | --- |
| Direct child lookup | `parentRunId` | Not required | verified |
| Root-run selection | `traceFilter` | Not required | verified |
| Any-run-in-tree selection | `treeFilter` | Not required | verified |
| Run type filtering | `filter` / run fields | Optional | verified |
| Metadata filtering | `filter`, `traceFilter`, `treeFilter` | Optional | verified |
| Inputs and outputs inspection | Returned run fields | Field-path checks after hydration | verified |
| Tool-call evidence | Returned LLM outputs and tool runs | Normalization across providers | verified |
| Parent/child relationships | `parentRunId`, child runs | Tree traversal | verified |
| Max-depth/min-depth predicates | Not currently native as an exact depth operator | Computed from hydrated tree | verified locally |
| Arbitrary hydrated JSON-path predicates | Limited by indexed filter support | Computed from returned run JSON | verified locally |

## Scope Boundary

The evidence supports the trace-querying workflow directly. It does not claim that every possible hosted UI or backend index path already has a first-class exact-depth or arbitrary JSON-path filter. Those remain natural candidates for native LangSmith enhancements if the workflow should move from client-side analysis into hosted search.
