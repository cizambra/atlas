import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage } from '../build/content.mjs';
import { lintPage } from '../build/lint.mjs';

// Two paragraphs, each under both paragraph limits, together over the 100-word
// example minimum, and containing "cache" so the summary-overlap check passes.
const EXAMPLE_PARAGRAPH = `${'word '.repeat(50)}cache.`;
const EXAMPLE_BODY = `${EXAMPLE_PARAGRAPH}\n\n${EXAMPLE_PARAGRAPH}`;

const CONCEPT_BLOCKS = [
  '## The model', '', 'A model.', '',
  '## Decide it', '', '1. One?', '',
  "## Why it's true", '', 'Because.', '',
  '## Worked example', '', EXAMPLE_BODY, '',
  '## Next', '', 'Links.',
].join('\n');

function concept(blocks = CONCEPT_BLOCKS) {
  const front = [
    '---',
    'type: concept',
    'title: Caching',
    'section: interviews',
    'summary: A cache is a bet that reads outnumber writes.',
    '---',
  ].join('\n');
  return loadPage('/c/caching.md', `${front}\n${blocks}\n`);
}

const rulesOf = (violations) => violations.map((v) => v.rule);

test('a conforming concept page produces no violations', () => {
  assert.deepEqual(lintPage(concept()), []);
});

test('blocks-exact rejects a missing block', () => {
  assert.ok(rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace('## Next\n\nLinks.', '')))).includes('blocks-exact'));
});

test('blocks-exact rejects blocks in the wrong order', () => {
  const blocks = ['## Decide it', '', 'x.', '', '## The model', '', 'y.', '',
    "## Why it's true", '', 'z.', '', '## Worked example', '', EXAMPLE_BODY, '', '## Next', '', 'n.'].join('\n');
  assert.ok(rulesOf(lintPage(concept(blocks))).includes('blocks-exact'));
});

test('model-length rejects a model over 120 words', () => {
  assert.ok(rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace('A model.', 'word '.repeat(121))))).includes('model-length'));
});

test('paragraph-size rejects a paragraph over 80 words', () => {
  assert.ok(rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace('Because.', `${'word '.repeat(81)}.`)))).includes('paragraph-size'));
});

test('paragraph-size rejects a paragraph over 4 sentences', () => {
  assert.ok(rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace('Because.', 'A. B. C. D. E.')))).includes('paragraph-size'));
});

test('paragraph-size ignores tables', () => {
  const table = ['| a | b |', '| - | - |', ...Array(40).fill('| x | y |')].join('\n');
  assert.ok(!rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace('Because.', table)))).includes('paragraph-size'));
});

test('example-present rejects an example under 100 words', () => {
  assert.ok(rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace(EXAMPLE_BODY, 'Too short cache.')))).includes('example-present'));
});

test('example-present rejects an example sharing no token with the summary', () => {
  const unrelated = `${'zzzz '.repeat(50)}zzzz.\n\n${'zzzz '.repeat(50)}zzzz.`;
  assert.ok(rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace(EXAMPLE_BODY, unrelated)))).includes('example-present'));
});

test('summary-present rejects a summary over 25 words', () => {
  const page = concept();
  page.summary = 'word '.repeat(26);
  assert.ok(rulesOf(lintPage(page)).includes('summary-present'));
});

test('summary-present rejects a missing summary', () => {
  const page = concept();
  page.summary = undefined;
  assert.ok(rulesOf(lintPage(page)).includes('summary-present'));
});

test('sources-required rejects a staff page with no sources', () => {
  const page = concept();
  page.section = 'staff';
  assert.ok(rulesOf(lintPage(page)).includes('sources-required'));
});

test('sources-required accepts a staff page with sources', () => {
  const page = concept();
  page.section = 'staff';
  page.sources = ['Will Larson, Staff Engineer (2021)'];
  assert.ok(!rulesOf(lintPage(page)).includes('sources-required'));
});

const RAZOR_BODY = [
  '## Statement', '', 'Spend innovation tokens where novelty is the product.', '',
  '## Decides', '', 'Whether to adopt the new thing.', '',
  '## Why it holds', '', 'Novelty costs operational attention.', '',
  '## Example', '', 'A team picks Postgres over a new store.', '',
  '## Limits', '', 'Wrong when the novel component is the differentiator.', '',
  '## Source', '', 'Dan McKinley, 2015.',
].join('\n');

function razor(body = RAZOR_BODY, sources = '  - "Dan McKinley, Choose Boring Technology (2015)"') {
  const raw = ['---', 'type: razor', 'title: Choose Boring Technology', 'section: razors',
    'family: delivery', 'sources:', sources, '---', '', body, ''].join('\n');
  return loadPage('/r/choose-boring-technology.md', raw);
}

test('a conforming razor page produces no violations', () => {
  assert.deepEqual(lintPage(razor()), []);
});

test('limits-present rejects an empty Limits block', () => {
  const body = RAZOR_BODY.replace('Wrong when the novel component is the differentiator.', '');
  assert.ok(rulesOf(lintPage(razor(body))).includes('limits-present'));
});

test('sources-required rejects a razor with no sources', () => {
  const page = razor();
  page.sources = [];
  assert.ok(rulesOf(lintPage(page)).includes('sources-required'));
});

test('violations carry file and line', () => {
  const blocks = CONCEPT_BLOCKS.replace('A model.', 'word '.repeat(121));
  const [violation] = lintPage(concept(blocks)).filter((v) => v.rule === 'model-length');
  assert.equal(violation.file, '/c/caching.md');
  assert.ok(violation.line > 0);
});
