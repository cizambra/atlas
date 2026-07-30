import { test } from 'node:test';
import assert from 'node:assert/strict';
import remarkTerms from '../plugins/remark-terms.mjs';

const terms = new Map([
  ['golden set', { term: 'golden set', page: { slug: 'what-makes-an-eval', section: 'ai' } }],
  ["goodhart's law", { term: "Goodhart's Law", page: { slug: 'goodharts-law', section: 'razors' } }],
]);

function run(value, file = { path: '/c/other.md' }) {
  const tree = { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', value }] }] };
  remarkTerms({ terms, currentSlugOf: () => 'other' })(tree, file);
  return tree.children[0].children;
}

test('rewrites a known term into a link with the term class', () => {
  const [before, link, after] = run('Sample a [[golden set]] first.');
  assert.equal(before.value, 'Sample a ');
  assert.equal(link.type, 'link');
  assert.equal(link.url, '/ai/what-makes-an-eval');
  assert.deepEqual(link.data.hProperties.className, ['term']);
  assert.equal(link.children[0].value, 'golden set');
  assert.equal(after.value, ' first.');
});

test('handles two terms in one paragraph', () => {
  const nodes = run('Both [[golden set]] and [[Goodhart\'s Law]] here.');
  const links = nodes.filter((n) => n.type === 'link');
  assert.deepEqual(links.map((l) => l.url), ['/ai/what-makes-an-eval', '/razors/goodharts-law']);
});

test('matching is case-insensitive but the authored label is displayed', () => {
  const [, link] = run('See [[Golden Set]].');
  assert.equal(link.url, '/ai/what-makes-an-eval');
  assert.equal(link.children[0].value, 'Golden Set');
});

test('a page does not link a term it defines itself', () => {
  const tree = { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', value: 'A [[golden set]].' }] }] };
  remarkTerms({ terms, currentSlugOf: () => 'what-makes-an-eval' })(tree, { path: '/c/what-makes-an-eval.md' });
  const nodes = tree.children[0].children;
  assert.ok(!nodes.some((n) => n.type === 'link'));
  assert.equal(nodes.map((n) => n.value).join(''), 'A golden set.');
});

test('an unknown term degrades to plain text rather than breaking the build', () => {
  const nodes = run('An [[embedding space]] appears.');
  assert.ok(!nodes.some((n) => n.type === 'link'));
  assert.equal(nodes.map((n) => n.value).join(''), 'An embedding space appears.');
});

test('text with no term markers is left untouched', () => {
  const nodes = run('Nothing to link here.');
  assert.equal(nodes.length, 1);
  assert.equal(nodes[0].value, 'Nothing to link here.');
});

test('a [[term]] inside an existing link is left as plain text, not nested', () => {
  const outerLink = {
    type: 'link',
    url: 'https://example.com',
    children: [{ type: 'text', value: 'see the [[golden set]] method' }],
  };
  const tree = { type: 'root', children: [{ type: 'paragraph', children: [outerLink] }] };
  remarkTerms({ terms, currentSlugOf: () => 'other' })(tree, { path: '/c/other.md' });

  assert.equal(outerLink.children.length, 1);
  assert.equal(outerLink.children[0].type, 'text');
  assert.equal(outerLink.children[0].value, 'see the [[golden set]] method');
  assert.ok(!outerLink.children.some((n) => n.type === 'link'));
});

test('a [[term]] in ordinary prose still resolves alongside a link that has [[term]] text', () => {
  const outerLink = {
    type: 'link',
    url: 'https://example.com',
    children: [{ type: 'text', value: 'see the [[golden set]] method' }],
  };
  const tree = {
    type: 'root',
    children: [
      { type: 'paragraph', children: [outerLink] },
      { type: 'paragraph', children: [{ type: 'text', value: 'A [[golden set]] elsewhere.' }] },
    ],
  };
  remarkTerms({ terms, currentSlugOf: () => 'other' })(tree, { path: '/c/other.md' });

  assert.equal(outerLink.children[0].value, 'see the [[golden set]] method');

  const proseNodes = tree.children[1].children;
  const link = proseNodes.find((n) => n.type === 'link');
  assert.ok(link);
  assert.equal(link.url, '/ai/what-makes-an-eval');
});
