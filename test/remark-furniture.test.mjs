import { test } from 'node:test';
import assert from 'node:assert/strict';
import remarkFurniture from '../plugins/remark-furniture.mjs';

const pagesBySlug = new Map([
  ['caching-strategies', { slug: 'caching-strategies', section: 'interviews', title: 'Caching strategies' }],
  ['goodharts-law', { slug: 'goodharts-law', section: 'razors', title: "Goodhart's Law" }],
]);

const h2 = (t) => ({ type: 'heading', depth: 2, children: [{ type: 'text', value: t }] });

function run(frontMatter, readAsset = () => null) {
  const tree = { type: 'root', children: [h2('The model')] };
  remarkFurniture({ pagesBySlug, readAsset })(tree, { data: { frontMatter } });
  return tree.children.filter((n) => n.type === 'html').map((n) => n.value).join('\n');
}

test('a page with no furniture frontmatter gets nothing', () => {
  assert.equal(run({}), '');
});

test('renders the prereq strip before the first block', () => {
  const tree = { type: 'root', children: [h2('The model')] };
  remarkFurniture({ pagesBySlug, readAsset: () => null })(
    tree, { data: { frontMatter: { prereq: ['caching-strategies'] } } },
  );
  assert.equal(tree.children[0].type, 'html');
  assert.match(tree.children[0].value, /class="prereq"/);
  assert.match(tree.children[0].value, /href="\/interviews\/caching-strategies"/);
  assert.match(tree.children[0].value, /Read first/);
});

test('inlines a local SVG illustration and carries caption and credit', () => {
  const html = run(
    {
      illustration: 'img/x.svg',
      illustration_alt: 'A rising line',
      illustration_caption: 'What it shows.',
      illustration_credit: 'Authored for this atlas',
    },
    () => '<svg class="ill"></svg>',
  );
  assert.match(html, /<div class="illustration-art" role="img" aria-label="A rising line"><svg/);
  assert.match(html, /What it shows\./);
  assert.match(html, /Authored for this atlas/);
  assert.doesNotMatch(html, /<img/);
});

test('a remote illustration renders as an img and links its credit', () => {
  const html = run({
    illustration: 'https://upload.wikimedia.org/x.png',
    illustration_alt: 'OODA',
    illustration_credit: 'P. Moran, CC BY 3.0',
    illustration_source: 'https://commons.wikimedia.org/wiki/File:OODA.Boyd.svg',
  });
  assert.match(html, /<img src="https:\/\/upload\.wikimedia\.org\/x\.png" alt="OODA">/);
  assert.match(html, /<a href="https:\/\/commons\.wikimedia\.org[^"]*">P\. Moran, CC BY 3\.0<\/a>/);
});

test('appends cited razors and sources after the content', () => {
  const tree = { type: 'root', children: [h2('The model')] };
  remarkFurniture({ pagesBySlug, readAsset: () => null })(tree, {
    data: { frontMatter: { razors: ['goodharts-law'], sources: ['Larson (2021)'] } },
  });
  const tail = tree.children.slice(-2).map((n) => n.value).join('\n');
  assert.match(tail, /class="razor-links"/);
  assert.match(tail, /href="\/razors\/goodharts-law"/);
  assert.match(tail, /class="sources"/);
  assert.match(tail, /Larson \(2021\)/);
});

test('escapes frontmatter text rather than trusting it', () => {
  const html = run({
    illustration: 'https://x/y.png',
    illustration_alt: 'a "quoted" <tag>',
    illustration_credit: 'me',
  });
  assert.match(html, /&quot;quoted&quot;/);
  assert.match(html, /&lt;tag&gt;/);
});

test('a local non-SVG illustration renders with an absolute src', () => {
  const html = run({
    illustration: 'img/photo.png',
    illustration_alt: 'A photo',
    illustration_credit: 'me',
  });
  assert.match(html, /<img src="\/img\/photo\.png" alt="A photo">/);
});

test('a remote illustration is left exactly as authored', () => {
  const html = run({
    illustration: 'https://upload.wikimedia.org/x.png',
    illustration_alt: 'OODA',
    illustration_credit: 'me',
  });
  assert.match(html, /<img src="https:\/\/upload\.wikimedia\.org\/x\.png" alt="OODA">/);
});

test('a local SVG that fails to read falls back to img with an absolute path', () => {
  const html = run(
    {
      illustration: 'img/missing.svg',
      illustration_alt: 'Missing',
      illustration_credit: 'me',
    },
    () => null,
  );
  assert.match(html, /<img src="\/img\/missing\.svg" alt="Missing">/);
  assert.doesNotMatch(html, /<div class="illustration-art"/);
});
