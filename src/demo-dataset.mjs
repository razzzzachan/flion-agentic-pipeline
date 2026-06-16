export function createDemoDataset() {
  return {
    id: "demo_revenue_cloud",
    title: "Sanitized Revenue Cloud",
    description: "Small public fixture for agentic data workflow demonstrations.",
    tables: [
      {
        name: "accounts",
        description: "Sanitized account-level revenue and workflow status.",
        tags: ["revenue", "accounts", "workflow"],
        columns: [
          { name: "account", type: "string", description: "Public sample account label." },
          { name: "segment", type: "string", description: "Customer segment." },
          { name: "arr_usd", type: "number", description: "Annual recurring revenue in USD." },
          { name: "risk", type: "string", description: "Operational risk label." },
          { name: "next_action", type: "string", description: "Recommended workflow action." },
        ],
        rows: [
          {
            account: "Atlas Labs",
            segment: "AI infrastructure",
            arr_usd: 126000,
            risk: "medium",
            next_action: "validate migration plan",
          },
          {
            account: "Northstar Ops",
            segment: "field service",
            arr_usd: 84000,
            risk: "low",
            next_action: "expand automation rollout",
          },
          {
            account: "Cobalt Realty",
            segment: "real estate",
            arr_usd: 42000,
            risk: "high",
            next_action: "review onboarding blockers",
          },
        ],
      },
      {
        name: "tool_runs",
        description: "Sanitized tool execution summary for agent workflow observability.",
        tags: ["tools", "observability", "agents"],
        columns: [
          { name: "tool", type: "string", description: "Tool name." },
          { name: "status", type: "string", description: "Execution status." },
          { name: "latency_ms", type: "number", description: "Observed latency in milliseconds." },
          { name: "quality_score", type: "number", description: "Simple deterministic quality score." },
        ],
        rows: [
          { tool: "query_dataset", status: "succeeded", latency_ms: 18, quality_score: 0.98 },
          { tool: "validate_sql", status: "succeeded", latency_ms: 5, quality_score: 1 },
          { tool: "generate_sample_code", status: "succeeded", latency_ms: 11, quality_score: 0.95 },
        ],
      },
    ],
  };
}
