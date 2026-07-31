import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lintCollection } from '../tools/lint.mjs';

const page = (slug, section, extra = {}) => ({
  slug, section, type: 'concept', title: slug, filePath: `/c/${slug}.md`,
  razors: [], prereq: [], next: [], sources: [],
  blocks: [{ heading: 'The model', text: 'x', startLine: 1 }], ...extra,
});

const rulesOf = (violations) => violations.map((v) => v.rule);

test('a consistent collection produces no violations', () => {
  const pages = [page('alpha', 'ai', { next: ['beta'] }), page('beta', 'ai')];
  assert.deepEqual(lintCollection(pages), []);
});

test('links-resolve rejects a dangling prereq slug', () => {
  const pages = [page('alpha', 'ai', { prereq: ['embeddings'] })];
  assert.ok(rulesOf(lintCollection(pages)).includes('links-resolve'));
});

test('links-resolve rejects a dangling razor slug', () => {
  const pages = [page('alpha', 'ai', { razors: ['missing-razor'] })];
  assert.ok(rulesOf(lintCollection(pages)).includes('links-resolve'));
});
