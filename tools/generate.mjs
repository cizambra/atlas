import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent } from './content.mjs';
import { loadCatalog, mergeCatalog } from './catalog.mjs';
import { buildTermIndex } from './terms.mjs';

/**
 * A pipe inside a cell would end the column early, and a raw newline would
 * end the row early — block text pulled from a written page is soft-wrapped
 * across source lines, so it arrives with internal newlines to collapse.
 */
const cell = (s = '') => String(s).replace(/\s+/g, ' ').trim().replace(/\|/g, '\\|');

// Docusaurus derives a doc's route from its full path under content/, so a
// page inside a group folder (content/<section>/<group>/<slug>.md) routes to
// /<section>/<group>/<slug> — the group segment can't be dropped.
const href = (page) => `/${[page.section, page.group, page.slug].filter(Boolean).join('/')}`;

export function renderRazorIndexMarkdown(groups) {
  const total = groups.reduce((n, g) => n + g.entries.length, 0);
  const written = groups.reduce((n, g) => n + g.entries.filter((e) => e.page).length, 0);

  const families = groups.map(({ family, entries }) => {
    const rows = entries.map((entry) => {
      const name = entry.page
        ? `[${cell(entry.title)}](${href(entry.page)})`
        : `${cell(entry.title)} <span class="pending">not yet written</span>`;
      const statement = entry.page
        ? (entry.page.blocks?.find((b) => b.heading === 'Statement')?.text.trim() ?? entry.statement)
        : entry.statement;
      return `| ${name} | ${cell(statement)} | ${cell(entry.source)} |`;
    }).join('\n');

    return `## ${family} <span class="family-count">${entries.length}</span>\n\n`
      + `| Razor | Statement | Source |\n| --- | --- | --- |\n${rows}\n`;
  }).join('\n');

  return `---
type: generated
title: Razor index
sidebar_label: Razor index
sidebar_position: 0
---

# Razor index

Every razor in the atlas, grouped by family — ${total} of them, ${written} of ${total} with a full entry so far. The rest carry their statement and source until written.

${families}`;
}

export function renderGlossaryMarkdown(termIndex) {
  const rows = [...termIndex.values()]
    .sort((a, b) => a.term.localeCompare(b.term))
    .map(({ term, page }) => `| **${cell(term)}** | [${cell(page.title)}](${href(page)}) | ${cell(page.section)} |`)
    .join('\n');

  return `---
type: generated
title: Glossary
sidebar_label: Glossary
sidebar_position: 99
---

# Glossary

Every term the atlas defines, and the one page that defines it. Writing \`[[term]]\` anywhere links here.

| Term | Defined in | Section |
| --- | --- | --- |
${rows}
`;
}

const SECTION_LABELS = {
  ai: 'AI Engineering',
  interviews: 'Interviews',
  communication: 'Communication',
  staff: 'Staff Engineering',
  razors: 'Razors',
};

/**
 * A reader arriving with a specific reason should not have to infer where to
 * start from an alphabetical list. Each route names the reader, not the topic.
 */
const START_HERE = [
  ['You have just been promoted to staff', '/staff/first-90-days/senior-to-staff-what-to-stop',
   'What to stop doing, then days 1–30, the traps, and picking your wedge.'],
  ['You are preparing for a system design interview', '/interviews/fundamentals/scoping-the-problem',
   'Scoping, the 45 minutes, the numbers, then the building blocks.'],
  ['You are shipping something a model powers', '/ai/foundations/what-a-model-is-doing',
   'What the model is doing, what it costs, and how to tell whether it works.'],
  ['Your writing is not landing', '/communication/foundations/lead-with-the-answer',
   'Lead with the answer, know your audience, cut, and signpost.'],
];

const byPosition = (a, b) => (a.position ?? Infinity) - (b.position ?? Infinity);

/**
 * The site root. `routeBasePath: '/'` makes it a doc route, and
 * `onBrokenLinks: 'throw'` fails the build if nothing is there.
 *
 * Pages are listed in the order the sidebar shows them — section position,
 * then group position, then sidebar_position within the group. Sorting by
 * title instead buried "Senior to staff — what to stop doing" at position 21
 * of the Staff Engineering list, which is where a new staff engineer starts.
 */
export function renderHomeMarkdown(pages, categories = new Map()) {
  const cat = (key) => categories.get(key) ?? {};

  const bySection = new Map();
  for (const page of pages) {
    if (!bySection.has(page.section)) bySection.set(page.section, []);
    bySection.get(page.section).push(page);
  }

  const sections = [...bySection.entries()]
    .sort(([a], [b]) => byPosition(cat(a), cat(b)))
    .map(([section, items]) => {
      const label = cat(section).label ?? SECTION_LABELS[section] ?? section;

      const byGroup = new Map();
      for (const page of items) {
        const key = page.group ?? '';
        if (!byGroup.has(key)) byGroup.set(key, []);
        byGroup.get(key).push(page);
      }

      const groups = [...byGroup.entries()]
        .sort(([a], [b]) => byPosition(cat(`${section}/${a}`), cat(`${section}/${b}`)))
        .map(([group, groupPages]) => {
          const links = groupPages
            .sort((a, b) => (a.sidebarPosition ?? Infinity) - (b.sidebarPosition ?? Infinity)
                            || a.title.localeCompare(b.title))
            .map((p) => `- [${cell(p.title)}](${href(p)})`)
            .join('\n');
          const heading = cat(`${section}/${group}`).label;
          return heading ? `### ${heading}\n\n${links}\n` : `${links}\n`;
        }).join('\n');

      const count = `${items.length} ${items.length === 1 ? 'page' : 'pages'}`;
      return `## ${label}\n\n${count}\n\n${groups}`;
    }).join('\n');

  const startHere = START_HERE
    .map(([who, path, what]) => `- **[${who}](${path})** — ${what}`)
    .join('\n');

  return `---
type: generated
title: Atlas
slug: /
sidebar_position: 0
---

# Atlas

AI engineering, technical interviews, staff engineering and communication — the model,
the decision, the mechanism, the example.

Every page answers four questions in the same order: what the model is, when to reach for
it, how it works, and what it looks like in a real case. Read a group top to bottom and it
builds; drop into one page and it stands alone.

## Start here

${startHere}

${sections}`;
}

export function generate(contentDir) {
  const { pages, categories } = loadContent(contentDir);
  const catalog = loadCatalog(contentDir);
  const authored = pages.filter((p) => p.type === 'concept' || p.type === 'razor');

  writeFileSync(join(contentDir, 'razors', 'index.md'),
    renderRazorIndexMarkdown(mergeCatalog(catalog, pages)));
  writeFileSync(join(contentDir, 'glossary.md'),
    renderGlossaryMarkdown(buildTermIndex(pages)));
  writeFileSync(join(contentDir, 'index.md'),
    renderHomeMarkdown(authored, categories));
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  generate(join(root, 'content'));
  console.log('generated razors/index.md and glossary.md');
}
