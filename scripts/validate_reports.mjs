import { readFile } from "node:fs/promises";

const reportPaths = [
  "reports/handoff-contract-report.redacted.json",
  "reports/openai-live-official.golden.redacted.json",
  "reports/official-openai-golden-summary.redacted.json",
  "reports/version-audit-2026-06-01.json",
  "reports/langsmith-depth-filter-check-2026-06-01.redacted.json",
];

for (const path of reportPaths) {
  const parsed = JSON.parse(await readFile(path, "utf8"));
  if (!parsed || typeof parsed !== "object") {
    throw new Error(`${path} did not parse to an object`);
  }
  console.log(`${path} ok`);
}
