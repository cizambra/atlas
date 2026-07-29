import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lintCollection } from '../build/lint.mjs';

const page = (slug, section, extra = {}) => ({
  slug, section, type: 'concept', title: slug, filePath: `/c/${slug}.md`,
  razors: [], next: [], sources: [], blocks: [{ heading: 'The model', text: 'x', startLine: 1 }], ...extra,
});

const sections = (groups) => new Map([['ai', { id: 'ai', title: 'AI', groups }]]);

const rulesOf = (violations) => violations.map((v) => v.rule);

test('a consistent collection produces no violations', () => {
  const pages = [page('alpha', 'ai', { next: ['beta'] }), page('beta', 'ai')];
  const config = sections([{ id: 'g', title: 'G', pages: ['alpha', 'beta'] }]);
  assert.deepEqual(lintCollection(pages, config), []);
});

test('links-resolve rejects a dangling next slug', () => {
  const pages = [page('alpha', 'ai', { next: ['nope'] })];
  const config = sections([{ id: 'g', title: 'G', pages: ['alpha'] }]);
  const violations = lintCollection(pages, config);
  assert.ok(rulesOf(violations).includes('links-resolve'));
  assert.match(violations[0].message, /nope/);
});

test('links-resolve rejects a dangling razor slug', () => {
  const pages = [page('alpha', 'ai', { razors: ['missing-razor'] })];
  const config = sections([{ id: 'g', title: 'G', pages: ['alpha'] }]);
  assert.ok(rulesOf(lintCollection(pages, config)).includes('links-resolve'));
});

test('nav-complete rejects a page absent from its section config', () => {
  const pages = [page('alpha', 'ai'), page('unlisted', 'ai')];
  const config = sections([{ id: 'g', title: 'G', pages: ['alpha'] }]);
  assert.ok(rulesOf(lintCollection(pages, config)).includes('nav-complete'));
});

test('nav-complete rejects a page listed twice', () => {
  const pages = [page('alpha', 'ai')];
  const config = sections([
    { id: 'g', title: 'G', pages: ['alpha'] },
    { id: 'h', title: 'H', pages: ['alpha'] },
  ]);
  assert.ok(rulesOf(lintCollection(pages, config)).includes('nav-complete'));
});

test('nav-orphan rejects a config entry with no file', () => {
  const pages = [page('alpha', 'ai')];
  const config = sections([{ id: 'g', title: 'G', pages: ['alpha', 'ghost'] }]);
  assert.ok(rulesOf(lintCollection(pages, config)).includes('nav-orphan'));
});
