const fallbackData = {
  title: "Flion Data Cloud Agents Demo",
  dataset: { id: "demo_revenue_cloud", tables: ["accounts", "tool_runs"] },
  finalStage: "release",
  architectureBlocks: [
    { id: "work-intake", title: "Work Intake Contract" },
    { id: "data-contracts", title: "Data Contracts" },
    { id: "mcp-tool-layer", title: "MCP Tool Layer" },
    { id: "async-data-worker", title: "Async Data Worker" },
    { id: "agent-runtime", title: "Agent Runtime" },
    { id: "evaluation-gates", title: "Evaluation Gates" },
    { id: "operator-console", title: "Operator Console" },
    { id: "observability", title: "Observability" },
    { id: "security-sanitization", title: "Security And Sanitization" },
    { id: "release-handoff", title: "Release Handoff" },
  ],
  tools: [
    { name: "validate_sql", description: "Validate a read-only SQL query." },
    { name: "query_dataset", description: "Run a safe SELECT query." },
    { name: "semantic_search", description: "Search sanitized notes." },
    { name: "generate_sample_code", description: "Generate deterministic sample code." },
    { name: "record_evidence", description: "Wrap stage evidence." },
  ],
  verification: {
    passed: true,
    checks: [
      { name: "sql_validated", passed: true },
      { name: "query_returned_rows", passed: true },
      { name: "sample_code_generated", passed: true },
      { name: "worker_succeeded", passed: true },
    ],
  },
  releaseNote: {
    ready: true,
    summary:
      "Data Cloud Agents demo completed with public data, safe tools, worker validation, and release evidence.",
    residualRisks: [
      "This is an in-memory demo; production deployment would need persistent queues and auth.",
      "The SQL validator intentionally supports a small safe subset.",
    ],
  },
  stages: [
    { stage: "scope", evidenceKeys: ["acceptanceCriteria"] },
    { stage: "solution", evidenceKeys: ["workflowDecision"] },
    { stage: "architecture", evidenceKeys: ["technicalContract"] },
    { stage: "implementation", evidenceKeys: ["implementationArtifact"] },
    { stage: "qa", evidenceKeys: ["verificationResult"] },
    { stage: "release", evidenceKeys: ["releaseNote"] },
  ],
  implementation: {
    sql: "SELECT account, arr_usd, risk FROM accounts LIMIT 3",
    queryRows: [
      { account: "Atlas Labs", arr_usd: 126000, risk: "medium" },
      { account: "Northstar Ops", arr_usd: 84000, risk: "low" },
      { account: "Cobalt Realty", arr_usd: 42000, risk: "high" },
    ],
  },
  positioning: {
    safe:
      "Public Google-style engineering sample with typed contracts, MCP-style tools, async worker validation, evaluation gates, and release evidence.",
    boundary:
      "This does not claim direct Google3 access or private Google internal tooling experience.",
  },
};

function text(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function formatStage(stage) {
  return stage.replaceAll("-", " ");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function renderArchitecture(blocks) {
  const target = document.querySelector('[data-render="architecture"]');
  target.innerHTML = blocks
    .map(
      (block, index) => `
        <li>
          <span>${String(index + 1).padStart(2, "0")} / ${block.id}</span>
          <strong>${block.title}</strong>
        </li>
      `,
    )
    .join("");
}

function renderStages(stages) {
  const target = document.querySelector('[data-render="stages"]');
  target.innerHTML = stages
    .map(
      (stage) => `
        <article class="timeline-item">
          <strong>${formatStage(stage.stage)}</strong>
          <span>${stage.evidenceKeys.join(", ")}</span>
        </article>
      `,
    )
    .join("");
}

function renderRisks(risks) {
  const target = document.querySelector('[data-render="risks"]');
  target.innerHTML = risks.map((risk) => `<div class="risk-item">${risk}</div>`).join("");
}

function renderRows(rows) {
  const target = document.querySelector('[data-render="queryRows"]');
  target.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${row.account}</td>
          <td>${formatCurrency(row.arr_usd)}</td>
          <td>${row.risk}</td>
        </tr>
      `,
    )
    .join("");
}

function renderTools(tools) {
  const target = document.querySelector('[data-render="tools"]');
  target.innerHTML = tools
    .map(
      (tool) => `
        <article class="tool-card">
          <strong>${tool.name}</strong>
          <p>${tool.description}</p>
        </article>
      `,
    )
    .join("");
}

async function loadData() {
  try {
    const response = await fetch("./demo-data.json", { cache: "no-store" });
    if (!response.ok) throw new Error("demo-data.json not available");
    return await response.json();
  } catch {
    return fallbackData;
  }
}

const data = await loadData();
const checksPassed = data.verification.checks.filter((check) => check.passed).length;

text('[data-bind="finalStage"]', data.finalStage);
text('[data-bind="checksPassed"]', `${checksPassed}/${data.verification.checks.length}`);
text('[data-bind="toolCount"]', String(data.tools.length));
text('[data-bind="releaseSummary"]', data.releaseNote.summary);
text('[data-bind="sql"]', data.implementation.sql);
text('[data-bind="safePositioning"]', data.positioning.safe);
text('[data-bind="boundaryPositioning"]', data.positioning.boundary);

renderArchitecture(data.architectureBlocks);
renderStages(data.stages);
renderRisks(data.releaseNote.residualRisks);
renderRows(data.implementation.queryRows);
renderTools(data.tools);
