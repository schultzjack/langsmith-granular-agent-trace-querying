import os

from dotenv import load_dotenv
from deepagents import create_deep_agent

load_dotenv()

os.environ.setdefault("LANGSMITH_TRACING", "true")
os.environ.setdefault(
    "LANGSMITH_PROJECT", "langsmith-hyper-granular-agent-trace-querying"
)


def lookup_trace_contract(query: str) -> str:
    """Return a tiny trace-querying fact for the agent to use."""

    return f"LangSmith trace query note for {query}: use ls_run_depth for exact depth, then hydrate child runs for arbitrary field checks."


agent = create_deep_agent(
    tools=[lookup_trace_contract],
    instructions=(
        "Use the lookup_trace_contract tool, then summarize how nested trace depth "
        "can be inspected in LangSmith."
    ),
)

result = agent.invoke(
    {
        "messages": [
            {
                "role": "user",
                "content": "Inspect how a depth-2 subagent trace could be found.",
            }
        ]
    }
)

print(result)
