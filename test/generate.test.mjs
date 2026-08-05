import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderRazorIndexMarkdown, renderGlossaryMarkdown, renderHomeMarkdown } from '../tools/generate.mjs';

const groups = [{
  family: 'Laws of systems',
  entries: [
    { id: 'littles-law', title: "Little's Law", statement: 'L equals lambda W.', source: 'Little (1961)',
      page: { slug: 'littles-law', section: 'razors' } },
    { id: 'gustafsons-law', title: "Gustafson's Law", statement: 'Scale the work.', source: 'Gustafson (1988)', page: null },
  ],
}];

test('the razor index counts written and total entries', () => {
  const md = renderRazorIndexMarkdown(groups);
  assert.match(md, /1 of 2/);
});

test('a written razor is a link; an unwritten one is marked pending', () => {
  const md = renderRazorIndexMarkdown(groups);
  assert.match(md, /\[Little's Law\]\(\/razors\/littles-law\)/);
  assert.match(md, /Gustafson's Law/);
  assert.doesNotMatch(md, /\[Gustafson's Law\]\(/);
  assert.match(md, /not yet written/);
});

test('the index carries frontmatter Docusaurus can route', () => {
  const md = renderRazorIndexMarkdown(groups);
  assert.match(md, /^---\n/);
  assert.match(md, /title: Razor index/);
});

test('a pipe in a statement is escaped so the table survives', () => {
  const withPipe = [{ family: 'F', entries: [
    { id: 'x', title: 'X', statement: 'a | b', source: 'S', page: null },
  ] }];
  assert.match(renderRazorIndexMarkdown(withPipe), /a \\\| b/);
});

test('the homepage links every section and carries generated frontmatter', () => {
  const pages = [
    { slug: 'what-makes-an-eval', section: 'ai', title: 'What an eval is', type: 'concept' },
    { slug: 'caching-strategies', section: 'interviews', title: 'Caching strategies', type: 'concept' },
    { slug: 'goodharts-law', section: 'razors', title: "Goodhart's Law", type: 'razor' },
  ];
  const md = renderHomeMarkdown(pages);
  assert.match(md, /type: generated/);
  assert.match(md, /slug: \//);
  assert.match(md, /\(\/ai\/what-makes-an-eval\)/);
  assert.match(md, /\(\/interviews\/caching-strategies\)/);
});

test('the homepage says "1 page" rather than "1 pages"', () => {
  const md = renderHomeMarkdown([{ slug: 'a', section: 'ai', title: 'A', type: 'concept' }]);
  assert.match(md, /\n1 page\n/);
  assert.doesNotMatch(md, /1 pages/);
});

test('the homepage counts pages per section', () => {
  const pages = [
    { slug: 'a', section: 'ai', title: 'A', type: 'concept' },
    { slug: 'b', section: 'ai', title: 'B', type: 'concept' },
  ];
  assert.match(renderHomeMarkdown(pages), /2 pages/);
});

test('the glossary lists each term against its owning page', () => {
  const index = new Map([
    ['golden set', { term: 'golden set', page: { slug: 'what-makes-an-eval', section: 'ai', title: 'What an eval is' } }],
  ]);
  const md = renderGlossaryMarkdown(index);
  assert.match(md, /golden set/);
  assert.match(md, /\[What an eval is\]\(\/ai\/what-makes-an-eval\)/);
});

test('glossary terms are sorted and keep their authored spelling', () => {
  const index = new Map([
    ['ttl', { term: 'TTL', page: { slug: 'caching-strategies', section: 'interviews', title: 'Caching' } }],
    ['cache', { term: 'cache', page: { slug: 'caching-strategies', section: 'interviews', title: 'Caching' } }],
  ]);
  const md = renderGlossaryMarkdown(index);
  assert.ok(md.indexOf('cache') < md.indexOf('TTL'));
  assert.match(md, /TTL/);
});

// The homepage listed every page alphabetically, which put "Building alignment"
// above "Senior to staff — what to stop doing" and made reading order invisible
// to a first-time reader. It has to follow the same order as the sidebar.
const orderedPages = [
  { slug: 'the-traps', title: 'The traps', section: 'staff', group: 'first-90-days', sidebarPosition: 4 },
  { slug: 'stop', title: 'Senior to staff', section: 'staff', group: 'first-90-days', sidebarPosition: 1 },
  { slug: 'alignment', title: 'Building alignment', section: 'staff', group: 'influence', sidebarPosition: 2 },
  { slug: 'decisions', title: 'How decisions get made', section: 'staff', group: 'influence', sidebarPosition: 1 },
];
const orderedCats = new Map([
  ['staff', { label: 'Staff Engineering', position: 4 }],
  ['staff/first-90-days', { label: 'The first 90 days', position: 1 }],
  ['staff/influence', { label: 'Influence without authority', position: 3 }],
]);

test('the homepage lists pages in reading order, not alphabetically', () => {
  const md = renderHomeMarkdown(orderedPages, orderedCats);
  assert.ok(md.indexOf('Senior to staff') < md.indexOf('The traps'),
    'position 1 must come before position 4');
  assert.ok(md.indexOf('How decisions get made') < md.indexOf('Building alignment'));
});

test('the homepage groups pages under their group heading, in group order', () => {
  const md = renderHomeMarkdown(orderedPages, orderedCats);
  assert.match(md, /The first 90 days/);
  assert.match(md, /Influence without authority/);
  assert.ok(md.indexOf('The first 90 days') < md.indexOf('Influence without authority'),
    'group position 1 must come before group position 3');
});

test('the homepage opens with a start-here route for a named reader', () => {
  const md = renderHomeMarkdown(orderedPages, orderedCats);
  assert.match(md, /## Start here/);
  assert.match(md, /just been promoted/i);
});
