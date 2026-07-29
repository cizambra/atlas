import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';
import { splitBlocks } from './blocks.mjs';

const asArray = (value) => (Array.isArray(value) ? value : value === undefined ? [] : [value]);

export function loadPage(filePath, raw) {
  const { data, body, bodyStartLine } = parseFrontmatter(raw);
  return {
    slug: basename(filePath, '.md'),
    type: data.type,
    title: data.title,
    section: data.section,
    group: data.group,
    family: data.family,
    summary: data.summary,
    illustration: data.illustration,
    illustrationAlt: data.illustration_alt,
    illustrationCredit: data.illustration_credit,
    illustrationSource: data.illustration_source,
    defines: asArray(data.defines),
    razors: asArray(data.razors),
    prereq: asArray(data.prereq),
    next: asArray(data.next),
    sources: asArray(data.sources),
    blocks: splitBlocks(body, bodyStartLine),
    filePath,
  };
}

export function loadSections(contentDir) {
  const sections = new Map();
  for (const id of readdirSync(contentDir)) {
    const dir = join(contentDir, id);
    if (!statSync(dir).isDirectory()) continue;
    const config = JSON.parse(readFileSync(join(dir, '_section.json'), 'utf8'));
    sections.set(id, { id, title: config.title, groups: config.groups });
  }
  return sections;
}

export function loadContent(contentDir) {
  const sections = loadSections(contentDir);
  const pages = [];
  for (const id of sections.keys()) {
    const dir = join(contentDir, id);
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const filePath = join(dir, file);
      pages.push(loadPage(filePath, readFileSync(filePath, 'utf8')));
    }
  }
  return { pages, sections };
}
