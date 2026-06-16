import test from "node:test";
import assert from "node:assert/strict";
import { runDataCloudAgentsDemo } from "../src/data-cloud-demo.mjs";

test("runs the Data Cloud Agents demo end to end", async () => {
  const result = await runDataCloudAgentsDemo();

  assert.equal(result.finalWorkItem.stage, "release");
  assert.equal(result.verification.passed, true);
  assert.equal(result.finalWorkItem.evidence.release.releaseNote.value.ready, true);
  assert.equal(result.finalWorkItem.handoffs.length, 5);
});

test("preserves evidence across every pipeline stage", async () => {
  const result = await runDataCloudAgentsDemo();
  const evidence = result.finalWorkItem.evidence;

  assert.ok(evidence.scope.acceptanceCriteria);
  assert.ok(evidence.solution.workflowDecision);
  assert.ok(evidence.architecture.technicalContract);
  assert.ok(evidence.implementation.implementationArtifact);
  assert.ok(evidence.qa.verificationResult);
  assert.ok(evidence.release.releaseNote);
});
