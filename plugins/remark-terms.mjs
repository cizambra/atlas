import { visit, SKIP } from 'unist-util-visit';
import { normalize } from '../build/terms.mjs';

const PATTERN = /\[\[([^\]\n]+)\]\]/g;

/**
 * `[[golden set]]` becomes a link to the page that declares the term.
 *
 * An unresolved term degrades to plain text: the `terms-resolve` lint rule
 * already fails the build for those, with a file and line the renderer cannot
 * report as usefully.
 */
export default function remarkTerms({ terms, currentSlugOf }) {
  return (tree, file) => {
    const current = currentSlugOf(file);

    visit(tree, (node, index, parent) => {
      if (node.type === 'link') return SKIP;
      if (node.type !== 'text') return;
      if (!parent || index === null || !node.value.includes('[[')) return;

      const pieces = [];
      let last = 0;

      for (const match of node.value.matchAll(PATTERN)) {
        const label = match[1].trim();
        const entry = terms.get(normalize(label));
        const selfLink = entry && entry.page.slug === current;

        if (match.index > last) {
          pieces.push({ type: 'text', value: node.value.slice(last, match.index) });
        }

        if (entry && !selfLink) {
          pieces.push({
            type: 'link',
            url: `/${[entry.page.section, entry.page.group, entry.page.slug].filter(Boolean).join('/')}`,
            data: { hProperties: { className: ['term'] } },
            children: [{ type: 'text', value: label }],
          });
        } else {
          pieces.push({ type: 'text', value: label });
        }

        last = match.index + match[0].length;
      }

      if (pieces.length === 0) return;
      if (last < node.value.length) {
        pieces.push({ type: 'text', value: node.value.slice(last) });
      }

      parent.children.splice(index, 1, ...pieces);
      return index + pieces.length;
    });
  };
}
