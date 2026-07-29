import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter } from '../build/frontmatter.mjs';

test('parses scalar keys', () => {
  const raw = '---\ntype: concept\ntitle: Caching\n---\n## The model\n';
  const { data } = parseFrontmatter(raw);
  assert.equal(data.type, 'concept');
  assert.equal(data.title, 'Caching');
});

test('strips surrounding quotes from scalars', () => {
  const { data } = parseFrontmatter('---\ntitle: "A: b"\n---\nbody\n');
  assert.equal(data.title, 'A: b');
});

test('parses inline arrays', () => {
  const { data } = parseFrontmatter('---\nnext: [a-b, c-d]\n---\nbody\n');
  assert.deepEqual(data.next, ['a-b', 'c-d']);
});

test('parses an empty inline array', () => {
  const { data } = parseFrontmatter('---\nnext: []\n---\nbody\n');
  assert.deepEqual(data.next, []);
});

test('parses block lists', () => {
  const raw = '---\nsources:\n  - "Fowler, Refactoring"\n  - Google SRE\n---\nbody\n';
  const { data } = parseFrontmatter(raw);
  assert.deepEqual(data.sources, ['Fowler, Refactoring', 'Google SRE']);
});

test('returns the body and its starting line', () => {
  const raw = '---\ntype: concept\n---\n## The model\n\nText.\n';
  const { body, bodyStartLine } = parseFrontmatter(raw);
  assert.equal(body, '## The model\n\nText.\n');
  assert.equal(bodyStartLine, 4);
});

test('throws when frontmatter is missing', () => {
  assert.throws(() => parseFrontmatter('## The model\n'), /must start with ---/);
});

test('throws when frontmatter is unterminated', () => {
  assert.throws(() => parseFrontmatter('---\ntype: concept\n'), /unterminated/);
});

test('throws on unsupported syntax', () => {
  assert.throws(() => parseFrontmatter('---\nnested:\n  key: value\n---\nbody\n'), /unsupported/);
});
