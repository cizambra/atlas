import { visit } from 'unist-util-visit';

/** Temporary. Proves a remark plugin can inject raw HTML into a .md page. */
export default function remarkSpike() {
  return (tree) => {
    visit(tree, 'heading', (node, index, parent) => {
      if (node.depth !== 2 || index === null) return;
      parent.children.splice(index, 0, {
        type: 'html',
        value: '<div data-spike="ok">SPIKE OK</div>',
      });
      return index + 2;
    });
  };
}
