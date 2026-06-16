import test from "node:test";
import assert from "node:assert/strict";
import {
  ARCHITECTURE_BLOCKS,
  MONOREPO_BOUNDARIES,
  POSITIONING_CLAIM,
  architectureBlockIds,
  getArchitectureBlock,
  listMonorepoPaths,
  validateArchitectureBlueprint,
} from "../src/data-cloud-blueprint.mjs";

test("locks the Data Cloud Agents architecture sequence", () => {
  assert.deepEqual(architectureBlockIds(), [
    "work-intake",
    "data-contracts",
    "mcp-tool-layer",
    "async-data-worker",
    "agent-runtime",
    "evaluation-gates",
    "operator-console",
    "observability",
    "security-sanitization",
    "release-handoff",
  ]);
});

test("keeps every dependency pointed at an earlier architecture block", () => {
  const validation = validateArchitectureBlueprint();

  assert.equal(validation.valid, true, validation.errors.join("\n"));
});

test("documents evidence for each architecture block", () => {
  for (const block of ARCHITECTURE_BLOCKS) {
    assert.ok(block.title);
    assert.ok(block.owns);
    assert.ok(block.evidence.length >= 2, `${block.id} needs reviewable evidence.`);
  }
});

test("defines public monorepo boundaries for the first scaffold", () => {
  assert.deepEqual(listMonorepoPaths(), [
    "apps/console",
    "services/mcp-gateway",
    "services/data-worker",
    "packages/protos",
    "packages/agents",
    "packages/evals",
    "tools/build",
    "tools/quality",
  ]);

  assert.deepEqual(MONOREPO_BOUNDARIES.services["mcp-gateway"].primaryBlocks, [
    "mcp-tool-layer",
    "agent-runtime",
  ]);
});

test("keeps Google-style positioning honest", () => {
  assert.match(POSITIONING_CLAIM.safe, /not a claim of direct Google3 access/i);
  assert.match(POSITIONING_CLAIM.honestAlternative, /public AI\/data monorepo/i);
  assert.throws(() => getArchitectureBlock("google3-internal-runtime"), /Unknown architecture block/);
});
