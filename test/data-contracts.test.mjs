import test from "node:test";
import assert from "node:assert/strict";
import { createDemoDataset } from "../src/demo-dataset.mjs";
import { validateDatasetSpec, validateSafeSql } from "../src/data-contracts.mjs";

test("accepts the public demo dataset contract", () => {
  const result = validateDatasetSpec(createDemoDataset());

  assert.equal(result.valid, true, result.errors.join("\n"));
});

test("rejects mutating SQL", () => {
  const result = validateSafeSql("DROP TABLE accounts", createDemoDataset());

  assert.equal(result.valid, false);
  assert.match(result.errors.join(" "), /read-only SELECT|start with SELECT/i);
});

test("rejects unknown columns", () => {
  const result = validateSafeSql("SELECT private_email FROM accounts LIMIT 5", createDemoDataset());

  assert.equal(result.valid, false);
  assert.match(result.errors.join(" "), /Unknown column private_email/);
});

test("parses a safe bounded SELECT statement", () => {
  const result = validateSafeSql(
    "SELECT account, arr_usd FROM accounts WHERE risk = 'high' LIMIT 1",
    createDemoDataset(),
  );

  assert.equal(result.valid, true, result.errors.join("\n"));
  assert.deepEqual(result.statement.columns, ["account", "arr_usd"]);
  assert.deepEqual(result.statement.where, { column: "risk", value: "high" });
  assert.equal(result.statement.limit, 1);
});
