# Architecture

Flion is organized as a production pipeline for AI-assisted software work.

## Agent Roles

- `scope`: turns a fuzzy request into acceptance criteria and constraints.
- `solution`: proposes the product and workflow approach.
- `architecture`: defines technical boundaries, contracts, and risks.
- `implementation`: produces the code or operational artifact.
- `qa`: validates behavior against the original criteria.
- `release`: packages the result, notes residual risk, and closes the loop.

## Handoff Model

Each stage owns a narrow responsibility and produces evidence for the next stage. A handoff is valid only when:

- The source stage matches the current work item stage.
- Required evidence for that stage exists.
- The next stage is the expected successor.
- The approver is not the same role that produced the implementation evidence.

This keeps the pipeline from becoming a single-agent loop where the same actor scopes, builds, validates, and releases without friction.

## Retrieval Layer

The private Flion workspace uses local memory and retrieval to rehydrate context after interruptions. This public excerpt includes a sanitized lexical retrieval module to show the same concept without exposing private notes.

The retrieval layer is advisory. It can suggest context, but it cannot approve a stage or override the handoff contract.

