# ADR 0001: Build Flion Data Cloud Agents In The Public Sanitized Repo

## Status

Accepted.

## Context

The private Flion/OpenClaw workspace is a real operational system with local state, memory, logs, credentials, agent history, and project-specific context. It is not a safe place to build a public Braintrust-facing code sample directly.

Braintrust AI/Data Cloud roles reward evidence of agentic AI, MCP-style tools, monorepo discipline, tests, and clean engineering boundaries. A public project should demonstrate those skills without exposing private runtime data or making unverifiable claims.

## Decision

Build Flion Data Cloud Agents inside:

```text
public-repos/flion-agentic-pipeline
```

This keeps the project close to the existing Flion proof while making the new architecture public, sanitized, and reviewable.

## Consequences

- The portfolio can link to this repo once the demo is credible.
- The private OpenClaw runtime remains untouched.
- The project can honestly target Google-style engineering requirements without claiming Google3 access.
- Any future Bazel, Python, Go, or MCP implementation must pass through the public-safety boundary before being committed.
