# Flion Agentic Pipeline

Sanitized public excerpt of **Flion**, a multi-agent production pipeline designed by Julio Cesar Betoni for turning ambiguous work requests into validated delivery.

This repository is intentionally small and safe to share. It demonstrates the core operating ideas without exposing the private runtime, local vault, credentials, sessions, logs, or project-specific memory.

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
```

## Repository Map

- `src/contracts.mjs` defines roles, stages, and evidence requirements.
- `src/pipeline.mjs` implements the handoff and approval flow.
- `src/rag-index.mjs` provides a local lexical retrieval layer for sanitized notes.
- `examples/work-item.sample.json` shows the shape of a work item.
- `docs/architecture.md` explains the pipeline design.
- `docs/security-and-sanitization.md` documents what was removed before publishing.

## Design Principle

Flion treats agentic delivery as an operating system, not a chat transcript. Each step must leave evidence, each handoff must be explicit, and implementation cannot self-approve.

