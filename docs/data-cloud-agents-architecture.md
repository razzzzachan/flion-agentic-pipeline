# Flion Data Cloud Agents Architecture

Flion Data Cloud Agents is the next public layer of the Flion portfolio sample: a sanitized, reviewable AI/data engineering monorepo that demonstrates agentic workflows, MCP-style tools, async validation, and evaluation gates.

This is a **Google-style engineering sample**, not a claim of direct Google3 access. The goal is to show the public equivalent: explicit contracts, typed boundaries, reproducible checks, monorepo discipline, and careful release handoffs.

## Where This Lives

This work belongs in the public sanitized repo:

```text
C:\Portifolio Julio Cesar Betoni\public-repos\flion-agentic-pipeline
```

It should not live inside the private OpenClaw/Flion runtime because that workspace contains local state, memory, logs, credentials, and operational context. It also should not live directly in the portfolio app; the portfolio should reference it after the demo is credible.

## Architecture Block Order

1. `work-intake`: convert an ambiguous request into an executable work item.
2. `data-contracts`: define dataset, query, tool-call, job, and result schemas.
3. `mcp-tool-layer`: expose safe tools for query, semantic lookup, code generation, and validation.
4. `async-data-worker`: run heavier validation and data jobs outside the request path.
5. `agent-runtime`: coordinate role-based agents and explicit handoffs.
6. `evaluation-gates`: prevent self-approval with tests, evals, and reviewer-stage checks.
7. `operator-console`: show jobs, traces, decisions, datasets, and release state.
8. `observability`: capture logs, traces, quality scores, and runtime/cost metrics.
9. `security-sanitization`: protect private data, secrets, and runtime-specific context.
10. `release-handoff`: package architecture, test output, residual risks, and demo instructions.

The order is intentional: contracts come before tools, tools before agents, agents before evaluation, and evaluation before release.

## Monorepo Shape

```text
apps/
  console/              # operator UI for jobs, traces, and release readiness
services/
  mcp-gateway/          # MCP-style gateway for safe AI/data tools
  data-worker/          # async worker boundary for validation jobs
packages/
  protos/               # shared schemas and protocol contracts
  agents/               # role prompts, policies, and handoff rules
  evals/                # fixtures and regression gates
tools/
  build/                # future Bazel/build integration
  quality/              # repo-wide checks and public-safety validation
```

## First Demo Scenario

The first demo should answer this prompt:

```text
Analyze a small dataset, identify the useful tables, generate safe SQL examples,
create sample API documentation, and produce a release handoff with tests.
```

The demo should show:

- a work item moving through Flion stages
- MCP-style tools with validated inputs
- an async job result
- an evaluation gate that can fail
- a final release note with residual risks

## Runnable Slice

The current implementation includes a deterministic Node.js vertical slice:

```bash
npm test
npm run demo:data-cloud
```

Implemented modules:

- `src/data-contracts.mjs`: dataset, tool-call, and safe SQL validation.
- `src/mcp-tools.mjs`: MCP-style tools for query, retrieval, SQL validation, sample code, and evidence envelopes.
- `src/data-worker.mjs`: in-memory async worker boundary.
- `src/data-cloud-demo.mjs`: full pipeline execution from scope to release.

The first version is intentionally in-memory. That keeps the public artifact reviewable while leaving room for later Bazel, Python, Go, persistent queues, and a UI console.

## What We Will Not Claim

Do not say Julio has worked inside Google3 unless that becomes factually true. The safe positioning is:

```text
I have not worked inside Google3 directly, but I built a public AI/data monorepo
using typed contracts, MCP-style tools, async workers, evaluation gates, CI-ready
tests, and sanitized release handoffs.
```
