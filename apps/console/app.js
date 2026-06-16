const fallbackData = {
  generatedAt: new Date().toISOString(),
  title: "Flion Agentic Super App Demo",
  finalStage: "release",
  superApp: {
    name: "Flion Agentic Super App",
    summary:
      "A public, sanitized agent workspace for plugins, skills, memory, browser sessions, automations, and release gates.",
    safetyBoundary:
      "No private vault data, credentials, local sessions, client logs, or unverifiable internal-platform claims are included.",
    stats: [
      { label: "Native plugins", value: "21", detail: "Connector-style integrations surfaced through the UI." },
      { label: "Skills indexed", value: "50+", detail: "Reusable operating playbooks selectable from the composer." },
      { label: "Role agents", value: "8", detail: "Specialized agents for scope, design, build, QA, and release." },
      { label: "Release gates", value: "6", detail: "Evidence-backed stages before a handoff is marked ready." },
    ],
    modules: [
      {
        title: "Agent Chat Command Center",
        status: "live",
        description: "Composer chat with @ mentions, / commands, model control, context chips, and access policy.",
        signals: ["@ plugins", "/ commands", "context files"],
      },
      {
        title: "Plugin And Skill Registry",
        status: "live",
        description: "Status-aware catalog for native plugins, skills, connector requirements, and safe fallbacks.",
        signals: ["21 plugins", "50+ skills", "permission states"],
      },
      {
        title: "Browser And Computer Dock",
        status: "controlled",
        description: "Per-session preview, real tab sync, action audit, and approval-gated computer control.",
        signals: ["preview", "logs", "approval broker"],
      },
      {
        title: "Release Desk",
        status: "ready",
        description: "QA evidence, residual risks, public-safety checks, and deployment handoff.",
        signals: ["tests", "screenshots", "release notes"],
      },
    ],
    commandPalette: {
      triggers: [
        { key: "@", title: "Reference plugins, skills, and files", description: "Inline mentions become active prompt context." },
        { key: "/", title: "Run commands and change operating mode", description: "Compact, fork, create tasks, switch model, and more." },
        { key: "+", title: "Open creation and attachment actions", description: "New tasks, notes, files, plugin shortcuts, and sessions." },
      ],
    },
    catalog: {
      plugins: ["browser", "github", "vercel", "gmail", "google-drive", "data-analytics", "documents", "spreadsheets"],
      skills: ["ui-ux-pro-max", "21st-registry", "browser-qa", "release-readiness", "playwright", "openai-docs"],
    },
    agents: [
      { title: "Jarvis Main", mission: "Keeps the thread coherent and manages active context.", handoff: "specialists", status: "online" },
      { title: "Scope Producer", mission: "Turns ambiguous requests into executable criteria.", handoff: "design", status: "ready" },
      { title: "Technical Architect", mission: "Maps modules, tools, data contracts, and runtime risks.", handoff: "implementation", status: "ready" },
      { title: "Quality Guardian", mission: "Runs tests, smoke checks, and release evidence validation.", handoff: "release", status: "ready" },
    ],
    dock: [
      { title: "Preview", description: "Live browser or static preview tied to the active session." },
      { title: "Logs", description: "Runtime events, tool calls, internal cards, and safety warnings." },
      { title: "Execution", description: "Agent actions, approvals, browser steps, and automation runs." },
    ],
    automations: [
      {
        title: "QA Smoke Runner",
        cadence: "on demand or scheduled",
        model: "codex-grade reasoning",
        outcome: "Runs validation, screenshots, and release notes.",
      },
    ],
  },
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
  verification: {
    checks: [
      { name: "sql_validated", passed: true },
      { name: "query_returned_rows", passed: true },
      { name: "sample_code_generated", passed: true },
      { name: "worker_succeeded", passed: true },
    ],
  },
  releaseNote: {
    summary:
      "Flion Super App demo completed with public data, safe tools, worker validation, and release evidence.",
    residualRisks: [
      "This is an in-memory demo; production deployment would need persistent queues and auth.",
      "The visible console is sanitized and does not expose private Flion runtime state.",
    ],
  },
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
      "Public sanitized agentic super-app sample with plugins, skills, explicit permissions, typed contracts, MCP-style tools, async validation, evaluation gates, and release evidence.",
    boundary:
      "This does not expose the private Flion runtime, local vault, credentials, sessions, logs, or unverifiable internal-platform experience.",
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function text(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function render(selector, html) {
  const target = document.querySelector(selector);
  if (target) target.innerHTML = html;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatGeneratedAt(value) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "generated locally";
  }
}

function renderStats(stats) {
  render(
    '[data-render="stats"]',
    stats
      .map(
        (stat) => `
          <article class="stat-card">
            <span>${escapeHtml(stat.label)}</span>
            <strong>${escapeHtml(stat.value)}</strong>
            <small>${escapeHtml(stat.detail)}</small>
          </article>
        `,
      )
      .join(""),
  );
}

function renderDock(items) {
  render(
    '[data-render="dock"]',
    items
      .map(
        (item) => `
          <article class="dock-item">
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `,
      )
      .join(""),
  );
}

function renderPalette(commandPalette) {
  render(
    '[data-render="palette"]',
    commandPalette.triggers
      .map(
        (trigger) => `
          <article class="palette-card">
            <kbd>${escapeHtml(trigger.key)}</kbd>
            <strong>${escapeHtml(trigger.title)}</strong>
            <p>${escapeHtml(trigger.description)}</p>
          </article>
        `,
      )
      .join(""),
  );
}

function renderChips(selector, items) {
  render(selector, items.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join(""));
}

function renderModules(modules) {
  render(
    '[data-render="modules"]',
    modules
      .map(
        (module) => `
          <article class="module-card">
            <span class="status">${escapeHtml(module.status)}</span>
            <strong>${escapeHtml(module.title)}</strong>
            <p>${escapeHtml(module.description)}</p>
            <div class="signal-row">
              ${(module.signals ?? []).map((signal) => `<span>${escapeHtml(signal)}</span>`).join("")}
            </div>
          </article>
        `,
      )
      .join(""),
  );
}

function renderAgents(agents) {
  render(
    '[data-render="agents"]',
    agents
      .map(
        (agent) => `
          <article class="agent-card">
            <span>${escapeHtml(agent.status)} -> ${escapeHtml(agent.handoff)}</span>
            <strong>${escapeHtml(agent.title)}</strong>
            <p>${escapeHtml(agent.mission)}</p>
          </article>
        `,
      )
      .join(""),
  );
}

function renderAutomations(automations) {
  render(
    '[data-render="automations"]',
    automations
      .map(
        (automation) => `
          <article class="automation-card">
            <div>
              <span>${escapeHtml(automation.cadence)}</span>
              <strong>${escapeHtml(automation.title)}</strong>
              <p>${escapeHtml(automation.model)}</p>
            </div>
            <p>${escapeHtml(automation.outcome)}</p>
          </article>
        `,
      )
      .join(""),
  );
}

function renderArchitecture(blocks) {
  render(
    '[data-render="architecture"]',
    blocks
      .map(
        (block, index) => `
          <li>
            <span>${String(index + 1).padStart(2, "0")} / ${escapeHtml(block.id)}</span>
            <strong>${escapeHtml(block.title)}</strong>
          </li>
        `,
      )
      .join(""),
  );
}

function renderRows(rows) {
  render(
    '[data-render="queryRows"]',
    rows
      .map(
        (row) => `
          <tr>
            <td>${escapeHtml(row.account)}</td>
            <td>${formatCurrency(row.arr_usd)}</td>
            <td>${escapeHtml(row.risk)}</td>
          </tr>
        `,
      )
      .join(""),
  );
}

function renderRisks(risks) {
  render(
    '[data-render="risks"]',
    risks.map((risk) => `<div class="risk-item">${escapeHtml(risk)}</div>`).join(""),
  );
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
const superApp = data.superApp ?? fallbackData.superApp;

text('[data-bind="title"]', superApp.name ?? data.title);
text('[data-bind="summary"]', superApp.summary);
text('[data-bind="safetyBoundary"]', superApp.safetyBoundary);
text('[data-bind="generatedAt"]', `built ${formatGeneratedAt(data.generatedAt)}`);
text('[data-bind="releaseSummary"]', data.releaseNote.summary);
text('[data-bind="sql"]', data.implementation.sql);
text('[data-bind="safePositioning"]', data.positioning.safe);
text('[data-bind="boundaryPositioning"]', data.positioning.boundary);

renderStats(superApp.stats ?? []);
renderDock(superApp.dock ?? []);
renderPalette(superApp.commandPalette ?? { triggers: [] });
renderChips('[data-render="plugins"]', superApp.catalog?.plugins ?? []);
renderChips('[data-render="skills"]', superApp.catalog?.skills ?? []);
renderModules(superApp.modules ?? data.superAppModules ?? []);
renderAgents(superApp.agents ?? data.agents ?? []);
renderAutomations(superApp.automations ?? []);
renderArchitecture(data.architectureBlocks ?? []);
renderRows(data.implementation.queryRows ?? []);
renderRisks(data.releaseNote.residualRisks ?? []);
