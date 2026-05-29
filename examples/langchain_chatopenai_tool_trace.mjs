import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const lookupTraceContract = tool(
  async ({ query }) => `trace contract lookup: ${query}`,
  {
    name: "lookup_trace_contract",
    description: "Look up trace contract details.",
    schema: z.object({
      query: z.string(),
    }),
  }
);

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL || "gpt-5.5",
  apiKey: process.env.OPENAI_API_KEY,
}).bindTools([lookupTraceContract], {
  tool_choice: "lookup_trace_contract",
});

const result = await model.invoke(
  "Call lookup_trace_contract with query 'langsmith trace depth'."
);

console.log(
  JSON.stringify(
    {
      content: result.content,
      tool_calls: result.tool_calls?.map((call) => ({
        name: call.name,
        args_shape: Object.fromEntries(
          Object.entries(call.args ?? {}).map(([key, value]) => [
            key,
            typeof value,
          ])
        ),
      })),
    },
    null,
    2
  )
);
