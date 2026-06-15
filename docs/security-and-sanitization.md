# Security And Sanitization

This repository is a public excerpt. The private Flion workspace contains local runtime state and project-specific context that should not be public.

## Excluded From This Repo

- API keys, tokens, OAuth state, and provider credentials.
- Local vault notes, customer/project memory, logs, browser state, and sessions.
- Generated runtime files and machine-specific configuration.
- Private task outputs or client-specific artifacts.

## Included

- Generic workflow contracts.
- Sanitized orchestration code.
- A safe retrieval example.
- Tests that demonstrate the handoff policy.

## Operating Rule

Public code should explain the architecture without leaking the operating environment. If a file contains secrets, account state, local memory, or private project content, it does not belong here.

