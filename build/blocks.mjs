const STOPWORDS = new Set([
  'this', 'that', 'with', 'from', 'they', 'them', 'their', 'when', 'what', 'which',
  'have', 'been', 'into', 'than', 'then', 'your', 'yours', 'about', 'after', 'before',
  'because', 'while', 'where', 'would', 'could', 'should', 'there', 'these', 'those',
  'other', 'such', 'only', 'also', 'more', 'most', 'some', 'each', 'both', 'over',
  'under', 'between', 'does', 'will', 'must', 'here', 'were', 'like', 'just', 'very',
  'much', 'many', 'even', 'same', 'through', 'being', 'doing', 'against',
]);

/** Split a markdown body into `##`-delimited blocks. `###` stays inside its parent. */
export function splitBlocks(body, bodyStartLine) {
  const lines = body.split('\n');
  const blocks = [];
  let inFence = false;
  let current = null;

  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) inFence = !inFence;

    const heading = inFence ? null : line.match(/^##\s+(.*?)\s*$/);
    if (heading && !line.startsWith('###')) {
      if (current) blocks.push(current);
      current = { heading: heading[1], text: '', startLine: bodyStartLine + index };
      return;
    }
    if (current) current.text += `${line}\n`;
  });

  if (current) blocks.push(current);
  return blocks;
}

/** Prose paragraphs only — tables, lists, quotes, fenced code and headings are not prose. */
export function paragraphsOf(text) {
  return text
    .replace(/```[\s\S]*?(```|$)/g, '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !/^[|>]/.test(p))
    .filter((p) => !/^([-*+]|\d+\.)\s/.test(p))
    .filter((p) => !/^#{1,6}\s/.test(p));
}

export function countWords(text) {
  const trimmed = text.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
}

export function countSentences(text) {
  const matches = text.match(/[.!?](\s|$)/g);
  return matches ? matches.length : 1;
}

export function tokens(text) {
  const found = text.toLowerCase().match(/[a-z][a-z0-9-]{3,}/g) ?? [];
  return [...new Set(found)].filter((t) => !STOPWORDS.has(t));
}
