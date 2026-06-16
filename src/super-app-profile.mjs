export function createPublicSuperAppProfile({ tools = [], dataset } = {}) {
  return {
    name: "Flion Agentic Super App",
    tagline: "A sanitized public workspace for agents, plugins, skills, memory, browser sessions, and release gates.",
    summary:
      "Flion is presented here as a public, sanitized agent workspace. The private runtime has more local state, credentials, logs, and project memory; this demo keeps the product shape while exposing only synthetic data and reviewable code.",
    safetyBoundary:
      "No private vault data, credentials, local sessions, client logs, or unverifiable internal-platform claims are included.",
    stats: [
      { label: "Native plugins", value: "21", detail: "Connector-style integrations surfaced through the UI." },
      { label: "Skills indexed", value: "50+", detail: "Reusable operating playbooks selectable from the composer." },
      { label: "Role agents", value: "8", detail: "Specialized agents for scope, design, architecture, build, QA, and release." },
      { label: "Release gates", value: "6", detail: "Evidence-backed stages before a handoff is marked ready." },
    ],
    modules: [
      {
        id: "agent-chat",
        title: "Agent Chat Command Center",
        status: "live",
        description:
          "Composer-driven chat with model controls, access policy, context chips, and active plugin or skill mentions.",
        signals: ["@ plugin mentions", "/ command palette", "context files", "model selector"],
      },
      {
        id: "plugin-skill-registry",
        title: "Plugin And Skill Registry",
        status: "live",
        description:
          "A searchable runtime catalog that separates available, needs configuration, needs permission, and unavailable capabilities.",
        signals: ["21 native plugins", "50+ skills", "status-aware execution", "safe fallbacks"],
      },
      {
        id: "flow-canvas",
        title: "Agent Flow Canvas",
        status: "live",
        description:
          "Visual pipeline for role agents, work items, blocked states, QA loops, and release ownership.",
        signals: ["handoff graph", "case focus", "confidence checks", "manual review"],
      },
      {
        id: "memory-vault",
        title: "Memory Vault Graph",
        status: "live",
        description:
          "Operational memory map that rehydrates context from notes, workstreams, and linked decisions without exposing private content.",
        signals: ["vault graph", "context notes", "project clusters", "compaction"],
      },
      {
        id: "browser-dock",
        title: "Browser And Computer Dock",
        status: "controlled",
        description:
          "Per-session browser and computer surfaces with approval policies, previews, logs, references, and action history.",
        signals: ["preview", "real tab sync", "permission broker", "action audit"],
      },
      {
        id: "automation-scheduler",
        title: "Automation Scheduler",
        status: "live",
        description:
          "Recurring agent runs with model selection, schedules, stale-run repair, and post-run summaries.",
        signals: ["scheduled loops", "model per automation", "run now", "status repair"],
      },
      {
        id: "connector-authority",
        title: "Connector Authority",
        status: "guarded",
        description:
          "OAuth, connector requirements, permission grants, and capability routing are explicit runtime objects.",
        signals: ["OAuth authority", "permission status", "encrypted vault", "capability broker"],
      },
      {
        id: "release-desk",
        title: "Release Desk",
        status: "ready",
        description:
          "Evidence, tests, residual risks, and deployment notes are packaged before public handoff.",
        signals: ["QA gates", "release notes", "risk ledger", "public safety scan"],
      },
    ],
    commandPalette: {
      triggers: [
        {
          key: "@",
          title: "Reference plugins, skills, and files",
          description:
            "The composer opens a searchable palette for plugins, skills, and context files, then renders selected items as inline chips.",
        },
        {
          key: "/",
          title: "Run commands and change operating mode",
          description:
            "Slash commands expose actions like compact, fork, create task, create note, change model, and switch personality.",
        },
        {
          key: "+",
          title: "Open creation and attachment actions",
          description:
            "The plus menu groups new tasks, notes, files, plugin shortcuts, and session actions without crowding the composer.",
        },
      ],
      examples: [
        "@browser inspect the current preview",
        "@github prepare a safe release note",
        "@ui-ux-pro-max review this workspace layout",
        "/compact summarize the operational context",
        "/model gpt-5.2-codex",
      ],
    },
    catalog: {
      plugins: [
        "browser",
        "chrome",
        "computer-use",
        "github",
        "gmail",
        "google-drive",
        "google-calendar",
        "vercel",
        "data-analytics",
        "documents",
        "spreadsheets",
        "presentations",
        "linear",
        "openai-developers",
        "hyperframes",
        "remotion",
        "binance",
        "heygen",
        "zyka-sdk",
        "higgsfield",
        "immoflow-video-remotion",
      ],
      skills: [
        "ui-ux-pro-max",
        "21st-registry",
        "browser-qa",
        "visual-browser-qa",
        "frontend-implementation",
        "frontend-architecture",
        "release-readiness",
        "skill-creator",
        "plugin-creator",
        "playwright",
        "openai-docs",
        "data-analytics",
        "pdf-workflows",
        "youtube-researcher",
      ],
    },
    agents: [
      {
        id: "jarvis-main",
        title: "Jarvis Main",
        mission: "Keeps the main thread coherent, chooses the next action, and manages active context.",
        handoff: "specialist agents",
        status: "online",
      },
      {
        id: "operator",
        title: "Opportunity Operator",
        mission: "Turns external opportunities into structured applications, blockers, and follow-up loops.",
        handoff: "release desk",
        status: "active",
      },
      {
        id: "scope",
        title: "Scope Producer",
        mission: "Converts ambiguous requests into acceptance criteria, constraints, and product intent.",
        handoff: "design",
        status: "ready",
      },
      {
        id: "design",
        title: "Solution Designer",
        mission: "Shapes UX, flows, and interaction contracts before engineering starts.",
        handoff: "architecture",
        status: "ready",
      },
      {
        id: "architecture",
        title: "Technical Architect",
        mission: "Maps modules, data contracts, tool boundaries, and runtime risks.",
        handoff: "implementation",
        status: "ready",
      },
      {
        id: "implementation",
        title: "Execution Engineer",
        mission: "Builds the agreed slice, keeps diffs focused, and preserves public/private boundaries.",
        handoff: "qa",
        status: "ready",
      },
      {
        id: "qa",
        title: "Quality Guardian",
        mission: "Runs tests, smoke checks, accessibility scans, and evidence validation before release.",
        handoff: "release",
        status: "ready",
      },
      {
        id: "release",
        title: "Release Manager",
        mission: "Packages what changed, what passed, residual risks, and deployment status.",
        handoff: "public handoff",
        status: "ready",
      },
    ],
    dock: [
      { title: "Preview", description: "Live browser or static preview tied to the active session." },
      { title: "Logs", description: "Runtime events, tool calls, internal cards, and safety warnings." },
      { title: "Execution", description: "Agent actions, approvals, browser steps, and automation runs." },
      { title: "Files", description: "Context files selected for the current thread or workstream." },
      { title: "Details", description: "Session state, model, access mode, and handoff metadata." },
    ],
    automations: [
      {
        id: "qa-smoke-runner",
        title: "QA Smoke Runner",
        cadence: "on demand or scheduled",
        model: "codex-grade reasoning",
        outcome: "Runs validation, collects screenshots, and writes release notes.",
      },
      {
        id: "portfolio-publisher",
        title: "Portfolio Publisher",
        cadence: "after verified product changes",
        model: "fast review",
        outcome: "Refreshes public copy, screenshots, and deployment checks.",
      },
      {
        id: "opportunity-scanner",
        title: "Opportunity Scanner",
        cadence: "every 120 minutes",
        model: "strict scorer",
        outcome: "Finds one high-fit opportunity, rejects weak matches, and records blockers.",
      },
    ],
    dataCloud: {
      title: "Data Cloud Agents Module",
      description:
        "The runnable vertical slice in this repository still proves tool-mediated data work with contracts, safe SQL, workers, QA, and release evidence.",
      datasetTitle: dataset?.title ?? "Sanitized revenue cloud",
      toolCount: tools.length,
    },
  };
}
