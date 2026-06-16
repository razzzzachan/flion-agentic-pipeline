# Flion Agentic Super App

Sanitized public excerpt of **Flion**, an agentic super app designed by Julio Cesar Betoni for operating AI work through chat, plugins, skills, role agents, browser/session surfaces, automations, memory, and evidence-backed release gates.

This repository is intentionally small and safe to share. It demonstrates the product shape and engineering ideas without exposing the private runtime, local vault, credentials, sessions, logs, or project-specific memory.

## What Changed

Flion is no longer presented as only a Data Cloud workflow. The public demo now shows the broader **Agentic Super App** surface:

- Chat command center with `@` plugin/skill mentions and `/` commands.
- Native plugin and skill registry surfaced from the UI.
- Role-based agents for scope, design, architecture, implementation, QA, and release.
- Browser/computer dock concepts with explicit approval and action audit.
- Automation scheduler concepts with model selection and recurring loops.
- Memory/vault and flow-canvas concepts represented as sanitized product modules.
- Data Cloud Agents as the runnable vertical slice that proves tools, contracts, workers, QA, and release evidence.

## Safe Public Boundary

The private Flion/OpenClaw workspace is an operational system with local state and sensitive context. This public repository exists as a reviewable code sample for AI-agent, agentic workflow, automation, and AI platform roles.

It does **not** claim direct Google3 access or private internal-platform experience. It demonstrates learnable, public engineering practices: explicit contracts, reproducible checks, strict boundaries, tests, typed-ish data contracts, tool-mediated execution, and evidence-driven releases.

## Quick Start

```bash
npm install
npm test
npm run demo:data-cloud
npm run console:build
npm run quality
```

Run the static console:

```bash
npm run console:serve
```

Then open `http://localhost:4173`.

## Repository Map

- `src/contracts.mjs` defines roles, stages, and evidence requirements.
- `src/pipeline.mjs` implements the handoff and approval flow.
- `src/rag-index.mjs` provides a local lexical retrieval layer for sanitized notes.
- `src/super-app-profile.mjs` defines the public product surface for the Flion super app.
- `src/data-cloud-blueprint.mjs` defines the Data Cloud Agents architecture order and monorepo boundaries.
- `src/data-contracts.mjs` validates public datasets, tool calls, and safe read-only SQL.
- `src/mcp-tools.mjs` implements deterministic MCP-style tools for query, retrieval, SQL validation, sample code, and evidence envelopes.
- `src/data-worker.mjs` implements an in-memory async worker boundary.
- `src/data-cloud-demo.mjs` runs the end-to-end vertical slice and emits super-app demo data.
- `apps/console/` contains a static operator console driven by generated demo data.
- `docs/` explains architecture, safe positioning, and sanitization rules.
- `tools/quality/` scans for public-safety issues and unverifiable claims.

## Design Principle

Flion treats agentic delivery as an operating system, not a chat transcript. The UI can start in chat, but execution is governed by explicit context, capability routing, permissions, evidence, and release checks.

## Current End-To-End Demo

The `demo:data-cloud` script runs a public, deterministic vertical slice:

1. Creates a Flion work item.
2. Records scope, solution, architecture, implementation, QA, and release evidence.
3. Executes MCP-style tools against a sanitized dataset.
4. Runs SQL validation through an async worker.
5. Blocks release until QA evidence passes.
6. Emits a release handoff and the super-app profile consumed by the console.

## Architecture Sequence

1. Work intake contract
2. Data contracts
3. MCP tool layer
4. Async data worker
5. Agent runtime
6. Evaluation gates
7. Operator console
8. Observability
9. Security and sanitization
10. Release handoff

## Quality Gate

Run the full local validation:

```bash
npm run validate
```

This executes tests, runs the public demo quality check, scans for obvious secret patterns or unverifiable internal-platform claims, rebuilds the console data, and prints the demo release summary.
