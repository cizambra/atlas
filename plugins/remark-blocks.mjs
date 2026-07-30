const WORDS_PER_MINUTE = 200;

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Flattens a heading's inline children — text nested inside emphasis, strong,
 * links, etc. — into plain text, instead of only reading direct children. */
function flattenText(node) {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value;
  return (node.children ?? []).map(flattenText).join('');
}

const headingText = (node) => node.children.map(flattenText).join('');

/** Words in a section's prose. Fenced code and diagrams are not prose. */
function countWords(nodes) {
  let words = 0;
  const walk = (node) => {
    if (node.type === 'code') return;
    if (node.value) words += node.value.trim().split(/\s+/).filter(Boolean).length;
    (node.children ?? []).forEach(walk);
  };
  nodes.forEach(walk);
  return words;
}

/**
 * Wrap each `##` section in a styled div so the block contract survives as CSS
 * hooks, and put a computed reading time on Speedrun so the five-minute promise
 * cannot drift from the text.
 */
export default function remarkBlocks() {
  return (tree) => {
    const out = [];
    let open = false;

    const closeIfOpen = () => {
      if (open) out.push({ type: 'html', value: '</div>' });
      open = false;
    };

    for (let i = 0; i < tree.children.length; i += 1) {
      const node = tree.children[i];

      if (node.type === 'heading' && node.depth === 2) {
        closeIfOpen();
        const title = headingText(node);

        if (title === 'Speedrun') {
          const until = tree.children.findIndex(
            (n, j) => j > i && n.type === 'heading' && n.depth === 2,
          );
          const body = tree.children.slice(i + 1, until === -1 ? undefined : until);
          const minutes = Math.max(1, Math.round(countWords(body) / WORDS_PER_MINUTE));
          node.children.push({
            type: 'html',
            value: `<span class="reading-time">${minutes} min</span>`,
          });
        }

        out.push({ type: 'html', value: `<div class="block block--${slugify(title)}">` });
        out.push(node);
        open = true;
        continue;
      }

      out.push(node);
    }

    closeIfOpen();
    tree.children = out;
  };
}
