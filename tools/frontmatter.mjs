const DELIM = '---';

function unquote(value) {
  const trimmed = value.trim();
  if (trimmed.length >= 2 && /^(".*"|'.*')$/s.test(trimmed)) return trimmed.slice(1, -1);
  return trimmed;
}

/**
 * Parse the supported frontmatter subset.
 * Supported: `key: value`, `key: [a, b]`, and a block list of items under `key:`.
 * Anything else throws — a loud failure beats a silent misparse.
 */
export function parseFrontmatter(raw) {
  const lines = raw.split('\n');
  if (lines[0].trim() !== DELIM) throw new Error('frontmatter must start with ---');

  const close = lines.indexOf(DELIM, 1);
  if (close === -1) throw new Error('unterminated frontmatter: no closing ---');

  const data = {};
  let currentListKey = null;

  for (let i = 1; i < close; i += 1) {
    const line = lines[i];
    if (line.trim() === '' || line.trim().startsWith('#')) continue;

    const listItem = line.match(/^\s+-\s+(.*)$/);
    if (listItem) {
      if (!currentListKey) throw new Error(`unsupported frontmatter at line ${i + 1}: list item without a key`);
      data[currentListKey].push(unquote(listItem[1]));
      continue;
    }

    const pair = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!pair) throw new Error(`unsupported frontmatter at line ${i + 1}: ${JSON.stringify(line)}`);

    const [, key, rest] = pair;
    if (rest.trim() === '') {
      data[key] = [];
      currentListKey = key;
      continue;
    }

    currentListKey = null;
    const inline = rest.trim().match(/^\[(.*)\]$/s);
    if (inline) {
      const inner = inline[1].trim();
      data[key] = inner === '' ? [] : inner.split(',').map(unquote).filter((v) => v !== '');
      continue;
    }

    data[key] = unquote(rest);
  }

  return {
    data,
    body: lines.slice(close + 1).join('\n'),
    bodyStartLine: close + 2,
  };
}
