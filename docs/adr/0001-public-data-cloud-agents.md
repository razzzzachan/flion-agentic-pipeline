# ADR 0001: Build Flion Public Demo In The Sanitized Repo

## Status

Accepted.

## Context

The private Flion/OpenClaw workspace is a real operational system with local state, memory, logs, credentials, agent history, and project-specific context. It is not a safe place to build a public Braintrust-facing code sample directly.

Braintrust AI/Data Cloud roles reward evidence of agentic AI, MCP-style tools, monorepo discipline, tests, and clean engineering boundaries. The broader Flion product also includes chat-driven plugin/skill routing, command-palette workflows, role agents, browser/session surfaces, automations, and release operations. A public project should demonstrate those skills without exposing private runtime data or making unverifiable claims.

## Decision

Build the public Flion demo inside:

```text
public-repos/flion-agentic-pipeline
```

This keeps the project close to the existing Flion proof while making the new architecture public, sanitized, and reviewable. Data Cloud Agents remains the runnable vertical slice; the console presents the wider agentic super-app surface.

## Consequences

- The portfolio can link to this repo once the demo is credible.
- The private OpenClaw runtime remains untouched.
- The project can honestly target Google-style engineering requirements without claiming Google3 access.
- Any future plugin, skill, browser, automation, Bazel, Python, Go, or MCP implementation must pass through the public-safety boundary before being committed.
