import MarkdownIt from 'markdown-it';
import katexPlugin from '@vscode/markdown-it-katex';

const OPEN = 0x5B; // [

/**
 * `[[golden set]]` links to the page that declares the term in `defines:`.
 *
 * The author names the term; the build selects the source. A term with no
 * defining page is caught earlier by the `terms-resolve` lint rule, which can
 * report file and line — by the time rendering runs, resolution always
 * succeeds, so an unresolved term here degrades to plain text rather than
 * throwing without context.
 *
 * A page linking a term it defines itself renders as plain text: self-links
 * are noise.
 */
function termLinks(md, resolveTerm) {
  md.inline.ruler.before('link', 'term-link', (state, silent) => {
    const start = state.pos;
    if (state.src.charCodeAt(start) !== OPEN || state.src.charCodeAt(start + 1) !== OPEN) return false;

    const close = state.src.indexOf(']]', start + 2);
    if (close === -1) return false;

    const label = state.src.slice(start + 2, close).trim();
    if (label === '' || label.includes('\n')) return false;

    if (!silent) {
      const href = resolveTerm(label, state.env);
      if (href) {
        const open = state.push('link_open', 'a', 1);
        open.attrs = [['href', href], ['class', 'term']];
        state.push('text', '', 0).content = label;
        state.push('link_close', 'a', -1);
      } else {
        state.push('text', '', 0).content = label;
      }
    }

    state.pos = close + 2;
    return true;
  });
}

/**
 * The shared markdown renderer.
 *
 * ```mermaid fences render as <pre class="mermaid"> rather than a code block,
 * which is the element mermaid.js looks for at load time. Math in $...$ and
 * $$...$$ renders to static HTML, so pages carry KaTeX's stylesheet and fonts
 * but none of its JavaScript.
 *
 * `resolveTerm(label, env)` returns an href or null; `env.page` is the page
 * being rendered, so the resolver can suppress self-links. Page bodies always
 * render at depth 1 (`dist/<section>/<slug>.html`), so the resolver returns
 * paths relative to that.
 */
export function createMarkdown({ resolveTerm = () => null } = {}) {
  const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
  md.use(katexPlugin.default ?? katexPlugin, { throwOnError: true });
  termLinks(md, resolveTerm);

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
