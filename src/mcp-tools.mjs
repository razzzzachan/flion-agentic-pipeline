import { buildLexicalIndex, search } from "./rag-index.mjs";
import {
  assertValidDatasetSpec,
  createResultEnvelope,
  getTable,
  validateSafeSql,
  validateToolCall,
} from "./data-contracts.mjs";

function toSearchDocuments(dataset) {
  return dataset.tables.map((table) => ({
    id: `table:${table.name}`,
    title: table.name,
    summary: table.description ?? `Dataset table ${table.name}`,
    body: table.columns
      .map((column) => `${column.name}: ${column.type}. ${column.description ?? ""}`)
      .join("\n"),
    tags: ["dataset", table.name, ...(table.tags ?? [])],
  }));
}

function projectRows(rows, columns) {
  return rows.map((row) =>
    Object.fromEntries(columns.map((column) => [column, row[column] ?? null])),
  );
}

function applyWhere(rows, where) {
  if (!where) return rows;
  return rows.filter((row) => String(row[where.column]) === String(where.value));
}

function runSelect(dataset, statement) {
  const table = getTable(dataset, statement.tableName);
  const filteredRows = applyWhere(table.rows, statement.where);
  return projectRows(filteredRows.slice(0, statement.limit), statement.columns);
}

function generateSampleCode({ endpoint = "/tools/query_dataset", sql, language = "javascript" }) {
  const payload = JSON.stringify({ sql }, null, 2);
  if (language === "curl") {
    return [
      "curl -X POST http://localhost:3000/tools/query_dataset \\",
      "  -H 'content-type: application/json' \\",
      `  -d '${payload.replace(/\n/g, "")}'`,
    ].join("\n");
  }

  return [
    "const response = await fetch(\"http://localhost:3000" + endpoint + "\", {",
    "  method: \"POST\",",
    "  headers: { \"content-type\": \"application/json\" },",
    `  body: JSON.stringify(${payload.replace(/\n/g, "\n  ")}),`,
    "});",
    "",
    "const result = await response.json();",
    "console.log(result);",
  ].join("\n");
}

export function createDataCloudToolRegistry({ dataset, documents = [] } = {}) {
  assertValidDatasetSpec(dataset);
  const index = buildLexicalIndex([...toSearchDocuments(dataset), ...documents]);

  const tools = {
    validate_sql: {
      name: "validate_sql",
      description: "Validate a read-only SQL query against the public dataset contract.",
      run(input) {
        const validation = validateSafeSql(input.sql, dataset, { maxLimit: input.maxLimit ?? 50 });
        return createResultEnvelope({
          ok: validation.valid,
          kind: "sql_validation",
          data: validation.statement,
          errors: validation.errors,
          meta: { tool: "validate_sql" },
        });
      },
    },
    query_dataset: {
      name: "query_dataset",
      description: "Run a safe SELECT query against the in-memory public demo dataset.",
      run(input) {
        const validation = validateSafeSql(input.sql, dataset, { maxLimit: input.maxLimit ?? 50 });
        if (!validation.valid) {
          return createResultEnvelope({
            ok: false,
            kind: "dataset_query",
            errors: validation.errors,
            meta: { tool: "query_dataset" },
          });
        }

        const rows = runSelect(dataset, validation.statement);
        return createResultEnvelope({
          ok: true,
          kind: "dataset_query",
          data: {
            rows,
            rowCount: rows.length,
            statement: validation.statement,
          },
          meta: { tool: "query_dataset" },
        });
      },
    },
    semantic_search: {
      name: "semantic_search",
      description: "Search sanitized dataset and architecture notes with lexical retrieval.",
      run(input) {
        const results = search(index, input.query, { top: input.top ?? 5, tag: input.tag });
        return createResultEnvelope({
          ok: true,
          kind: "semantic_search",
          data: { results },
          meta: { tool: "semantic_search", query: input.query },
        });
      },
    },
    generate_sample_code: {
      name: "generate_sample_code",
      description: "Generate deterministic sample client code for a safe tool call.",
      run(input) {
        const validation = validateSafeSql(input.sql, dataset, { maxLimit: input.maxLimit ?? 50 });
        if (!validation.valid) {
          return createResultEnvelope({
            ok: false,
            kind: "sample_code",
            errors: validation.errors,
            meta: { tool: "generate_sample_code" },
          });
        }

        return createResultEnvelope({
          ok: true,
          kind: "sample_code",
          data: {
            language: input.language ?? "javascript",
            code: generateSampleCode(input),
            validatesSql: true,
          },
          meta: { tool: "generate_sample_code" },
        });
      },
    },
    record_evidence: {
      name: "record_evidence",
      description: "Wrap stage evidence in a deterministic envelope before it enters the pipeline.",
      run(input) {
        if (!input.stage || !input.key || typeof input.value === "undefined") {
          return createResultEnvelope({
            ok: false,
            kind: "evidence",
            errors: ["stage, key, and value are required."],
            meta: { tool: "record_evidence" },
          });
        }

        return createResultEnvelope({
          ok: true,
          kind: "evidence",
          data: {
            stage: input.stage,
            key: input.key,
            value: input.value,
            actor: input.actor ?? input.stage,
          },
          meta: { tool: "record_evidence" },
        });
      },
    },
  };

  return {
    listTools() {
      return Object.values(tools).map(({ name, description }) => ({ name, description }));
    },
    getTool(name) {
      return tools[name] ?? null;
    },
    executeTool(name, input = {}) {
      const toolCall = validateToolCall({ name, input });
      if (!toolCall.valid) {
        return createResultEnvelope({
          ok: false,
          kind: "tool_call",
          errors: toolCall.errors,
          meta: { tool: name },
        });
      }

      const tool = tools[name];
      if (!tool) {
        return createResultEnvelope({
          ok: false,
          kind: "tool_call",
          errors: [`Unknown tool: ${name}.`],
          meta: { tool: name },
        });
      }
      return tool.run(input);
    },
  };
}
