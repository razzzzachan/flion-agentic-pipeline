import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateArchitectureBlueprint } from "../../src/data-cloud-blueprint.mjs";
import { runDataCloudAgentsDemo } from "../../src/data-cloud-demo.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const SECRET_PATTERNS = [
  { label: "OpenAI-style secret", pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { label: "AWS access key", pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { label: "Private key", pattern: /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/ },
  { label: "Bearer token", pattern: /\bBearer\s+[A-Za-z0-9._-]{20,}\b/ },
];

const BLOCKED_CLAIMS = [
  /\bI worked inside Google3\b/i,
  /\bI used private Google engineering systems\b/i,
  /\bI have direct Google internal tooling experience\b/i,
];

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules"].includes(entry.name)) return [];
      return walkFiles(fullPath);
    }
    return [fullPath];
  });
}

function checkPublicBoundary() {
  const issues = [];
  const files = walkFiles(root).filter((file) => /\.(mjs|js|json|md|html|txt)$/i.test(file));

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const relative = path.relative(root, file);

    for (const { label, pattern } of SECRET_PATTERNS) {
      if (pattern.test(content)) issues.push(`${relative}: possible ${label}`);
    }

    for (const pattern of BLOCKED_CLAIMS) {
      if (pattern.test(content)) issues.push(`${relative}: blocked unverifiable Google3 claim`);
    }
  }

  return issues;
}

const blueprint = validateArchitectureBlueprint();
assert.equal(blueprint.valid, true, blueprint.errors.join("\n"));

const demo = await runDataCloudAgentsDemo();
assert.equal(demo.finalWorkItem.stage, "release");
assert.equal(demo.verification.passed, true);
assert.equal(demo.finalWorkItem.evidence.release.releaseNote.value.ready, true);

const boundaryIssues = checkPublicBoundary();
assert.deepEqual(boundaryIssues, []);

console.log(JSON.stringify({
  ok: true,
  checks: [
    "architecture_blueprint",
    "data_cloud_demo_release",
    "public_boundary_scan",
  ],
  finalStage: demo.finalWorkItem.stage,
}, null, 2));
