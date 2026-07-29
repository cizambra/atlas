import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from '../build/build.mjs';

const CONTENT = new URL('./fixtures/content/', import.meta.url).pathname;
const ASSETS = new URL('../assets/', import.meta.url).pathname;
const MERMAID = new URL('../node_modules/mermaid/dist/mermaid.min.js', import.meta.url).pathname;

function run(contentDir = CONTENT) {
  const distDir = mkdtempSync(join(tmpdir(), 'atlas-'));
  const result = build({ contentDir, distDir, assetsDir: ASSETS, mermaidBundle: MERMAID });
  return { ...result, distDir };
}

test('writes one html file per page', () => {
  const { distDir, violations } = run();
  assert.deepEqual(violations, []);
  assert.ok(existsSync(join(distDir, 'ai', 'sample-concept.html')));
  assert.ok(existsSync(join(distDir, 'razors', 'sample-razor.html')));
});

test('writes the home page, razor index, search index and assets', () => {
  const { distDir } = run();
  const expected = ['index.html', 'razors/index.html', 'search-index.json',
    'atlas.css', 'search.js', 'mermaid-init.js', 'mermaid.min.js'];
  for (const file of expected) {
    assert.ok(existsSync(join(distDir, file)), `missing ${file}`);
  }
});

test('builds without a mermaid bundle rather than failing', () => {
  const distDir = mkdtempSync(join(tmpdir(), 'atlas-'));
  const result = build({ contentDir: CONTENT, distDir, assetsDir: ASSETS, mermaidBundle: undefined });
  assert.deepEqual(result.violations, []);
  assert.ok(!result.written.includes('mermaid.min.js'));
});

test('the search index contains every page', () => {
  const { distDir } = run();
  const index = JSON.parse(readFileSync(join(distDir, 'search-index.json'), 'utf8'));
  assert.equal(index.pages.length, 2);
});

test('a lint violation is reported and no html is written', () => {
  const broken = mkdtempSync(join(tmpdir(), 'atlas-src-'));
  const dir = join(broken, 'ai');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, '_section.json'), JSON.stringify({ title: 'AI', groups: [{ id: 'g', title: 'G', pages: ['bad'] }] }));
  writeFileSync(join(dir, 'bad.md'), '---\ntype: concept\ntitle: Bad\nsection: ai\nsummary: A bad page.\n---\n\n## The model\n\nOnly one block.\n');
  const distDir = mkdtempSync(join(tmpdir(), 'atlas-'));
  const result = build({ contentDir: broken, distDir, assetsDir: ASSETS });
  assert.ok(result.violations.some((v) => v.rule === 'blocks-exact'));
  assert.equal(result.written.length, 0);
});
