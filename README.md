# Flion Agentic Pipeline

Sanitized public excerpt of **Flion**, a multi-agent production pipeline designed by Julio Cesar Betoni for turning ambiguous work requests into validated delivery.

This repository is intentionally small and safe to share. It demonstrates the core operating ideas without exposing the private runtime, local vault, credentials, sessions, logs, or project-specific memory.

## New Direction: Data Cloud Agents

The next layer is **Flion Data Cloud Agents**: a public Google-style engineering sample for agentic AI/data workflows. It adds a monorepo-shaped architecture for MCP-style tools, async workers, shared contracts, evaluations, an operator console, and sanitized release handoffs.

This is not a claim of direct Google3 access. It is a public demonstration of the engineering practices that are learnable and reviewable outside Google: explicit contracts, reproducible checks, strict boundaries, tests, and evidence-driven releases.

## What This Shows

- Role-based agents for scope, solution design, architecture, implementation, QA, and release.
- Explicit handoffs between stages.
- Evidence gates so an agent cannot approve its own work.
- Lightweight retrieval support for rehydrating context from sanitized notes.
- Deterministic tests around the handoff contract.

## Why It Exists

The private Flion workspace is an operational system with local state and sensitive context. This public repository exists as a reviewable code sample for AI-agent, agentic workflow, and automation roles.

## Quick Start

```bash
npm install
npm test
npm run demo:data-cloud
npm run console:build
npm run quality
```

## Repository Map

- `src/contracts.mjs` defines roles, stages, and evidence requirements.
- `src/pipeline.mjs` implements the handoff and approval flow.
- `src/rag-index.mjs` provides a local lexical retrieval layer for sanitized notes.
- `src/data-cloud-blueprint.mjs` defines the Data Cloud Agents architecture order and monorepo boundaries.
- `src/data-contracts.mjs` validates public datasets, tool calls, and safe read-only SQL.
- `src/mcp-tools.mjs` implements deterministic MCP-style tools for query, retrieval, SQL validation, sample code, and evidence envelopes.
- `src/data-worker.mjs` implements an in-memory async worker boundary.
- `src/data-cloud-demo.mjs` runs the end-to-end Data Cloud Agents vertical slice.
- `examples/work-item.sample.json` shows the shape of a work item.
- `examples/data-cloud.dataset.json` is the sanitized public dataset fixture.
- `examples/run-data-cloud-demo.mjs` prints the demo release summary.
- `docs/architecture.md` explains the pipeline design.
- `docs/data-cloud-agents-architecture.md` explains the new AI/data monorepo direction.
- `docs/braintrust-positioning.md` provides safe wording for applications and interviews.
- `docs/security-and-sanitization.md` documents what was removed before publishing.
- `apps/`, `services/`, `packages/`, and `tools/` contain the first public monorepo boundaries.
- `apps/console/` contains a static operator console driven by generated demo data.

## Design Principle

Flion treats agentic delivery as an operating system, not a chat transcript. Each step must leave evidence, each handoff must be explicit, and implementation cannot self-approve.

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

## Current End-To-End Demo

The `demo:data-cloud` script runs a public, deterministic vertical slice:

1. Creates a Flion work item.
2. Records scope, solution, architecture, implementation, QA, and release evidence.
3. Executes MCP-style tools against a sanitized dataset.
4. Runs SQL validation through an async worker.
5. Blocks release until QA evidence passes.
6. Prints a final release handoff.

## Quality Gate

Run the full local validation:

```bash
npm run validate
```

This executes tests, runs the public demo quality check, scans for obvious secret patterns or unverifiable Google3 claims, and prints the demo release summary.

## Operator Console

Build static console data:

```bash
npm run console:build
```

Run the local console:

```bash
npm run console:serve
```

Then open `http://localhost:4173`.
