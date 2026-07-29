import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage } from '../build/content.mjs';
import { buildSearchIndex } from '../build/search.mjs';

const concept = loadPage('/c/caching-strategies.md', [
  '---', 'type: concept', 'title: Caching', 'section: interviews', 'group: Building blocks',
  'summary: A cache is a bet that reads outnumber writes.', '---', '',
  '## The model', '', 'Thundering herd matters.', '',
  '## Decide it', '', '1. Stale?', '',
  "## Why it's true", '', '### Divergence', '', 'Because.', '',
  '## Worked example', '', 'Example.', '',
  '## Next', '', 'Links.', '',
].join('\n'));

const razor = loadPage('/r/littles-law.md', [
  '---', 'type: razor', 'title: Little\'s Law', 'section: razors', 'family: Systems',
  'sources:', '  - "John Little (1961)"', '---', '',
  '## Statement', '', 'Queue length equals arrival rate times wait time.', '',
  '## Decides', '', 'Capacity.', '',
  '## Why it holds', '', 'Conservation.', '',
  '## Example', '', 'A saturated pool.', '',
  '## Limits', '', 'Steady state only.', '',
  '## Source', '', 'Little.', '',
].join('\n'));

test('indexes one entry per page', () => {
  assert.equal(buildSearchIndex([concept, razor]).pages.length, 2);
});

test('uses summary as the blurb for concepts and Statement for razors', () => {
  const [c, r] = buildSearchIndex([concept, razor]).pages;
  assert.equal(c.blurb, 'A cache is a bet that reads outnumber writes.');
  assert.equal(r.blurb, 'Queue length equals arrival rate times wait time.');
});

test('kicker is the group for concepts and the family for razors', () => {
  const [c, r] = buildSearchIndex([concept, razor]).pages;
  assert.equal(c.kicker, 'Building blocks');
  assert.equal(r.kicker, 'Systems');
});

test('collects ### headings from block bodies', () => {
  const [c] = buildSearchIndex([concept]).pages;
  assert.ok(c.headings.includes('Divergence'));
});

test('body tokens are deduped and include block prose', () => {
  const [c] = buildSearchIndex([concept]).pages;
  assert.ok(c.tokens.includes('thundering'));
  assert.equal(new Set(c.tokens).size, c.tokens.length);
});
