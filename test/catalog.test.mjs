import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeCatalog, catalogViolations, loadCatalog } from '../tools/catalog.mjs';

const CONTENT = new URL('../content/', import.meta.url).pathname;

const catalog = {
  families: ['Decision and judgment', 'Laws of systems'],
  razors: [
    { id: 'goodharts-law', title: "Goodhart's Law", family: 'Decision and judgment', statement: 'A measure that becomes a target stops measuring.', source: 'Goodhart (1975)' },
    { id: 'galls-law', title: "Gall's Law", family: 'Decision and judgment', statement: 'Complex systems evolve from simple ones.', source: 'Gall (1975)' },
    { id: 'littles-law', title: "Little's Law", family: 'Laws of systems', statement: 'Items equal arrival rate times wait.', source: 'Little (1961)' },
  ],
};

const razorPage = (slug) => ({
  slug, type: 'razor', section: 'razors', title: slug, filePath: `/r/${slug}.md`,
  defines: [], razors: [], prereq: [], next: [], sources: [],
  blocks: [{ heading: 'Statement', text: 'The written statement.', startLine: 1 }],
});

const rulesOf = (violations) => violations.map((v) => v.rule);

test('mergeCatalog groups by family in declared order', () => {
  const groups = mergeCatalog(catalog, []);
  assert.deepEqual(groups.map((g) => g.family), ['Decision and judgment', 'Laws of systems']);
  assert.equal(groups[0].entries.length, 2);
});

test('mergeCatalog sorts entries by title inside a family', () => {
  const [decision] = mergeCatalog(catalog, []);
  assert.deepEqual(decision.entries.map((e) => e.id), ['galls-law', 'goodharts-law']);
});

test('mergeCatalog attaches a written page to its entry and leaves the rest null', () => {
  const groups = mergeCatalog(catalog, [razorPage('goodharts-law')]);
  const entries = groups[0].entries;
  assert.equal(entries.find((e) => e.id === 'goodharts-law').page.slug, 'goodharts-law');
  assert.equal(entries.find((e) => e.id === 'galls-law').page, null);
});

test('catalog-unique rejects a repeated id', () => {
  const dupe = { ...catalog, razors: [...catalog.razors, catalog.razors[0]] };
  assert.ok(rulesOf(catalogViolations(dupe, [])).includes('catalog-unique'));
});

test('catalog-complete rejects a missing field', () => {
  const broken = { ...catalog, razors: [{ id: 'x', title: 'X', family: 'Laws of systems', statement: '' , source: 'S' }] };
  const found = catalogViolations(broken, []).find((v) => v.rule === 'catalog-complete');
  assert.match(found.message, /missing statement/);
});

test('catalog-complete rejects a family that is not declared', () => {
  const broken = { ...catalog, razors: [{ id: 'x', title: 'X', family: 'Invented', statement: 'S', source: 'S' }] };
  assert.match(catalogViolations(broken, []).find((v) => v.rule === 'catalog-complete').message, /not in families/);
});

test('catalog-complete rejects a razor page with no catalog entry', () => {
  const found = catalogViolations(catalog, [razorPage('unlisted-razor')]);
  assert.match(found.find((v) => v.rule === 'catalog-complete').message, /no catalog entry/);
});

test('the real catalog is internally consistent', () => {
  const real = loadCatalog(CONTENT);
  assert.ok(real.razors.length > 100, 'the estate should be complete, not a sample');
  assert.deepEqual(catalogViolations(real, []), []);
});
