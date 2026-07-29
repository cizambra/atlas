import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadPage, loadSections, loadContent } from '../build/content.mjs';

const FIXTURES = new URL('./fixtures/content/', import.meta.url).pathname;
const SAMPLE = `${FIXTURES}ai/sample-concept.md`;

test('loadPage derives the slug from the filename', () => {
  const page = loadPage(SAMPLE, readFileSync(SAMPLE, 'utf8'));
  assert.equal(page.slug, 'sample-concept');
});

test('loadPage surfaces frontmatter fields', () => {
  const page = loadPage(SAMPLE, readFileSync(SAMPLE, 'utf8'));
  assert.equal(page.type, 'concept');
  assert.equal(page.title, 'Sample concept');
  assert.equal(page.section, 'ai');
  assert.equal(page.group, 'Foundations');
});

test('loadPage defaults absent array fields to empty arrays', () => {
  const page = loadPage('/tmp/x.md', '---\ntype: concept\ntitle: X\nsection: ai\n---\n## The model\n\nText.\n');
  assert.deepEqual(page.razors, []);
  assert.deepEqual(page.next, []);
  assert.deepEqual(page.sources, []);
});

test('loadPage attaches parsed blocks', () => {
  const page = loadPage(SAMPLE, readFileSync(SAMPLE, 'utf8'));
  assert.deepEqual(page.blocks.map((b) => b.heading), [
    'The model', 'Decide it', "Why it's true", 'Worked example', 'Next',
  ]);
});

test('loadSections reads every _section.json', () => {
  const sections = loadSections(FIXTURES);
  assert.equal(sections.get('ai').title, 'AI Engineering');
  assert.deepEqual(sections.get('ai').groups[0].pages, ['sample-concept']);
});

test('loadContent returns pages and sections together', () => {
  const { pages, sections } = loadContent(FIXTURES);
  assert.deepEqual(pages.map((p) => p.slug).sort(), ['sample-concept', 'sample-razor']);
  assert.deepEqual([...sections.keys()].sort(), ['ai', 'razors']);
});
