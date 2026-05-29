# Reproducibility

## Environment

Copy `.env.example` to `.env` and set:

- `OPENAI_API_KEY`
- `LANGSMITH_API_KEY`
- `LANGSMITH_PROJECT`

The examples use official OpenAI and LangSmith credentials.

## Node Examples

Install dependencies:

```bash
npm install
```

Run:

```bash
npm run example:openai
npm run example:langchain
npm run example:query
npm run check:reports
```

## Python DeepAgents Example

Install dependencies:

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

Run:

```bash
python examples/deepagents_nested_trace.py
```

## Reading The Reports

The files under `reports/` are redacted, machine-readable evidence snapshots. They preserve:

- scenario IDs,
- OpenAI request/response contract shapes,
- stream event/timing summaries,
- redacted LangSmith root run references,
- run counts,
- depth summaries,
- tool-call evidence summaries.

They intentionally do not include API keys, raw credentials, or provider-sensitive response bodies.
