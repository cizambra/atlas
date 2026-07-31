import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lintCollection } from '../tools/lint.mjs';

const page = (slug, section, extra = {}) => ({
  slug, section, group: 'g', sidebarPosition: 1, type: 'concept', title: slug,
  filePath: `/c/${slug}.md`, razors: [], prereq: [], next: [], sources: [],
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

test('reading-order rejects a page with no sidebar_position', () => {
  const pages = [page('alpha', 'ai', { sidebarPosition: undefined })];
  assert.ok(rulesOf(lintCollection(pages)).includes('reading-order'));
});

test('reading-order rejects a non-numeric sidebar_position', () => {
  const pages = [page('alpha', 'ai', { sidebarPosition: Number('first') })];
  assert.ok(rulesOf(lintCollection(pages)).includes('reading-order'));
});

test('reading-order rejects a page placed above its prerequisite', () => {
  const pages = [
    page('strategies', 'interviews', { sidebarPosition: 2 }),
    page('layers', 'interviews', { sidebarPosition: 1, prereq: ['strategies'] }),
  ];
  assert.ok(rulesOf(lintCollection(pages)).includes('reading-order'));
});

test('reading-order accepts a page placed after its prerequisite', () => {
  const pages = [
    page('strategies', 'interviews', { sidebarPosition: 1 }),
    page('layers', 'interviews', { sidebarPosition: 2, prereq: ['strategies'] }),
  ];
  assert.deepEqual(lintCollection(pages), []);
});

test('reading-order compares numerically, so 10 sits below 9', () => {
  const pages = [
    page('ninth', 'interviews', { sidebarPosition: 9 }),
    page('tenth', 'interviews', { sidebarPosition: 10, prereq: ['ninth'] }),
  ];
  assert.deepEqual(lintCollection(pages), []);
});

test('reading-order ignores a prerequisite in another group', () => {
  const pages = [
    page('elsewhere', 'ai', { group: 'other', sidebarPosition: 5 }),
    page('here', 'ai', { group: 'g', sidebarPosition: 1, prereq: ['elsewhere'] }),
  ];
  assert.deepEqual(lintCollection(pages), []);
});
