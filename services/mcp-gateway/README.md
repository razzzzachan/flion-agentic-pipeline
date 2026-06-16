# MCP Gateway Service

Public service boundary for safe AI/data tools.

Planned tools:

- `query_dataset`
- `semantic_search`
- `generate_sample_code`
- `validate_sql`
- `record_evidence`

The gateway must validate inputs and avoid executing unbounded or private operations.

Current public implementation lives in `src/mcp-tools.mjs`.
