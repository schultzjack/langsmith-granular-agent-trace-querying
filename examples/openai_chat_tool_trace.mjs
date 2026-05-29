import "dotenv/config";
import OpenAI from "openai";
import { traceable } from "langsmith/traceable";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const model = process.env.OPENAI_MODEL || "gpt-5.5";

const invokeChatTool = traceable(
  async () =>
    client.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content:
            "Call lookup_trace_contract with query 'langsmith trace depth'. Do not answer directly.",
        },
      ],
      tool_choice: "required",
      parallel_tool_calls: false,
      tools: [
        {
          type: "function",
          function: {
            name: "lookup_trace_contract",
            description: "Look up trace contract details.",
            parameters: {
              type: "object",
              additionalProperties: false,
              required: ["query"],
              properties: {
                query: { type: "string" },
              },
            },
          },
        },
      ],
    }),
  {
    name: "openai_chat_tool_trace",
    run_type: "llm",
    metadata: {
      scenario: "openai-sdk-chat-tool",
    },
  }
);

const response = await invokeChatTool();

console.log(
  JSON.stringify(
    {
      object: response.object,
      finish_reason: response.choices?.[0]?.finish_reason,
      tool_calls: response.choices?.[0]?.message?.tool_calls?.map((call) => ({
        type: call.type,
        name: call.function?.name,
      })),
      usage_present: Boolean(response.usage),
    },
    null,
    2
  )
);
