import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runDataCloudAgentsDemo } from "../../src/data-cloud-demo.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const outputPath = path.join(root, "apps", "console", "demo-data.json");

const result = await runDataCloudAgentsDemo();
const evidence = result.finalWorkItem.evidence;

const payload = {
  generatedAt: new Date().toISOString(),
  title: result.title,
  superApp: result.superApp,
  dataset: result.dataset,
  finalStage: result.finalWorkItem.stage,
  architectureBlocks: result.architectureBlocks,
  tools: result.tools,
  agents: result.agents,
  superAppModules: result.superAppModules,
  verification: result.verification,
  releaseNote: evidence.release.releaseNote.value,
  stages: Object.entries(evidence).map(([stage, values]) => ({
    stage,
    evidenceKeys: Object.keys(values),
    recordedAt: Object.values(values)[0]?.recordedAt ?? null,
  })),
  implementation: {
    sql: evidence.implementation.implementationArtifact.value.sql,
    queryRows:
      evidence.implementation.implementationArtifact.value.toolResults.datasetQuery.data.rows,
    workerJobs: evidence.implementation.implementationArtifact.value.workerJobs,
  },
  positioning: {
    safe:
      "Public sanitized agentic super-app sample with plugins, skills, explicit permissions, typed contracts, MCP-style tools, async validation, evaluation gates, and release evidence.",
    boundary:
      "This does not expose the private Flion runtime, local vault, credentials, sessions, logs, or unverifiable internal-platform experience.",
  },
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);

console.log(JSON.stringify({ ok: true, outputPath }, null, 2));
