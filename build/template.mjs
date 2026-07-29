import { countWords, stripFences } from './blocks.mjs';

/** Average adult reading speed is ~200 wpm. Computed, never typed, so it cannot drift. */
const readingMinutes = (text) => Math.max(1, Math.round(countWords(stripFences(text)) / 200));

const escape = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const prefix = (depth) => (depth === 0 ? '' : '../'.repeat(depth));

const hrefFor = (page, depth) => `${prefix(depth)}${page.section}/${page.slug}.html`;

function shell({ title, depth, nav, main }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)} · Atlas</title>
<link rel="stylesheet" href="${prefix(depth)}katex.min.css">
<link rel="stylesheet" href="${prefix(depth)}atlas.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="topbar">
  <a class="brand" href="${prefix(depth)}index.html">Atlas</a>
  <a class="topnav" href="${prefix(depth)}glossary.html">Glossary</a>
  <a class="topnav" href="${prefix(depth)}razors/index.html">Razors</a>
  <input id="search" class="search" type="search" placeholder="Search" autocomplete="off"
         data-index="${prefix(depth)}search-index.json" data-prefix="${prefix(depth)}">
  <div id="results" class="results" hidden></div>
</header>
<div class="layout">
${nav}
<main id="main">
${main}
</main>
</div>
<script src="${prefix(depth)}search.js"></script>
<script src="${prefix(depth)}mermaid.min.js"></script>
<script src="${prefix(depth)}mermaid-init.js"></script>
</body>
</html>
`;
}

function renderNav(ctx, currentSlug) {
  const sections = [...ctx.sections.values()].map((section) => {
    const groups = section.groups.map((group) => {
      const items = group.pages.map((slug) => {
        const page = ctx.pagesBySlug.get(slug);
        if (!page) return '';
        const current = slug === currentSlug ? ' aria-current="page"' : '';
        return `<li><a href="${hrefFor(page, ctx.depth)}"${current}>${escape(page.title)}</a></li>`;
      }).join('\n');
      return `<li class="nav-group"><span class="nav-group-title">${escape(group.title)}</span><ul>\n${items}\n</ul></li>`;
    }).join('\n');
    return `<li class="nav-section"><span class="nav-section-title">${escape(section.title)}</span><ul>\n${groups}\n</ul></li>`;
  }).join('\n');
  return `<nav class="sidebar" aria-label="Sections"><ul>\n${sections}\n</ul></nav>`;
}

function renderBlocks(page, ctx) {
  return page.blocks.map((block) => {
    const cls = slugify(block.heading);
    const meta = block.heading === 'Speedrun'
      ? `<span class="reading-time">${readingMinutes(block.text)} min</span>`
      : '';
    return `<section class="block block--${cls}">
<h2>${escape(block.heading)}${meta}</h2>
${ctx.md.render(block.text, { page })}
</section>`;
  }).join('\n');
}

/**
 * A local .svg is inlined so it inherits the page's colours through CSS and
 * follows the light/dark theme. Anything else — a downloaded raster, a remote
 * URL — renders as an <img>, which cannot be themed but does not need to be.
 */
function renderIllustration(page, ctx) {
  if (!page.illustration) return '';

  const isLocalSvg = page.illustration.endsWith('.svg') && !/^https?:/.test(page.illustration);
  const inlined = isLocalSvg ? ctx.readAsset?.(page.illustration) : null;

  const art = inlined
    ? `<div class="illustration-art" role="img" aria-label="${escape(page.illustrationAlt)}">${inlined}</div>`
    : `<img src="${escape(remoteOrLocal(page.illustration, ctx.depth))}" alt="${escape(page.illustrationAlt)}">`;

  const credit = page.illustrationSource
    ? `<a href="${escape(page.illustrationSource)}">${escape(page.illustrationCredit)}</a>`
    : escape(page.illustrationCredit);

  // The caption explains the diagram; the credit says where it came from. A
  // reader who cannot read the picture is not helped by an attribution line.
  const caption = page.illustrationCaption
    ? `<span class="illustration-caption">${escape(page.illustrationCaption)}</span>`
    : '';

  return `<figure class="illustration">
${art}
<figcaption>${caption}<span class="illustration-credit">${credit}</span></figcaption>
</figure>`;
}

const remoteOrLocal = (src, depth) => (/^https?:/.test(src) ? src : `${prefix(depth)}${src}`);

/** Rendered above the page: what to read first to arrive with the vocabulary. */
function renderPrereqs(page, ctx) {
  const slugs = page.prereq ?? [];
  if (slugs.length === 0) return '';
  const items = slugs.map((slug) => {
    const target = ctx.pagesBySlug.get(slug);
    if (!target) return '';
    return `<li><a href="${hrefFor(target, ctx.depth)}">${escape(target.title)}</a></li>`;
  }).join('\n');
  return `<nav class="prereq" aria-label="Read first">
