import { mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import { loadContent } from './content.mjs';
import { lintPage, lintCollection } from './lint.mjs';
import { renderPage, renderRazorIndex, renderHome } from './template.mjs';
import { buildSearchIndex } from './search.mjs';

const write = (distDir, relative, contents, written) => {
  const target = join(distDir, relative);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents);
  written.push(relative);
};

export function build({ contentDir, distDir, assetsDir }) {
  const { pages, sections } = loadContent(contentDir);

  const violations = [
    ...pages.flatMap(lintPage),
    ...lintCollection(pages, sections),
  ];
  if (violations.length > 0) return { written: [], violations };

  rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir, { recursive: true });

  const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
  const pagesBySlug = new Map(pages.map((p) => [p.slug, p]));
  const written = [];

  for (const page of pages) {
    const ctx = { md, sections, pagesBySlug, depth: 1 };
    write(distDir, `${page.section}/${page.slug}.html`, renderPage(page, ctx), written);
  }

  const razors = pages.filter((p) => p.type === 'razor');
  write(distDir, 'razors/index.html', renderRazorIndex(razors, { md, sections, pagesBySlug, depth: 1 }), written);
  write(distDir, 'index.html', renderHome({ md, sections, pagesBySlug, depth: 0 }), written);
  write(distDir, 'search-index.json', JSON.stringify(buildSearchIndex(pages)), written);

  for (const asset of ['atlas.css', 'search.js']) {
    copyFileSync(join(assetsDir, asset), join(distDir, asset));
    written.push(asset);
  }

  return { written, violations: [] };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const { written, violations } = build({
    contentDir: join(root, 'content'),
    distDir: join(root, 'dist'),
    assetsDir: join(root, 'assets'),
  });
  if (violations.length > 0) {
    for (const v of violations) console.error(`${v.file}:${v.line} [${v.rule}] ${v.message}`);
    console.error(`\n${violations.length} violation(s) — build failed.`);
    process.exit(1);
  }
  console.log(`Built ${written.length} files.`);
}
