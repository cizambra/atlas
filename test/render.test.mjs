import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage } from '../build/content.mjs';
import { createMarkdown } from '../build/markdown.mjs';
import { renderPage, renderRazorIndex, renderHome } from '../build/template.mjs';

const md = createMarkdown();

const conceptRaw = [
  '---', 'type: concept', 'title: Caching', 'section: interviews', 'group: Building blocks',
  'summary: A cache is a bet that reads outnumber writes.', 'razors: [littles-law]', 'next: [hot-keys]', '---', '',
  '## The model', '', 'A model.', '',
  '## When to use it', '', '1. One?', '',
  '## Speedrun', '', `${'word '.repeat(400)}.`, '',
  '## Going deeper', '', 'Because.', '',
  '## See it work', '', '```mermaid', 'flowchart LR', '  A --> B', '```', '', 'An example.', '',
  '## Next', '', 'Links.', '',
].join('\n');

const razorRaw = [
  '---', 'type: razor', 'title: Choose Boring Technology', 'section: razors', 'family: Delivery',
  'sources:', '  - "Dan McKinley (2015)"', '---', '',
  '## Statement', '', 'Spend innovation tokens where the novelty is the product.', '',
  '## Decides', '', 'Adopt or not.', '',
  '## Why it holds', '', 'Novelty costs attention.', '',
  '## Example', '', 'Postgres over the new store.', '',
  '## Limits', '', 'Wrong when novelty is the differentiator.', '',
  '## Source', '', 'Dan McKinley.', '',
].join('\n');

const concept = loadPage('/c/caching-strategies.md', conceptRaw);
const razor = loadPage('/r/choose-boring-technology.md', razorRaw);
// A distinct page object, so the cited-razor link asserts its own slug rather than the other razor's.
const littlesLaw = loadPage('/r/littles-law.md', razorRaw.replace('Choose Boring Technology', "Little's Law"));

const ctx = {
  md,
  depth: 1,
  pagesBySlug: new Map([
    ['caching-strategies', concept],
    ['choose-boring-technology', razor],
    ['littles-law', littlesLaw],
  ]),
  sections: new Map([
    ['interviews', { id: 'interviews', title: 'Interviews', groups: [{ id: 'bb', title: 'Building blocks', pages: ['caching-strategies'] }] }],
    ['razors', { id: 'razors', title: 'Razors', groups: [{ id: 'delivery', title: 'Delivery', pages: ['choose-boring-technology'] }] }],
  ]),
};

test('renders the page title into <title> and <h1>', () => {
  const html = renderPage(concept, ctx);
  assert.match(html, /<title>Caching · Atlas<\/title>/);
  assert.match(html, /<h1[^>]*>Caching<\/h1>/);
});

test('renders one section element per contract block', () => {
  const html = renderPage(concept, ctx);
  for (const cls of ['the-model', 'when-to-use-it', 'speedrun', 'going-deeper', 'see-it-work', 'next']) {
    assert.match(html, new RegExp(`class="block block--${cls}"`));
  }
});

test('renders markdown inside blocks', () => {
  assert.match(renderPage(concept, ctx), /<ol>\s*<li>One\?<\/li>/);
});

test('computes a reading time for Speedrun and for no other block', () => {
  const html = renderPage(concept, ctx);
  // 401 words at 200 wpm rounds to 2.
  assert.match(html, /<h2>Speedrun<span class="reading-time">2 min<\/span><\/h2>/);
  assert.equal(html.match(/class="reading-time"/g).length, 1);
});

test('renders a mermaid fence as a mermaid element, not a code block', () => {
  const html = renderPage(concept, ctx);
  assert.match(html, /<pre class="mermaid">flowchart LR/);
  assert.doesNotMatch(html, /language-mermaid/);
});

test('loads the mermaid runtime with a depth-correct path', () => {
  assert.match(renderPage(concept, ctx), /<script src="\.\.\/mermaid\.min\.js"><\/script>/);
});

test('renders inline and block math to static HTML at build time', () => {
  // Replacer function, not a string: `$$` in a replacement string means a literal `$`,
  // which would silently turn the block math into inline math.
  const math = 'The bar is $2\\sqrt{N}$ items.\n\n$$\\text{SD}(L) = \\sqrt{N}$$';
  const raw = conceptRaw.replace('Because.', () => math);
  const page = loadPage('/c/math.md', raw);
  const html = renderPage(page, { ...ctx, pagesBySlug: new Map([...ctx.pagesBySlug, ['math', page]]) });
  assert.match(html, /<span class="katex">/);
  assert.match(html, /katex-display/);
  // Rendered server-side: no KaTeX JavaScript is shipped, only its stylesheet.
  assert.match(html, /href="\.\.\/katex\.min\.css"/);
  assert.doesNotMatch(html, /katex\.min\.js/);
});

test('renders razor blocks and the sources list', () => {
  const html = renderPage(razor, ctx);
  assert.match(html, /class="block block--limits"/);
  assert.match(html, /Dan McKinley \(2015\)/);
});

test('links cited razors from a concept page', () => {
  const html = renderPage(concept, ctx);
  assert.match(html, /href="\.\.\/razors\/littles-law\.html"/);
});

test('nav lists every section and the current page is marked', () => {
  const html = renderPage(concept, ctx);
  assert.match(html, /Interviews/);
  assert.match(html, /aria-current="page"/);
});

test('asset paths respect depth', () => {
  assert.match(renderPage(concept, ctx), /href="\.\.\/atlas\.css"/);
  assert.match(renderHome({ ...ctx, depth: 0 }), /href="atlas\.css"/);
});

test('razor index lists every razor with its statement and family', () => {
  const html = renderRazorIndex([razor], ctx);
  assert.match(html, /Choose Boring Technology/);
  assert.match(html, /Spend innovation tokens where the novelty is the product\./);
  assert.match(html, /Delivery/);
});

test('home page links each section', () => {
  const html = renderHome({ ...ctx, depth: 0 });
  assert.match(html, /href="interviews\/caching-strategies\.html"/);
});