<span class="prereq-label">Read first</span>
<ul>\n${items}\n</ul>
</nav>`;
}

function renderRazorLinks(page, ctx) {
  if (page.razors.length === 0) return '';
  const items = page.razors.map((slug) => {
    const razor = ctx.pagesBySlug.get(slug);
    if (!razor) return '';
    return `<li><a href="${hrefFor(razor, ctx.depth)}">${escape(razor.title)}</a></li>`;
  }).join('\n');
  return `<aside class="razor-links"><h2>Razors this rests on</h2><ul>\n${items}\n</ul></aside>`;
}

function renderSources(page) {
  if (page.sources.length === 0) return '';
  const items = page.sources.map((s) => `<li>${escape(s)}</li>`).join('\n');
  return `<aside class="sources"><h2>Sources</h2><ul>\n${items}\n</ul></aside>`;
}

export function renderPage(page, ctx) {
  const kicker = page.type === 'razor' ? page.family : page.group;
  const main = `<article class="page page--${escape(page.type)}">
<p class="kicker">${escape(kicker ?? '')}</p>
<h1 class="page-title">${escape(page.title)}</h1>
${page.summary ? `<p class="summary">${escape(page.summary)}</p>` : ''}
${renderPrereqs(page, ctx)}
${renderIllustration(page, ctx)}
${renderBlocks(page, ctx)}
${renderRazorLinks(page, ctx)}
${renderSources(page)}
</article>`;
  return shell({ title: page.title, depth: ctx.depth, nav: renderNav(ctx, page.slug), main });
}

export function renderRazorIndex(groups, ctx) {
  const total = groups.reduce((n, g) => n + g.entries.length, 0);
  const written = groups.reduce((n, g) => n + g.entries.filter((e) => e.page).length, 0);

  const families = groups.map(({ family, entries }) => {
    const rows = entries.map((entry) => {
      // A written page overrides its catalog entry: its Statement block is the
      // live text, and the title becomes a link.
      const statement = entry.page
        ? (entry.page.blocks.find((b) => b.heading === 'Statement')?.text.trim() ?? entry.statement)
        : entry.statement;
      const name = entry.page
        ? `<a href="${hrefFor(entry.page, ctx.depth)}">${escape(entry.title)}</a>`
        : `${escape(entry.title)} <span class="pending">not yet written</span>`;
      return `<tr${entry.page ? '' : ' class="row-pending"'}>
<td>${name}</td>
<td>${escape(statement)}</td>
<td class="source">${escape(entry.source)}</td>
</tr>`;
    }).join('\n');

    return `<section class="family">
<h2>${escape(family)} <span class="family-count">${entries.length}</span></h2>
<table class="razor-table">
<thead><tr><th>Razor</th><th>Statement</th><th>Source</th></tr></thead>
<tbody>\n${rows}\n</tbody>
</table>
</section>`;
  }).join('\n');

  const main = `<article class="page page--index">
<h1 class="page-title">Razor index</h1>
<p class="summary">Every razor in the atlas, grouped by family — ${total} of them, ${written} with a full entry so far. The rest carry their statement and source until written.</p>
${families}
</article>`;
  return shell({ title: 'Razor index', depth: ctx.depth, nav: renderNav(ctx, null), main });
}

export function renderGlossary(termIndex, ctx) {
  const rows = [...termIndex.values()]
    .sort((a, b) => a.term.localeCompare(b.term))
    .map(({ term, page }) => `<tr>
<td class="term-name">${escape(term)}</td>
<td><a href="${hrefFor(page, ctx.depth)}">${escape(page.title)}</a></td>
<td class="source">${escape(page.section)}</td>
</tr>`).join('\n');

  const main = `<article class="page page--index">
<h1 class="page-title">Glossary</h1>
<p class="summary">Every term the atlas defines, and the one page that defines it. Writing <code>[[term]]</code> anywhere links here.</p>
<table>
<thead><tr><th>Term</th><th>Defined in</th><th>Section</th></tr></thead>
<tbody>\n${rows}\n</tbody>
</table>
</article>`;
  return shell({ title: 'Glossary', depth: ctx.depth, nav: renderNav(ctx, null), main });
}

export function renderHome(ctx) {
  const cards = [...ctx.sections.values()].map((section) => {
    const first = section.groups.flatMap((g) => g.pages).map((s) => ctx.pagesBySlug.get(s)).find(Boolean);
    const count = section.groups.reduce((n, g) => n + g.pages.length, 0);
    const href = first ? hrefFor(first, ctx.depth) : '#';
    return `<li class="card"><a href="${href}"><h2>${escape(section.title)}</h2><p>${count} pages</p></a></li>`;
  }).join('\n');

  const main = `<article class="page page--home">
<h1 class="page-title">Atlas</h1>
<p class="summary">AI engineering, technical interviews, and staff engineering — the model, the decision, the mechanism, the example.</p>
<ul class="cards">\n${cards}\n</ul>
</article>`;
  return shell({ title: 'Atlas', depth: ctx.depth, nav: renderNav(ctx, null), main });
}
