import { test } from 'node:test';
import assert from 'node:assert/strict';
import config from '../docusaurus.config.js';

/**
 * `stylesheets` and `scripts` are the only asset paths Docusaurus emits
 * verbatim — it prepends baseUrl to `<Link>`, images, and everything webpack
 * touches, but never to these. A root-absolute href that omits baseUrl 404s,
 * and a missing stylesheet fails quietly: the markup it should style is still
 * there, so element counts and HTTP checks on the page both look healthy.
 * That is how a broken KaTeX stylesheet shipped once already.
 */
const rootAbsoluteHrefs = (config) =>
  [...(config.stylesheets ?? []), ...(config.scripts ?? [])]
    .map((entry) => (typeof entry === 'string' ? entry : entry.href ?? entry.src))
    .filter((href) => href?.startsWith('/'));

test('a root-absolute href that skips baseUrl is detected', () => {
  const bad = { baseUrl: '/atlas/', stylesheets: [{ href: '/katex.min.css' }] };
  assert.deepEqual(rootAbsoluteHrefs(bad), ['/katex.min.css']);
  assert.ok(!rootAbsoluteHrefs(bad).every((h) => h.startsWith(bad.baseUrl)));
});

test('hrefs that carry baseUrl, and off-site hrefs, both pass', () => {
  const good = {
    baseUrl: '/atlas/',
    stylesheets: [{ href: '/atlas/katex.min.css' }],
    scripts: ['https://example.com/a.js'],
  };
  assert.deepEqual(rootAbsoluteHrefs(good), ['/atlas/katex.min.css']);
  assert.ok(rootAbsoluteHrefs(good).every((h) => h.startsWith(good.baseUrl)));
});

test('every root-absolute href in the real config carries baseUrl', () => {
  for (const href of rootAbsoluteHrefs(config)) {
    assert.ok(
      href.startsWith(config.baseUrl),
      `${href} is emitted verbatim and does not start with baseUrl ${config.baseUrl}`,
    );
  }
});
