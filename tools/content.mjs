import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';
import { splitBlocks } from './blocks.mjs';

const asArray = (value) => (Array.isArray(value) ? value : value === undefined ? [] : [value]);

export function loadPage(filePath, raw, location = {}) {
  const { data, body, bodyStartLine } = parseFrontmatter(raw);
  return {
    slug: basename(filePath, '.md'),
    type: data.type,
    title: data.title,
    section: location.section,
    group: location.group,
    family: data.family,
    summary: data.summary,
    illustration: data.illustration,
    illustrationAlt: data.illustration_alt,
    illustrationCaption: data.illustration_caption,
    illustrationCredit: data.illustration_credit,
    illustrationSource: data.illustration_source,
    // Docusaurus falls back to alphabetical order without this, which put the
    // Fundamentals group in almost exactly reverse reading order. Frontmatter
    // scalars arrive as strings, and this one has to be compared numerically —
    // as strings, "10" sorts before "9".
    sidebarPosition: data.sidebar_position === undefined
      ? undefined
      : Number(data.sidebar_position),
    defines: asArray(data.defines),
    razors: asArray(data.razors),
    prereq: asArray(data.prereq),
    sources: asArray(data.sources),
    blocks: splitBlocks(body, bodyStartLine),
    filePath,
  };
}

/** Every page under contentDir, walking one level of group folders. */
export function loadContent(contentDir) {
  const pages = [];

  for (const section of readdirSync(contentDir)) {
    const sectionDir = join(contentDir, section);
    if (!statSync(sectionDir).isDirectory()) continue;

    for (const entry of readdirSync(sectionDir)) {
      const entryPath = join(sectionDir, entry);

      if (statSync(entryPath).isDirectory()) {
        for (const file of readdirSync(entryPath)) {
          if (!file.endsWith('.md')) continue;
          const filePath = join(entryPath, file);
          pages.push(loadPage(filePath, readFileSync(filePath, 'utf8'), { section, group: entry }));
        }
        continue;
      }

      // A page sitting directly in a section folder — generated index pages.
      if (entry.endsWith('.md')) {
        pages.push(loadPage(entryPath, readFileSync(entryPath, 'utf8'), { section, group: null }));
      }
    }
  }

  return { pages };
}
