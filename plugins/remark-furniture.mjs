const escape = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const asArray = (v) => (Array.isArray(v) ? v : v === undefined ? [] : [v]);

// A page inside a group folder (content/<section>/<group>/<slug>.md) routes
// to /<section>/<group>/<slug> — the group segment can't be dropped.
const href = (page) => `/${[page.section, page.group, page.slug].filter(Boolean).join('/')}`;

// Docusaurus serves `static/` at the site root, so a local asset path needs a
// leading slash to resolve the same way at every page depth. Remote URLs pass
// through untouched; an already-absolute local path is left as-is.
const assetSrc = (src) => (/^https?:/.test(src) ? src : `/${src.replace(/^\/+/, '')}`);

function prereqStrip(slugs, pagesBySlug) {
  if (slugs.length === 0) return null;
  const items = slugs.map((slug) => {
    const page = pagesBySlug.get(slug);
    return page ? `<li><a href="${href(page)}">${escape(page.title)}</a></li>` : '';
  }).join('');
  return `<nav class="prereq" aria-label="Read first"><span class="prereq-label">Read first</span><ul>${items}</ul></nav>`;
}

function illustration(fm, readAsset) {
  if (!fm.illustration) return null;

  const isLocalSvg = fm.illustration.endsWith('.svg') && !/^https?:/.test(fm.illustration);
  const inlined = isLocalSvg ? readAsset(fm.illustration) : null;

  const art = inlined
    ? `<div class="illustration-art" role="img" aria-label="${escape(fm.illustration_alt)}">${inlined}</div>`
    : `<img src="${escape(assetSrc(fm.illustration))}" alt="${escape(fm.illustration_alt)}">`;

  const credit = fm.illustration_source
    ? `<a href="${escape(fm.illustration_source)}">${escape(fm.illustration_credit)}</a>`
    : escape(fm.illustration_credit);

  const caption = fm.illustration_caption
    ? `<span class="illustration-caption">${escape(fm.illustration_caption)}</span>`
    : '';

  return `<figure class="illustration">${art}<figcaption>${caption}<span class="illustration-credit">${credit}</span></figcaption></figure>`;
}

function razorLinks(slugs, pagesBySlug) {
  if (slugs.length === 0) return null;
  const items = slugs.map((slug) => {
    const page = pagesBySlug.get(slug);
    return page ? `<li><a href="${href(page)}">${escape(page.title)}</a></li>` : '';
  }).join('');
  return `<aside class="razor-links"><h2>Razors this rests on</h2><ul>${items}</ul></aside>`;
}

function sourcesList(sources) {
  if (sources.length === 0) return null;
  const items = sources.map((s) => `<li>${escape(s)}</li>`).join('');
  return `<aside class="sources"><h2>Sources</h2><ul>${items}</ul></aside>`;
}

/**
 * Page furniture the block contract implies but markdown cannot express:
 * what to read first, the illustration, the razors this rests on, the sources.
 * Driven entirely by frontmatter, so content files stay plain markdown.
 */
export default function remarkFurniture({ pagesBySlug, readAsset }) {
  return (tree, file) => {
    const fm = file?.data?.frontMatter ?? {};

    const before = [
      prereqStrip(asArray(fm.prereq), pagesBySlug),
      illustration(fm, readAsset),
    ].filter(Boolean).map((value) => ({ type: 'html', value }));

    const after = [
      razorLinks(asArray(fm.razors), pagesBySlug),
      sourcesList(asArray(fm.sources)),
    ].filter(Boolean).map((value) => ({ type: 'html', value }));

    tree.children.unshift(...before);
    tree.children.push(...after);
  };
}
