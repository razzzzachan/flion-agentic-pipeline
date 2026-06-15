const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

export function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function tokenize(value) {
  return [...new Set(normalizeText(value).match(/[a-z0-9][a-z0-9_-]{1,}/g) ?? [])]
    .filter((token) => !STOPWORDS.has(token));
}

export function buildLexicalIndex(documents) {
  return documents.map((document) => {
    const text = [document.title, document.summary, document.body, document.tags?.join(" ")]
      .filter(Boolean)
      .join("\n");

    return {
      id: document.id,
      title: document.title,
      summary: document.summary ?? "",
      tags: document.tags ?? [],
      tokens: tokenize(text),
      source: document.source ?? "sanitized-note",
    };
  });
}

export function search(index, query, { top = 5, tag } = {}) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  return index
    .filter((entry) => !tag || entry.tags.includes(tag))
    .map((entry) => {
      const overlap = queryTokens.filter((token) => entry.tokens.includes(token));
      return {
        ...entry,
        score: overlap.length / queryTokens.length,
        matchedTokens: overlap,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, top);
}

