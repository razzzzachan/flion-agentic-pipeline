export const ARCHITECTURE_BLOCKS = Object.freeze([
  {
    id: "work-intake",
    title: "Work Intake Contract",
    owns: "Turns an ambiguous request into an executable data-cloud work item.",
    evidence: ["problem statement", "acceptance criteria", "privacy boundary"],
    dependsOn: [],
  },
  {
    id: "data-contracts",
    title: "Data Contracts",
    owns: "Defines dataset, query, tool-call, job, and result schemas before implementation.",
    evidence: ["typed schemas", "sample payloads", "compatibility notes"],
    dependsOn: ["work-intake"],
  },
  {
    id: "mcp-tool-layer",
    title: "MCP Tool Layer",
    owns: "Exposes safe tools for dataset query, semantic lookup, sample-code generation, and validation.",
    evidence: ["tool registry", "input validation", "safe execution limits"],
    dependsOn: ["data-contracts"],
  },
  {
    id: "async-data-worker",
    title: "Async Data Worker",
    owns: "Runs heavier jobs outside the request path, including SQL validation and generated-code checks.",
    evidence: ["job lifecycle", "retry policy", "result envelope"],
    dependsOn: ["data-contracts", "mcp-tool-layer"],
  },
  {
    id: "agent-runtime",
    title: "Agent Runtime",
    owns: "Coordinates role-based agents that call tools, inspect evidence, and hand off work.",
    evidence: ["agent roles", "handoff policy", "tool-use transcript"],
    dependsOn: ["mcp-tool-layer", "async-data-worker"],
  },
  {
    id: "evaluation-gates",
    title: "Evaluation Gates",
    owns: "Prevents self-approval by requiring tests, tool-output checks, and reviewer-stage approval.",
    evidence: ["unit tests", "eval fixtures", "regression summary"],
    dependsOn: ["agent-runtime"],
  },
  {
    id: "operator-console",
    title: "Operator Console",
    owns: "Shows jobs, traces, decisions, datasets, and release readiness to a human operator.",
    evidence: ["job dashboard", "trace viewer", "manual override notes"],
    dependsOn: ["agent-runtime", "evaluation-gates"],
  },
  {
    id: "observability",
    title: "Observability",
    owns: "Captures structured logs, decision events, quality scores, and cost/runtime metrics.",
    evidence: ["event taxonomy", "trace IDs", "quality/cost counters"],
    dependsOn: ["async-data-worker", "agent-runtime", "operator-console"],
  },
  {
    id: "security-sanitization",
    title: "Security And Sanitization",
    owns: "Keeps the public sample safe by separating private runtime state, secrets, and user data.",
    evidence: ["redaction rules", "public/private boundary", "safe fixtures"],
    dependsOn: ["data-contracts", "mcp-tool-layer", "observability"],
  },
  {
    id: "release-handoff",
    title: "Release Handoff",
    owns: "Packages architecture, tests, residual risks, and demo instructions into a reviewable artifact.",
    evidence: ["release notes", "test output", "known limitations"],
    dependsOn: ["evaluation-gates", "security-sanitization"],
  },
]);

export const MONOREPO_BOUNDARIES = Object.freeze({
  apps: {
    console: {
      path: "apps/console",
      purpose: "Operator UI for jobs, traces, evaluations, and release state.",
      primaryBlocks: ["operator-console", "observability"],
    },
  },
  services: {
    "mcp-gateway": {
      path: "services/mcp-gateway",
      purpose: "FastAPI-style MCP gateway for safe AI/data tools.",
      primaryBlocks: ["mcp-tool-layer", "agent-runtime"],
    },
    "data-worker": {
      path: "services/data-worker",
      purpose: "Go-style worker boundary for async jobs and validation tasks.",
      primaryBlocks: ["async-data-worker", "observability"],
    },
  },
  packages: {
    protos: {
      path: "packages/protos",
      purpose: "Shared protocol and schema contracts for datasets, jobs, and tool calls.",
      primaryBlocks: ["data-contracts"],
    },
    agents: {
      path: "packages/agents",
      purpose: "Reusable agent roles, prompts, policies, and handoff rules.",
      primaryBlocks: ["agent-runtime"],
    },
    evals: {
      path: "packages/evals",
      purpose: "Evaluation fixtures, regression checks, and quality gates.",
      primaryBlocks: ["evaluation-gates"],
    },
  },
  tools: {
    build: {
      path: "tools/build",
      purpose: "Future Bazel/build-system integration without claiming Google3 access.",
      primaryBlocks: ["release-handoff"],
    },
    quality: {
      path: "tools/quality",
      purpose: "Repository-wide checks for tests, lint, docs, and public-safety boundaries.",
      primaryBlocks: ["evaluation-gates", "security-sanitization"],
    },
  },
});

export const POSITIONING_CLAIM = Object.freeze({
  safe: "This is a public Google-style engineering sample, not a claim of direct Google3 access.",
  avoid: [
    "worked inside Google3",
    "used private Google engineering systems",
    "direct Google internal tooling experience",
  ],
  honestAlternative:
    "Built a public AI/data monorepo using typed contracts, MCP-style tools, async workers, evaluation gates, CI-ready tests, and sanitized release handoffs.",
});

export function architectureBlockIds() {
  return ARCHITECTURE_BLOCKS.map((block) => block.id);
}

export function getArchitectureBlock(id) {
  const block = ARCHITECTURE_BLOCKS.find((entry) => entry.id === id);
  if (!block) throw new Error(`Unknown architecture block: ${id}`);
  return block;
}

export function validateArchitectureBlueprint() {
  const ids = architectureBlockIds();
  const errors = [];

  for (const [index, block] of ARCHITECTURE_BLOCKS.entries()) {
    if (!block.evidence.length) {
      errors.push(`${block.id} must declare evidence.`);
    }

    for (const dependency of block.dependsOn) {
      const dependencyIndex = ids.indexOf(dependency);
      if (dependencyIndex === -1) {
        errors.push(`${block.id} depends on unknown block ${dependency}.`);
      } else if (dependencyIndex >= index) {
        errors.push(`${block.id} must depend only on earlier blocks; ${dependency} is not earlier.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function listMonorepoPaths() {
  return Object.values(MONOREPO_BOUNDARIES).flatMap((group) =>
    Object.values(group).map((entry) => entry.path),
  );
}
