const IDENTIFIER_RE = /^[a-z][a-z0-9_]*$/i;
const MUTATING_SQL_RE =
  /\b(insert|update|delete|drop|alter|create|truncate|grant|revoke|merge|replace|call|execute|copy)\b/i;
const COMMENT_SQL_RE = /--|\/\*|\*\//;

export const DATA_TYPES = Object.freeze(["string", "number", "boolean", "date", "json"]);

export function validateDatasetSpec(dataset) {
  const errors = [];

  if (!dataset || typeof dataset !== "object") {
    return { valid: false, errors: ["Dataset must be an object."] };
  }

  if (!dataset.id || typeof dataset.id !== "string") {
    errors.push("Dataset id is required.");
  }

  if (!Array.isArray(dataset.tables) || dataset.tables.length === 0) {
    errors.push("Dataset must include at least one table.");
  }

  const tableNames = new Set();
  for (const [tableIndex, table] of (dataset.tables ?? []).entries()) {
    const prefix = `tables[${tableIndex}]`;

    if (!table.name || !IDENTIFIER_RE.test(table.name)) {
      errors.push(`${prefix}.name must be a SQL-safe identifier.`);
      continue;
    }

    if (tableNames.has(table.name)) {
      errors.push(`Duplicate table name: ${table.name}.`);
    }
    tableNames.add(table.name);

    if (!Array.isArray(table.columns) || table.columns.length === 0) {
      errors.push(`${prefix}.columns must include at least one column.`);
    }

    const columnNames = new Set();
    for (const [columnIndex, column] of (table.columns ?? []).entries()) {
      const columnPrefix = `${prefix}.columns[${columnIndex}]`;
      if (!column.name || !IDENTIFIER_RE.test(column.name)) {
        errors.push(`${columnPrefix}.name must be a SQL-safe identifier.`);
      }
      if (columnNames.has(column.name)) {
        errors.push(`Duplicate column ${column.name} in table ${table.name}.`);
      }
      columnNames.add(column.name);
      if (!DATA_TYPES.includes(column.type)) {
        errors.push(`${columnPrefix}.type must be one of: ${DATA_TYPES.join(", ")}.`);
      }
    }

    if (!Array.isArray(table.rows)) {
      errors.push(`${prefix}.rows must be an array.`);
      continue;
    }

    for (const [rowIndex, row] of table.rows.entries()) {
      if (!row || typeof row !== "object" || Array.isArray(row)) {
        errors.push(`${prefix}.rows[${rowIndex}] must be an object.`);
        continue;
      }
      for (const key of Object.keys(row)) {
        if (!columnNames.has(key)) {
          errors.push(`${prefix}.rows[${rowIndex}] includes unknown column ${key}.`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function assertValidDatasetSpec(dataset) {
  const result = validateDatasetSpec(dataset);
  if (!result.valid) {
    throw new Error(`Invalid dataset spec: ${result.errors.join(" ")}`);
  }
  return dataset;
}

export function getTable(dataset, tableName) {
  return dataset.tables.find((table) => table.name === tableName) ?? null;
}

export function validateToolCall(toolCall) {
  const errors = [];
  if (!toolCall || typeof toolCall !== "object") {
    return { valid: false, errors: ["Tool call must be an object."] };
  }
  if (!toolCall.name || typeof toolCall.name !== "string") {
    errors.push("Tool call name is required.");
  }
  if (!toolCall.input || typeof toolCall.input !== "object" || Array.isArray(toolCall.input)) {
    errors.push("Tool call input must be an object.");
  }
  return { valid: errors.length === 0, errors };
}

export function validateSafeSql(sql, dataset, { maxLimit = 50 } = {}) {
  const errors = [];
  const text = String(sql ?? "").trim();

  if (!text) {
    return { valid: false, errors: ["SQL is required."], statement: null };
  }

  if (text.includes(";")) {
    errors.push("Only one statement is allowed and semicolons are blocked.");
  }
  if (COMMENT_SQL_RE.test(text)) {
    errors.push("SQL comments are blocked in the public demo.");
  }
  if (MUTATING_SQL_RE.test(text)) {
    errors.push("Only read-only SELECT queries are allowed.");
  }
  if (!/^select\s+/i.test(text)) {
    errors.push("Query must start with SELECT.");
  }

  const match = text.match(
    /^select\s+(.+?)\s+from\s+([a-z][a-z0-9_]*)(?:\s+where\s+([a-z][a-z0-9_]*)\s*=\s*('([^']*)'|"([^"]*)"|[0-9.]+))?(?:\s+limit\s+(\d+))?$/i,
  );

  if (!match) {
    errors.push("Query must match: SELECT <columns> FROM <table> [WHERE column = value] [LIMIT n].");
    return { valid: false, errors, statement: null };
  }

  const [, rawColumns, tableName, whereColumn, rawWhereValue, singleQuoted, doubleQuoted, limitText] = match;
  const table = getTable(dataset, tableName);
  if (!table) {
    errors.push(`Unknown table: ${tableName}.`);
    return { valid: false, errors, statement: null };
  }

  const tableColumns = new Set(table.columns.map((column) => column.name));
  const columns = rawColumns.trim() === "*"
    ? table.columns.map((column) => column.name)
    : rawColumns.split(",").map((column) => column.trim());

  for (const column of columns) {
    if (!tableColumns.has(column)) {
      errors.push(`Unknown column ${column} in table ${tableName}.`);
    }
  }

  if (whereColumn && !tableColumns.has(whereColumn)) {
    errors.push(`Unknown WHERE column ${whereColumn} in table ${tableName}.`);
  }

  const limit = limitText ? Number(limitText) : Math.min(maxLimit, 25);
  if (!Number.isInteger(limit) || limit < 1 || limit > maxLimit) {
    errors.push(`LIMIT must be between 1 and ${maxLimit}.`);
  }

  const whereValue = whereColumn
    ? (singleQuoted ?? doubleQuoted ?? rawWhereValue).replace(/^['"]|['"]$/g, "")
    : null;

  return {
    valid: errors.length === 0,
    errors,
    statement: errors.length
      ? null
      : {
          sql: text,
          columns,
          tableName,
          where: whereColumn ? { column: whereColumn, value: whereValue } : null,
          limit,
        },
  };
}

export function createResultEnvelope({ ok, kind, data = null, errors = [], meta = {} }) {
  return {
    ok: Boolean(ok),
    kind,
    data,
    errors,
    meta: {
      generatedAt: new Date().toISOString(),
      ...meta,
    },
  };
}
