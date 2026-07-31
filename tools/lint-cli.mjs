import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent } from './content.mjs';
import { lintPage, lintCollection } from './lint.mjs';
import { loadCatalog, catalogViolations } from './catalog.mjs';

/**
 * The content contract, checked independently of anything that renders it.
 *
 * Every rule reads markdown and frontmatter only. Nothing here touches the
 * templates, so the atlas can change its vessel — a different generator, a
 * different theme — without losing the discipline that makes the pages worth
 * reading. That separation is what keeps the choice of renderer a two-way door.
 */
export function lintContent(contentDir) {
  const { pages } = loadContent(contentDir);
  const catalog = loadCatalog(contentDir);
  return {
    pages: pages.filter((p) => p.type !== 'generated').length,
    violations: [
      ...pages.flatMap(lintPage),
      ...lintCollection(pages),
      ...catalogViolations(catalog, pages),
    ],
  };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const { pages, violations } = lintContent(process.argv[2] ?? join(root, 'content'));

  for (const v of violations) console.error(`${v.file}:${v.line} [${v.rule}] ${v.message}`);

  if (violations.length > 0) {
    console.error(`\n${violations.length} violation(s) across ${pages} pages.`);
    process.exit(1);
  }
  console.log(`${pages} pages, no violations.`);
}
