import test from "node:test";
import assert from "node:assert/strict";
import { FlionPipeline } from "../src/pipeline.mjs";
import { buildLexicalIndex, search } from "../src/rag-index.mjs";

test("requires evidence before a handoff", () => {
  const pipeline = new FlionPipeline();
  const item = pipeline.createWorkItem({ id: "work_missing_evidence", title: "Missing evidence demo" });

  assert.throws(
    () => pipeline.proposeHandoff(item.id, "scope", "Ready for solution."),
    /Missing evidence for scope: acceptanceCriteria/,
  );
});

test("moves work item through an approved handoff", () => {
  const pipeline = new FlionPipeline();
  const item = pipeline.createWorkItem({ id: "work_scope_to_solution", title: "Scope handoff demo" });

  pipeline.addEvidence(item.id, "scope", "acceptanceCriteria", [
    "Document the workflow contract.",
    "Keep private runtime data out of the public artifact.",
  ]);

  const handoff = pipeline.proposeHandoff(item.id, "scope", "Scope is ready for solution design.");
  const updated = pipeline.approveHandoff(item.id, handoff.id, "solution");

  assert.equal(updated.stage, "solution");
  assert.equal(updated.handoffs[0].approved, true);
  assert.equal(updated.handoffs[0].approvedBy, "solution");
});

test("blocks self-approval", () => {
  const pipeline = new FlionPipeline();
  const item = pipeline.createWorkItem({ id: "work_self_approval", title: "Self approval demo" });

  pipeline.addEvidence(item.id, "scope", "acceptanceCriteria", ["No self approval."]);
  const handoff = pipeline.proposeHandoff(item.id, "scope", "Ready.");

  assert.throws(
    () => pipeline.approveHandoff(item.id, handoff.id, "scope"),
    /must be approved by solution/,
  );
});

test("retrieves sanitized context by lexical overlap", () => {
  const index = buildLexicalIndex([
    {
      id: "handoff-policy",
      title: "Handoff policy",
      summary: "Implementation cannot approve its own release.",
      tags: ["qa", "release"],
    },
    {
      id: "retrieval-policy",
      title: "Retrieval policy",
      summary: "RAG can suggest context but cannot override evidence gates.",
      tags: ["rag"],
    },
  ]);

  const results = search(index, "evidence gates and retrieval context", { top: 1 });

  assert.equal(results[0].id, "retrieval-policy");
  assert.ok(results[0].score > 0);
});

