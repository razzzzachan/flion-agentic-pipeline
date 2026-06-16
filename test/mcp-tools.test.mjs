import test from "node:test";
import assert from "node:assert/strict";
import { createDemoDataset } from "../src/demo-dataset.mjs";
import { createDataCloudToolRegistry } from "../src/mcp-tools.mjs";
import { DataCloudWorker } from "../src/data-worker.mjs";

test("lists MCP-style public tools", () => {
  const registry = createDataCloudToolRegistry({ dataset: createDemoDataset() });

  assert.deepEqual(registry.listTools().map((tool) => tool.name), [
    "validate_sql",
    "query_dataset",
    "semantic_search",
    "generate_sample_code",
    "record_evidence",
  ]);
});

test("queries the dataset through a safe tool", () => {
  const registry = createDataCloudToolRegistry({ dataset: createDemoDataset() });
  const result = registry.executeTool("query_dataset", {
    sql: "SELECT account, risk FROM accounts WHERE risk = 'high' LIMIT 2",
  });

  assert.equal(result.ok, true, result.errors.join("\n"));
  assert.equal(result.data.rowCount, 1);
  assert.deepEqual(result.data.rows[0], { account: "Cobalt Realty", risk: "high" });
});

test("blocks unsafe dataset queries", () => {
  const registry = createDataCloudToolRegistry({ dataset: createDemoDataset() });
  const result = registry.executeTool("query_dataset", {
    sql: "SELECT * FROM accounts; DROP TABLE accounts",
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /semicolons|read-only/i);
});

test("runs async worker jobs with result envelopes", async () => {
  const registry = createDataCloudToolRegistry({ dataset: createDemoDataset() });
  const worker = new DataCloudWorker({ toolRegistry: registry });
  const job = worker.enqueue("validate_sql", {
    sql: "SELECT account, arr_usd FROM accounts LIMIT 2",
  });

  const completed = await worker.runJob(job.id);

  assert.equal(completed.status, "succeeded");
  assert.equal(completed.result.ok, true);
  assert.equal(completed.result.kind, "sql_validation");
});
