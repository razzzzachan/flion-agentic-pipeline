import { AGENTS, STAGES, getNextStage, requiredEvidenceFor } from "./contracts.mjs";

function assertKnownStage(stage) {
  if (!STAGES.includes(stage)) {
    throw new Error(`Unknown stage: ${stage}`);
  }
}

function createId(prefix = "work") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export class FlionPipeline {
  constructor({ agents = AGENTS } = {}) {
    this.agents = agents;
    this.items = new Map();
  }

  createWorkItem(input) {
    const now = new Date().toISOString();
    const item = {
      id: input.id ?? createId(),
      title: input.title,
      stage: "scope",
      createdAt: now,
      updatedAt: now,
      evidence: {},
      handoffs: [],
      history: [
        {
          at: now,
          type: "created",
          actor: "pipeline",
          summary: "Work item created at scope stage.",
        },
      ],
    };

    this.items.set(item.id, item);
    return structuredClone(item);
  }

  getWorkItem(id) {
    const item = this.items.get(id);
    if (!item) throw new Error(`Unknown work item: ${id}`);
    return structuredClone(item);
  }

  addEvidence(id, stage, key, value, actor = stage) {
    assertKnownStage(stage);
    const item = this.items.get(id);
    if (!item) throw new Error(`Unknown work item: ${id}`);

    const now = new Date().toISOString();
    item.evidence[stage] ??= {};
    item.evidence[stage][key] = {
      value,
      actor,
      recordedAt: now,
    };
    item.updatedAt = now;
    item.history.push({
      at: now,
      type: "evidence_added",
      actor,
      stage,
      key,
    });

    return this.getWorkItem(id);
  }

  proposeHandoff(id, fromStage, summary, actor = fromStage) {
    assertKnownStage(fromStage);
    const item = this.items.get(id);
    if (!item) throw new Error(`Unknown work item: ${id}`);
    if (item.stage !== fromStage) {
      throw new Error(`Cannot hand off from ${fromStage}; current stage is ${item.stage}`);
    }

    const missing = this.missingEvidence(item, fromStage);
    if (missing.length > 0) {
      throw new Error(`Missing evidence for ${fromStage}: ${missing.join(", ")}`);
    }

    const toStage = getNextStage(fromStage);
    if (!toStage) {
      throw new Error("Release stage has no next handoff.");
    }

    const now = new Date().toISOString();
    const handoff = {
      id: createId("handoff"),
      fromStage,
      toStage,
      actor,
      summary,
      approved: false,
      createdAt: now,
      approvedAt: null,
      approvedBy: null,
    };

    item.handoffs.push(handoff);
    item.updatedAt = now;
    item.history.push({
      at: now,
      type: "handoff_proposed",
      actor,
      fromStage,
      toStage,
    });

    return structuredClone(handoff);
  }

  approveHandoff(id, handoffId, approverStage) {
    assertKnownStage(approverStage);
    const item = this.items.get(id);
    if (!item) throw new Error(`Unknown work item: ${id}`);

    const handoff = item.handoffs.find((entry) => entry.id === handoffId);
    if (!handoff) throw new Error(`Unknown handoff: ${handoffId}`);
    if (handoff.approved) throw new Error(`Handoff already approved: ${handoffId}`);
    if (handoff.toStage !== approverStage) {
      throw new Error(`Handoff must be approved by ${handoff.toStage}, not ${approverStage}`);
    }
    if (handoff.actor === approverStage) {
      throw new Error("An agent cannot approve its own handoff.");
    }

    const now = new Date().toISOString();
    handoff.approved = true;
    handoff.approvedAt = now;
    handoff.approvedBy = approverStage;
    item.stage = handoff.toStage;
    item.updatedAt = now;
    item.history.push({
      at: now,
      type: "handoff_approved",
      actor: approverStage,
      fromStage: handoff.fromStage,
      toStage: handoff.toStage,
    });

    return this.getWorkItem(id);
  }

  missingEvidence(item, stage) {
    const evidence = item.evidence[stage] ?? {};
    return requiredEvidenceFor(stage).filter((key) => !evidence[key]);
  }
}

