# Examples

These examples are intentionally small. They exist to show the client paths used by the evidence package, not to be a full application.

## Files

- `openai_chat_tool_trace.mjs`: official OpenAI SDK call wrapped for LangSmith tracing.
- `langchain_chatopenai_tool_trace.mjs`: LangChain `ChatOpenAI` tool binding.
- `deepagents_nested_trace.py`: DeepAgents run that produces nested traces.
- `query_langsmith_traces.mjs`: LangSmith query and hydrated tree summarization.

## Expected Environment

Use the root `.env.example` as the template.

The examples are designed for official OpenAI and LangSmith credentials. They do not require local development services.
