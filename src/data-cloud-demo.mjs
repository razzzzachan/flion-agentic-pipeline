import { ARCHITECTURE_BLOCKS, architectureBlockIds } from "./data-cloud-blueprint.mjs";
import { FlionPipeline } from "./pipeline.mjs";
import { createDemoDataset } from "./demo-dataset.mjs";
import { createDataCloudToolRegistry } from "./mcp-tools.mjs";
import { DataCloudWorker } from "./data-worker.mjs";
import { createPublicSuperAppProfile } from "./super-app-profile.mjs";

function approveNext(pipeline, itemId, fromStage, summary, approverStage) {
  const handoff = pipeline.proposeHandoff(itemId, fromStage, summary);
  return pipeline.approveHandoff(itemId, handoff.id, approverStage);
}

function compactToolResult(result) {
  return {
    ok: result.ok,
    kind: result.kind,
    errors: result.errors,
    data: result.data,
    tool: result.meta.tool,
  };
}

export async function runDataCloudAgentsDemo({ dataset = createDemoDataset() } = {}) {
  const pipeline = new FlionPipeline();
  const tools = createDataCloudToolRegistry({
    dataset,
    documents: [
      {
        id: "architecture:data-cloud-agents",
        title: "Data Cloud Agents architecture",
        summary: "Contracts precede MCP tools; tools feed agents; evaluations gate release.",
        tags: ["architecture", "agents", "mcp"],
      },
    ],
  });
  const worker = new DataCloudWorker({ toolRegistry: tools });

  const item = pipeline.createWorkItem({
    id: "demo_data_cloud_agents",
    title: "Analyze a sanitized revenue dataset and produce a release handoff.",
  });

  pipeline.addEvidence(item.id, "scope", "acceptanceCriteria", [
    "Use only the sanitized public dataset.",
    "Expose every data operation through a validated MCP-style tool.",
    "Generate sample API documentation and code without private runtime data.",
    "Run validation before release.",
  ]);
  approveNext(pipeline, item.id, "scope", "Scope is bounded to public data.", "solution");

  pipeline.addEvidence(item.id, "solution", "workflowDecision", {
    pattern: "tool-mediated agent workflow",
    blocks: ["data-contracts", "mcp-tool-layer", "async-data-worker", "evaluation-gates"],
    reason: "The demo should prove safe tool use and reviewable release evidence.",
  });
  approveNext(pipeline, item.id, "solution", "Workflow is ready for technical contracts.", "architecture");

  pipeline.addEvidence(item.id, "architecture", "technicalContract", {
    architectureBlocks: architectureBlockIds(),
    datasetId: dataset.id,
    tools: tools.listTools().map((tool) => tool.name),
    boundaries: [
      "SQL is read-only and limited.",
      "Workers return result envelopes.",
      "Release depends on QA evidence.",
    ],
  });
  approveNext(pipeline, item.id, "architecture", "Contracts and tool boundaries are defined.", "implementation");

  const sql = "SELECT account, arr_usd, risk FROM accounts LIMIT 3";
  const toolResults = {
    semanticSearch: tools.executeTool("semantic_search", {
      query: "revenue accounts workflow risk",
      top: 2,
    }),
    sqlValidation: tools.executeTool("validate_sql", { sql }),
    datasetQuery: tools.executeTool("query_dataset", { sql }),
    sampleCode: tools.executeTool("generate_sample_code", { sql, language: "javascript" }),
  };

  const workerJob = worker.enqueue("validate_sql", { sql });
  const completedJobs = await worker.drain();

  pipeline.addEvidence(item.id, "implementation", "implementationArtifact", {
    sql,
    toolResults: Object.fromEntries(
      Object.entries(toolResults).map(([key, result]) => [key, compactToolResult(result)]),
    ),
    workerJobs: completedJobs.map((job) => ({
      id: job.id,
      type: job.type,
      status: job.status,
      ok: job.result?.ok ?? false,
    })),
    firstWorkerJobId: workerJob.id,
  });
  approveNext(pipeline, item.id, "implementation", "Tool execution artifacts are ready for QA.", "qa");

  const verification = {
    passed: Object.values(toolResults).every((result) => result.ok)
      && completedJobs.every((job) => job.status === "succeeded")
      && toolResults.datasetQuery.data.rowCount === 3
      && toolResults.sampleCode.data.code.includes("/tools/query_dataset"),
    checks: [
      { name: "sql_validated", passed: toolResults.sqlValidation.ok },
      { name: "query_returned_rows", passed: toolResults.datasetQuery.data.rowCount === 3 },
      { name: "sample_code_generated", passed: toolResults.sampleCode.data.code.includes("fetch") },
      { name: "worker_succeeded", passed: completedJobs.every((job) => job.status === "succeeded") },
    ],
  };

  pipeline.addEvidence(item.id, "qa", "verificationResult", verification);
  approveNext(pipeline, item.id, "qa", "QA checks passed and release can package the handoff.", "release");

  pipeline.addEvidence(item.id, "release", "releaseNote", {
    ready: verification.passed,
    summary:
      "Flion Super App demo completed with public data, safe tools, worker validation, and release evidence.",
    residualRisks: [
      "This is an in-memory demo; production deployment would need persistent queues and auth.",
      "The SQL validator intentionally supports a small safe subset.",
      "The visible console is sanitized and does not expose private Flion runtime state.",
    ],
  });

  const listedTools = tools.listTools();

  return {
    title: "Flion Agentic Super App Demo",
    dataset: {
      id: dataset.id,
      title: dataset.title,
      description: dataset.description,
      tables: dataset.tables.map((table) => ({
        name: table.name,
        description: table.description,
        tags: table.tags ?? [],
        columns: table.columns.map((column) => ({
          name: column.name,
          type: column.type,
          description: column.description,
        })),
        rowCount: table.rows.length,
      })),
    },
    architectureBlocks: ARCHITECTURE_BLOCKS.map(({ id, title }) => ({ id, title })),
    tools: listedTools,
    superApp: createPublicSuperAppProfile({ tools: listedTools, dataset }),
    superAppModules: [
      {
        id: "home",
        title: "Mission Home",
        description: "Single cockpit for active work, evidence health, agent state, and release readiness.",
        status: "live",
      },
      {
        id: "agents",
        title: "Agent Workspace",
        description: "Role-based agents move the same work item through scope, solution, architecture, QA, and release.",
        status: "live",
      },
      {
        id: "tools",
        title: "Tool Registry",
        description: "MCP-style tools expose safe data operations instead of letting agents improvise against raw systems.",
        status: "live",
      },
      {
        id: "data",
        title: "Data Contracts",
        description: "Dataset schemas, query limits, and result envelopes are visible before release is allowed.",
        status: "live",
      },
      {
        id: "release",
        title: "Release Center",
        description: "Evaluation gates package evidence, residual risks, and final handoff state.",
        status: "ready",
      },
    ],
    agents: [
      {
        id: "scope",
        title: "Scope Agent",
        mission: "Bounds the request to public data and acceptance criteria.",
        status: "approved",
        handoff: "solution",
      },
      {
        id: "architect",
        title: "Architecture Agent",
        mission: "Turns workflow decisions into contracts, tools, workers, and evaluation gates.",
        status: "approved",
        handoff: "implementation",
      },
      {
        id: "toolsmith",
        title: "Toolsmith Agent",
        mission: "Executes validated MCP-style tools and records deterministic artifacts.",
        status: "verified",
        handoff: "qa",
      },
      {
        id: "qa",
        title: "QA Gate Agent",
        mission: "Blocks self-approval by checking SQL, query rows, code generation, and worker execution.",
        status: "passed",
        handoff: "release",
      },
      {
        id: "release",
        title: "Release Agent",
        mission: "Packages evidence, limitations, and public positioning into a reviewable handoff.",
        status: "ready",
        handoff: "public demo",
      },
    ],
    implementation: {
      sql,
      queryRows: toolResults.datasetQuery.data.rows,
      workerJobs: completedJobs.map((job) => ({
        id: job.id,
        type: job.type,
        status: job.status,
        ok: job.result?.ok ?? false,
      })),
      sampleCode: toolResults.sampleCode.data.code,
      semanticResults: toolResults.semanticSearch.data.results,
      toolRunStats: dataset.tables.find((table) => table.name === "tool_runs")?.rows ?? [],
    },
    finalWorkItem: pipeline.getWorkItem(item.id),
    verification,
  };
}
