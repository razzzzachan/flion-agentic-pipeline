export const STAGES = Object.freeze([
  "scope",
  "solution",
  "architecture",
  "implementation",
  "qa",
  "release",
]);

export const AGENTS = Object.freeze({
  scope: {
    title: "Scope Producer",
    owns: ["problem framing", "acceptance criteria", "constraints"],
  },
  solution: {
    title: "Solution Designer",
    owns: ["workflow design", "user journey", "tradeoff summary"],
  },
  architecture: {
    title: "Technical Architect",
    owns: ["interfaces", "data model", "risk boundaries"],
  },
  implementation: {
    title: "Execution Engineer",
    owns: ["code changes", "automation", "implementation notes"],
  },
  qa: {
    title: "Quality Guardian",
    owns: ["test evidence", "regression checks", "release confidence"],
  },
  release: {
    title: "Release Operator",
    owns: ["handoff package", "residual risks", "next steps"],
  },
});

export const REQUIRED_EVIDENCE = Object.freeze({
  scope: ["acceptanceCriteria"],
  solution: ["workflowDecision"],
  architecture: ["technicalContract"],
  implementation: ["implementationArtifact"],
  qa: ["verificationResult"],
  release: ["releaseNote"],
});

export function getNextStage(stage) {
  const index = STAGES.indexOf(stage);
  if (index === -1) {
    throw new Error(`Unknown stage: ${stage}`);
  }
  return STAGES[index + 1] ?? null;
}

export function requiredEvidenceFor(stage) {
  return REQUIRED_EVIDENCE[stage] ?? [];
}

