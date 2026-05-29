import "dotenv/config";
import { Client } from "langsmith";

const client = new Client({
  apiKey: process.env.LANGSMITH_API_KEY,
  apiUrl: process.env.LANGSMITH_ENDPOINT || "https://api.smith.langchain.com",
});

const projectName =
  process.env.LANGSMITH_PROJECT ||
  "langsmith-hyper-granular-agent-trace-querying";

const roots = [];
for await (const run of client.listRuns({
  projectName,
  executionOrder: 1,
  limit: 10,
})) {
  roots.push(run);
}

function walk(run, depth = 0, rows = []) {
  rows.push({
    id: run.id,
    name: run.name,
    run_type: run.run_type,
    depth,
    parent_run_id: run.parent_run_id,
    child_count: run.child_runs?.length ?? 0,
  });

  for (const child of run.child_runs ?? []) {
    walk(child, depth + 1, rows);
  }

  return rows;
}

const summaries = [];
for (const root of roots.slice(0, 5)) {
  const hydrated = await client.readRun(root.id, { loadChildRuns: true });
  const rows = walk(hydrated);
  summaries.push({
    trace_id: hydrated.trace_id ?? hydrated.id,
    root_id: hydrated.id,
    root_name: hydrated.name,
    run_count: rows.length,
    max_depth: Math.max(...rows.map((row) => row.depth)),
    run_types: [...new Set(rows.map((row) => row.run_type))].sort(),
  });
}

console.log(JSON.stringify(summaries, null, 2));
