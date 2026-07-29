import { test } from 'node:test';
import assert from 'node:assert/strict';
import MarkdownIt from 'markdown-it';
import { loadPage } from '../build/content.mjs';
import { renderPage, renderRazorIndex, renderHome } from '../build/template.mjs';

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

const conceptRaw = [
  '---', 'type: concept', 'title: Caching', 'section: interviews', 'group: Building blocks',
  'summary: A cache is a bet that reads outnumber writes.', 'razors: [littles-law]', 'next: [hot-keys]', '---', '',
  '## The model', '', 'A model.', '',
  '## Decide it', '', '1. One?', '',
  "## Why it's true", '', 'Because.', '',
  '## Worked example', '', 'An example.', '',
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
  for (const cls of ['the-model', 'decide-it', 'why-it-s-true', 'worked-example', 'next']) {
    assert.match(html, new RegExp(`class="block block--${cls}"`));
  }
});

test('renders markdown inside blocks', () => {
  assert.match(renderPage(concept, ctx), /<ol>\s*<li>One\?<\/li>/);
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
