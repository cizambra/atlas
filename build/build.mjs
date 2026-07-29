import { mkdirSync, writeFileSync, copyFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMarkdown } from './markdown.mjs';
import { loadContent } from './content.mjs';
import { lintPage, lintCollection } from './lint.mjs';
import { renderPage, renderRazorIndex, renderHome, renderGlossary } from './template.mjs';
import { buildSearchIndex } from './search.mjs';
import { buildTermIndex, normalize } from './terms.mjs';

const write = (distDir, relative, contents, written) => {
  const target = join(distDir, relative);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents);
  written.push(relative);
};

export function build({ contentDir, distDir, assetsDir, mermaidBundle, katexDir }) {
  const { pages, sections } = loadContent(contentDir);

  const violations = [
    ...pages.flatMap(lintPage),
    ...lintCollection(pages, sections),
  ];
  if (violations.length > 0) return { written: [], violations };

  rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir, { recursive: true });

  const terms = buildTermIndex(pages);
  const resolveTerm = (label, env) => {
    const entry = terms.get(normalize(label));
    if (!entry) return null;
    if (env?.page && entry.page.slug === env.page.slug) return null;
    return `../${entry.page.section}/${entry.page.slug}.html`;
  };

  const md = createMarkdown({ resolveTerm });
  const pagesBySlug = new Map(pages.map((p) => [p.slug, p]));
  const written = [];

  for (const page of pages) {
    const ctx = { md, sections, pagesBySlug, depth: 1 };
    write(distDir, `${page.section}/${page.slug}.html`, renderPage(page, ctx), written);
  }

  const razors = pages.filter((p) => p.type === 'razor');
  write(distDir, 'razors/index.html', renderRazorIndex(razors, { md, sections, pagesBySlug, depth: 1 }), written);
  write(distDir, 'glossary.html', renderGlossary(terms, { md, sections, pagesBySlug, depth: 0 }), written);
  write(distDir, 'index.html', renderHome({ md, sections, pagesBySlug, depth: 0 }), written);
  write(distDir, 'search-index.json', JSON.stringify(buildSearchIndex(pages)), written);

  for (const asset of ['atlas.css', 'search.js', 'mermaid-init.js']) {
    copyFileSync(join(assetsDir, asset), join(distDir, asset));
    written.push(asset);
  }

  // mermaid ships as a devDependency and is copied into dist rather than committed:
  // the bundle is ~3.5 MB, which does not belong in git history.
  if (mermaidBundle && existsSync(mermaidBundle)) {
    copyFileSync(mermaidBundle, join(distDir, 'mermaid.min.js'));
    written.push('mermaid.min.js');
  }

  // KaTeX renders to HTML at build time, so only its stylesheet and fonts ship.
  // katex.min.css references fonts at url(fonts/...), so the directory name is fixed.
  if (katexDir && existsSync(katexDir)) {
    copyFileSync(join(katexDir, 'katex.min.css'), join(distDir, 'katex.min.css'));
    cpSync(join(katexDir, 'fonts'), join(distDir, 'fonts'), { recursive: true });
    written.push('katex.min.css', 'fonts/');
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
    mermaidBundle: join(root, 'node_modules', 'mermaid', 'dist', 'mermaid.min.js'),
    katexDir: join(root, 'node_modules', 'katex', 'dist'),
  });
  if (violations.length > 0) {
    for (const v of violations) console.error(`${v.file}:${v.line} [${v.rule}] ${v.message}`);
    console.error(`\n${violations.length} violation(s) — build failed.`);
    process.exit(1);
  }
  console.log(`Built ${written.length} files.`);
}
