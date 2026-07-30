import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadPage, loadContent } from '../build/content.mjs';

const FIXTURES = new URL('./fixtures/content/', import.meta.url).pathname;
const SAMPLE = `${FIXTURES}ai/foundations/sample-concept.md`;

test('loadPage derives the slug from the filename', () => {
  const page = loadPage(SAMPLE, readFileSync(SAMPLE, 'utf8'), { section: 'ai', group: 'foundations' });
  assert.equal(page.slug, 'sample-concept');
});

test('loadPage surfaces frontmatter fields', () => {
  const page = loadPage(SAMPLE, readFileSync(SAMPLE, 'utf8'), { section: 'ai', group: 'foundations' });
  assert.equal(page.type, 'concept');
  assert.equal(page.title, 'Sample concept');
  assert.equal(page.section, 'ai');
  assert.equal(page.group, 'foundations');
});

test('loadPage defaults absent array fields to empty arrays', () => {
  const page = loadPage('/tmp/x.md', '---\ntype: concept\ntitle: X\nsection: ai\n---\n## The model\n\nText.\n');
  assert.deepEqual(page.razors, []);
  assert.deepEqual(page.sources, []);
});

test('loadPage attaches parsed blocks', () => {
  const page = loadPage(SAMPLE, readFileSync(SAMPLE, 'utf8'), { section: 'ai', group: 'foundations' });
  assert.deepEqual(page.blocks.map((b) => b.heading), [
    'The model', 'When to use it', 'Speedrun', 'Going deeper', 'See it work', 'Next',
  ]);
});

test('loadContent derives section and group from the folder path', () => {
  const { pages } = loadContent(FIXTURES);
  const concept = pages.find((p) => p.slug === 'sample-concept');
  assert.equal(concept.section, 'ai');
  assert.equal(concept.group, 'foundations');
});

test('loadContent returns every page', () => {
  const { pages } = loadContent(FIXTURES);
  assert.deepEqual(pages.map((p) => p.slug).sort(), ['sample-concept', 'sample-razor']);
});
