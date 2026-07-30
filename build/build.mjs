import { mkdirSync, writeFileSync, readFileSync, copyFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMarkdown } from './markdown.mjs';
import { loadContent } from './content.mjs';
import { lintContent } from './lint-cli.mjs';
import { renderPage, renderRazorIndex, renderHome, renderGlossary } from './template.mjs';
import { buildSearchIndex } from './search.mjs';
import { buildTermIndex, normalize } from './terms.mjs';
import { loadCatalog, mergeCatalog } from './catalog.mjs';

const write = (distDir, relative, contents, written) => {
  const target = join(distDir, relative);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents);
  written.push(relative);
};

const titleCase = (id) => id.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

// The nav this generator renders used to come straight from `_section.json`.
// That file is gone now that Docusaurus derives its sidebar from the folder
// tree, so this rebuilds an equivalent shape from `page.section` / `page.group`
// (themselves derived from the folder tree by loadContent). This generator is
// scheduled for deletion in Task 9 — until then its nav still needs a home.
function deriveSections(pages) {
  const sections = new Map();
  for (const page of pages) {
    if (!page.section) continue;
    if (!sections.has(page.section)) {
      sections.set(page.section, { id: page.section, title: titleCase(page.section), groups: new Map() });
    }
    const groups = sections.get(page.section).groups;
    const groupId = page.group ?? '';
    if (!groups.has(groupId)) {
      groups.set(groupId, { id: groupId, title: titleCase(groupId), pages: [] });
    }
    groups.get(groupId).pages.push(page.slug);
  }
  for (const section of sections.values()) section.groups = [...section.groups.values()];
  return sections;
}

export function build({ contentDir, distDir, assetsDir, mermaidBundle, katexDir }) {
  const { pages } = loadContent(contentDir);
  const sections = deriveSections(pages);

  const catalog = loadCatalog(contentDir);
  // The same renderer-independent check the lint CLI runs; the build simply
  // refuses to emit anything that would fail it.
  const { violations } = lintContent(contentDir);
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

  // Local SVGs are inlined into the page so they inherit the theme's colours.
  const readAsset = (relative) => {
    const file = join(assetsDir, relative);
    return existsSync(file) ? readFileSync(file, 'utf8') : null;
  };

  for (const page of pages) {
    const ctx = { md, sections, pagesBySlug, readAsset, depth: 1 };
    write(distDir, `${page.section}/${page.slug}.html`, renderPage(page, ctx), written);
  }

  const razorGroups = mergeCatalog(catalog, pages);
  write(distDir, 'razors/index.html', renderRazorIndex(razorGroups, { md, sections, pagesBySlug, depth: 1 }), written);
  write(distDir, 'glossary.html', renderGlossary(terms, { md, sections, pagesBySlug, depth: 0 }), written);
  write(distDir, 'index.html', renderHome({ md, sections, pagesBySlug, depth: 0 }), written);
  write(distDir, 'search-index.json', JSON.stringify(buildSearchIndex(pages)), written);

  for (const asset of ['atlas.css', 'search.js', 'mermaid-init.js']) {
    copyFileSync(join(assetsDir, asset), join(distDir, asset));
    written.push(asset);
  }

  // favicon.svg moved to static/ during the docusaurus migration spike (Docusaurus
  // expects it there). This generator is scheduled for deletion in Task 9 — until
  // then it still needs to ship a favicon into dist/, so it reads from the new home.
  const faviconSrc = join(assetsDir, '..', 'static', 'favicon.svg');
  if (existsSync(faviconSrc)) {
    copyFileSync(faviconSrc, join(distDir, 'favicon.svg'));
    written.push('favicon.svg');
  }

  // Downloaded illustrations. Local copies rather than hotlinks: the site stays
  // self-contained and a moved upstream file cannot silently blank a page.
  const imgDir = join(assetsDir, 'img');
  if (existsSync(imgDir)) {
    cpSync(imgDir, join(distDir, 'img'), { recursive: true });
    written.push('img/');
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
