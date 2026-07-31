import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTermIndex, termReferences, duplicateDefinitions, normalize } from '../tools/terms.mjs';
import { lintCollection } from '../tools/lint.mjs';

const page = (slug, extra = {}) => ({
  slug, section: 'ai', type: 'concept', title: slug, filePath: `/c/${slug}.md`,
  defines: [], razors: [], prereq: [], next: [], sources: [],
  blocks: [{ heading: 'The model', text: 'x', startLine: 1 }], ...extra,
});

test('normalize makes term lookup case- and space-insensitive', () => {
  assert.equal(normalize('  Golden Set '), 'golden set');
});

test('buildTermIndex maps every declared term to its page', () => {
  const evals = page('what-makes-an-eval', { defines: ['golden set', 'Annotators'] });
  const index = buildTermIndex([evals, page('other')]);
  assert.equal(index.get('golden set').page.slug, 'what-makes-an-eval');
  assert.equal(index.get('annotators').page.slug, 'what-makes-an-eval');
});

test('buildTermIndex keeps the authored spelling for display', () => {
  const index = buildTermIndex([page('caching', { defines: ['TTL'] })]);
  assert.equal(index.get('ttl').term, 'TTL');
});

test('termReferences finds every [[term]] with its position', () => {
  const found = termReferences('Build a [[golden set]] and pick [[annotators]].');
  assert.deepEqual(found.map((r) => r.label), ['golden set', 'annotators']);
  assert.ok(found[0].index < found[1].index);
});

test('duplicateDefinitions reports a term claimed by two pages', () => {
  const clashes = duplicateDefinitions([
    page('a', { defines: ['golden set'] }),
    page('b', { defines: ['Golden Set'] }),
  ]);
  assert.equal(clashes.length, 1);
  assert.equal(clashes[0].owner.slug, 'a');
});

test('terms-unique fails the build when two pages define the same term', () => {
  const pages = [page('a', { defines: ['golden set'] }), page('b', { defines: ['golden set'] })];
  const rules = lintCollection(pages).map((v) => v.rule);
  assert.ok(rules.includes('terms-unique'));
});

test('terms-resolve fails the build on a term no page defines', () => {
  const pages = [page('a', {
    blocks: [{ heading: 'The model', text: 'See the [[embedding space]].', startLine: 7 }],
  })];
  const violations = lintCollection(pages);
  const found = violations.find((v) => v.rule === 'terms-resolve');
  assert.ok(found);
  assert.equal(found.line, 7);
});

test('terms-resolve ignores bracket text inside a fence', () => {
  const pages = [page('a', {
    blocks: [{ heading: 'The model', text: '```\n[[not a term]]\n```', startLine: 1 }],
  })];
  assert.ok(!lintCollection(pages).map((v) => v.rule).includes('terms-resolve'));
});

// Rendering a term as a link is now remark-terms' job and is covered by
// test/remark-terms.test.mjs. This file covers the index and the lint rules only.
