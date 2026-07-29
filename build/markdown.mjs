import MarkdownIt from 'markdown-it';

/**
 * The shared markdown renderer.
 *
 * ```mermaid fences render as <pre class="mermaid"> rather than a code block,
 * which is the element mermaid.js looks for at load time. Everything else
 * falls through to the default fence renderer.
 */
export function createMarkdown() {
  const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
  const defaultFence = md.renderer.rules.fence;

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (token.info.trim() === 'mermaid') {
      return `<pre class="mermaid">${md.utils.escapeHtml(token.content)}</pre>\n`;
    }
    return defaultFence(tokens, idx, options, env, self);
  };

  return md;
}
