/**
 * The glossary: every term has exactly one page that defines it.
 *
 * A page declares the terms it owns in `defines:`. Anywhere else, writing
 * `[[golden set]]` links to the owning page — the author names the term, the
 * build selects the source. An undefined term fails the build rather than
 * rendering as literal brackets.
 */

export const normalize = (term) => term.trim().toLowerCase();

/**
 * normalized term -> { term, page }.
 * The authored spelling is kept for display — "TTL" must not surface as "ttl".
 */
export function buildTermIndex(pages) {
  const index = new Map();
  for (const page of pages) {
    for (const term of page.defines ?? []) {
      index.set(normalize(term), { term, page });
    }
  }
  return index;
}

/** Every `[[term]]` in a string, with its offset, for lint and for rendering. */
/**
 * `[[term]]` links using the term as its own text. `[[term|display]]` links the
 * term while showing different words, so prose can say "partitioned" or
 * "idempotent" without bending the sentence around the canonical noun. The part
 * before the pipe is always what must resolve.
 */
export function termReferences(text) {
  return [...text.matchAll(/\[\[([^\]\n|]+)(?:\|([^\]\n]+))?\]\]/g)].map((m) => ({
    label: m[1].trim(),
    display: (m[2] ?? m[1]).trim(),
    index: m.index,
  }));
}

/** Pages claiming the same term, so the build can reject an ambiguous source. */
export function duplicateDefinitions(pages) {
  const seen = new Map();
  const clashes = [];
  for (const page of pages) {
    for (const term of page.defines ?? []) {
      const key = normalize(term);
      const owner = seen.get(key);
      if (owner) clashes.push({ term, page, owner });
      else seen.set(key, page);
    }
  }
  return clashes;
}
