# Data Worker Service

Async worker boundary for jobs that should not run inside a request/agent turn.

Planned responsibilities:

- validate SQL examples
- run generated-code checks
- process dataset summaries
- emit structured job results
- record retryable failures

Current public implementation lives in `src/data-worker.mjs`.
