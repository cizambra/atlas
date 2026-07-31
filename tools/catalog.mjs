import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The razor catalog.
 *
 * The estate is complete from day one: every razor has a statement, a family and a
 * source in `content/razors/_catalog.json`, whether or not anyone has written its full
 * page yet. A full page overrides its catalog entry and the index links to it.
 *
 * This is why the catalog is data rather than one stub file per razor: a stub cannot
 * satisfy the razor block contract, and weakening that contract to admit stubs would
 * cost more than it buys.
 */
export function loadCatalog(contentDir) {
  const file = join(contentDir, 'razors', '_catalog.json');
  if (!existsSync(file)) return { families: [], razors: [] };
  return JSON.parse(readFileSync(file, 'utf8'));
}

/**
 * Merge the catalog with the razor pages that exist, in family order.
 * Returns [{ family, entries: [{ id, title, statement, source, page|null }] }].
 */
export function mergeCatalog(catalog, pages) {
  const byId = new Map(pages.filter((p) => p.type === 'razor').map((p) => [p.slug, p]));

  const groups = catalog.families.map((family) => ({ family, entries: [] }));
  const byFamily = new Map(groups.map((g) => [g.family, g]));

  for (const razor of catalog.razors) {
    const group = byFamily.get(razor.family);
    if (!group) continue;
    group.entries.push({ ...razor, page: byId.get(razor.id) ?? null });
  }

  for (const group of groups) group.entries.sort((a, b) => a.title.localeCompare(b.title));
  return groups.filter((g) => g.entries.length > 0);
}

/** Catalog integrity, reported as lint violations rather than thrown. */
export function catalogViolations(catalog, pages) {
  const out = [];
  const file = 'razors/_catalog.json';
  const seen = new Set();
  const families = new Set(catalog.families);

  for (const razor of catalog.razors) {
    if (seen.has(razor.id)) {
      out.push({ rule: 'catalog-unique', file, line: 1, message: `"${razor.id}" appears twice` });
    }
    seen.add(razor.id);

    for (const field of ['id', 'title', 'family', 'statement', 'source']) {
      if (!razor[field]) {
        out.push({ rule: 'catalog-complete', file, line: 1,
          message: `"${razor.id ?? '(no id)'}" is missing ${field}` });
      }
    }

    if (razor.family && !families.has(razor.family)) {
      out.push({ rule: 'catalog-complete', file, line: 1,
        message: `"${razor.id}" is in family "${razor.family}", which is not in families[]` });
    }
  }

  for (const page of pages.filter((p) => p.type === 'razor')) {
    if (!seen.has(page.slug)) {
      out.push({ rule: 'catalog-complete', file: page.filePath, line: 1,
        message: `razor page "${page.slug}" has no catalog entry — the index would not list it` });
    }
  }

  return out;
}
