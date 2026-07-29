import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage } from '../build/content.mjs';
import { lintPage } from '../build/lint.mjs';

// Two paragraphs, each under both paragraph limits, together over the 100-word
// example minimum, and containing "cache" so the summary-overlap check passes.
const EXAMPLE_PARAGRAPH = `${'word '.repeat(50)}cache.`;
const DIAGRAM = '```mermaid\nflowchart LR\n  A --> B\n```';
const EXAMPLE_BODY = `${DIAGRAM}\n\n${EXAMPLE_PARAGRAPH}\n\n${EXAMPLE_PARAGRAPH}`;

const CONCEPT_BLOCKS = [
  '## The model', '', 'A model.', '',
  '## When to use it', '', '1. One?', '',
  '## Speedrun', '', '**What** — the vitals.', '',
  '**How to do it**', '', '1. First step.', '2. Second step.', '',
  '## Going deeper', '', 'Because.', '',
  '## See it work', '', EXAMPLE_BODY, '',
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
  const blocks = ['## When to use it', '', 'x.', '', '## The model', '', 'y.', '',
    '## Speedrun', '', 'z.', '', '## Going deeper', '', 'g.', '',
    '## See it work', '', EXAMPLE_BODY, '', '## Next', '', 'n.'].join('\n');
  assert.ok(rulesOf(lintPage(concept(blocks))).includes('blocks-exact'));
});

test('model-length rejects a model over 120 words', () => {
  assert.ok(rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace('A model.', 'word '.repeat(121))))).includes('model-length'));
});

test('speedrun-length rejects a speedrun over 500 words', () => {
  const long = Array.from({ length: 8 }, () => `${'word '.repeat(70)}.`).join('\n\n');
  assert.ok(rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace('the vitals.', long)))).includes('speedrun-length'));
});

test('procedure-present rejects a Speedrun with no How beat', () => {
  const blocks = CONCEPT_BLOCKS.replace('**How to do it**', '**Some other beat**');
  assert.ok(rulesOf(lintPage(concept(blocks))).includes('procedure-present'));
});

test('procedure-present rejects a How beat with no numbered steps', () => {
  const blocks = CONCEPT_BLOCKS
    .replace('1. First step.\n2. Second step.', 'You sample, you score, you report.');
  assert.ok(rulesOf(lintPage(concept(blocks))).includes('procedure-present'));
});

test('procedure-present accepts any topic-specific How wording', () => {
  const blocks = CONCEPT_BLOCKS.replace('**How to do it**', '**How to hand work over**');
  assert.ok(!rulesOf(lintPage(concept(blocks))).includes('procedure-present'));
});

test('speedrun-length does not count a diagram against the budget', () => {
  const bigDiagram = ['```mermaid', 'flowchart LR', ...Array(400).fill('  A --> B'), '```'].join('\n');
  const blocks = CONCEPT_BLOCKS.replace('The vitals.', `The vitals.\n\n${bigDiagram}`);
  assert.ok(!rulesOf(lintPage(concept(blocks))).includes('speedrun-length'));
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

test('example-present rejects an example under 100 words of prose', () => {
  const short = `${DIAGRAM}\n\nToo short cache.`;
  assert.ok(rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace(EXAMPLE_BODY, short)))).includes('example-present'));
});

test('example-present does not count the diagram toward the word minimum', () => {
  const bigDiagram = ['```mermaid', 'flowchart LR', ...Array(200).fill('  A --> B'), '```'].join('\n');
  const padded = `${bigDiagram}\n\nToo short cache.`;
  assert.ok(rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace(EXAMPLE_BODY, padded)))).includes('example-present'));
});

test('example-present rejects an example sharing no token with the summary', () => {
  const unrelated = `${DIAGRAM}\n\n${'zzzz '.repeat(50)}zzzz.\n\n${'zzzz '.repeat(50)}zzzz.`;
  assert.ok(rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace(EXAMPLE_BODY, unrelated)))).includes('example-present'));
});

test('visual-present rejects an example with no mermaid diagram', () => {
  const noDiagram = `${EXAMPLE_PARAGRAPH}\n\n${EXAMPLE_PARAGRAPH}`;
  assert.ok(rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace(EXAMPLE_BODY, noDiagram)))).includes('visual-present'));
});

test('visual-present rejects a non-mermaid fence', () => {
  const jsFence = '```js\nconst a = 1;\n```';
  const body = `${jsFence}\n\n${EXAMPLE_PARAGRAPH}\n\n${EXAMPLE_PARAGRAPH}`;
  assert.ok(rulesOf(lintPage(concept(CONCEPT_BLOCKS.replace(EXAMPLE_BODY, body)))).includes('visual-present'));
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

test('sources-required rejects a communication page with no sources', () => {
  const page = concept();
  page.section = 'communication';
  assert.ok(rulesOf(lintPage(page)).includes('sources-required'));
});

test('sources-required leaves other sections alone', () => {
  const page = concept();
  page.section = 'interviews';
  assert.ok(!rulesOf(lintPage(page)).includes('sources-required'));
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

test('razors are exempt from the concept-only rules', () => {
  const rules = rulesOf(lintPage(razor()));
  for (const rule of ['visual-present', 'speedrun-length', 'model-length', 'summary-present']) {
    assert.ok(!rules.includes(rule), `razor should not be subject to ${rule}`);
  }
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

test('illustration-credited requires alt text and a credit', () => {
  const page = concept();
  page.illustration = 'img/x.svg';
  const violations = lintPage(page).filter((v) => v.rule === 'illustration-credited');
  assert.equal(violations.length, 2);

  page.illustrationAlt = 'A rising line';
  page.illustrationCredit = 'Authored for this atlas';
  assert.ok(!rulesOf(lintPage(page)).includes('illustration-credited'));
});

test('illustration-credited stays quiet when there is no illustration', () => {
  assert.ok(!rulesOf(lintPage(concept())).includes('illustration-credited'));
});

test('violations carry file and line', () => {
  const blocks = CONCEPT_BLOCKS.replace('A model.', 'word '.repeat(121));
  const [violation] = lintPage(concept(blocks)).filter((v) => v.rule === 'model-length');
  assert.equal(violation.file, '/c/caching.md');
  assert.ok(violation.line > 0);
});
