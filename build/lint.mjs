import { paragraphsOf, stripFences, countWords, countSentences, tokens } from './blocks.mjs';
import { buildTermIndex, termReferences, duplicateDefinitions, normalize } from './terms.mjs';

/**
 * The concept contract is a progressive-disclosure ladder. Each rung answers one
 * reader question and is readable without the rung below it:
 *   summary   — what are we talking about, in one line
 *   The model — what are we talking about, in one paragraph
 *   Speedrun  — everything I need, in five minutes
 *   Going deeper — what takes me to the next level
 */
export const CONTRACTS = {
  concept: ['The model', 'When to use it', 'Speedrun', 'Going deeper', 'See it work', 'Next'],
  razor: ['Statement', 'Decides', 'Why it holds', 'Example', 'Limits', 'Source'],
};

const MAX_MODEL_WORDS = 120;
/** Five minutes is absorbing, not skimming. 500 words is roughly half of it read aloud. */
const MAX_SPEEDRUN_WORDS = 500;
const MAX_PARAGRAPH_WORDS = 80;
const MAX_PARAGRAPH_SENTENCES = 4;
const MIN_EXAMPLE_WORDS = 100;
const MAX_SUMMARY_WORDS = 25;

const violation = (rule, page, line, message) => ({ rule, file: page.filePath, line, message });
const blockByHeading = (page, heading) => page.blocks.find((b) => b.heading === heading);
const firstLine = (page) => page.blocks[0]?.startLine ?? 1;

function blocksExact(page) {
  const expected = CONTRACTS[page.type];
  if (!expected) return [violation('blocks-exact', page, 1, `unknown page type ${JSON.stringify(page.type)}`)];
  const actual = page.blocks.map((b) => b.heading);
  const matches = expected.length === actual.length && expected.every((h, i) => h === actual[i]);
  if (matches) return [];
  return [violation('blocks-exact', page, firstLine(page),
    `expected headings [${expected.join(' | ')}], found [${actual.join(' | ')}]`)];
}

function modelLength(page) {
  if (page.type !== 'concept') return [];
  const block = blockByHeading(page, 'The model');
  if (!block) return [];
  const words = countWords(block.text);
  if (words <= MAX_MODEL_WORDS) return [];
  return [violation('model-length', page, block.startLine,
    `"The model" is ${words} words (max ${MAX_MODEL_WORDS}) — if the model needs more, it is not yet a model`)];
}

function speedrunLength(page) {
  if (page.type !== 'concept') return [];
  const block = blockByHeading(page, 'Speedrun');
  if (!block) return [];
  const words = countWords(stripFences(block.text));
  if (words <= MAX_SPEEDRUN_WORDS) return [];
  return [violation('speedrun-length', page, block.startLine,
    `"Speedrun" is ${words} words (max ${MAX_SPEEDRUN_WORDS}) — it promises five minutes, so it has to fit in five minutes`)];
}

function paragraphSize(page) {
  const out = [];
  for (const block of page.blocks) {
    for (const paragraph of paragraphsOf(block.text)) {
      const words = countWords(paragraph);
      const sentences = countSentences(paragraph);
      if (words > MAX_PARAGRAPH_WORDS) {
        out.push(violation('paragraph-size', page, block.startLine,
          `paragraph in "${block.heading}" is ${words} words (max ${MAX_PARAGRAPH_WORDS})`));
      }
      if (sentences > MAX_PARAGRAPH_SENTENCES) {
        out.push(violation('paragraph-size', page, block.startLine,
          `paragraph in "${block.heading}" is ${sentences} sentences (max ${MAX_PARAGRAPH_SENTENCES})`));
      }
    }
  }
  return out;
}

function examplePresent(page) {
  if (page.type !== 'concept') return [];
  const block = blockByHeading(page, 'See it work');
  if (!block) return [];
  const out = [];
  const words = countWords(stripFences(block.text));
  if (words < MIN_EXAMPLE_WORDS) {
    out.push(violation('example-present', page, block.startLine,
      `"See it work" is ${words} words of prose (min ${MIN_EXAMPLE_WORDS}) — the diagram does not count`));
  }
  const exampleTokens = new Set(tokens(block.text));
  const shared = tokens(page.summary ?? '').filter((t) => exampleTokens.has(t));
  if (shared.length === 0) {
    out.push(violation('example-present', page, block.startLine,
      '"See it work" shares no significant word with the summary — it may not be an example of this page'));
  }
  return out;
}

function visualPresent(page) {
  if (page.type !== 'concept') return [];
  const block = blockByHeading(page, 'See it work');
  if (!block) return [];
  if (/^\s*```mermaid\b/m.test(block.text)) return [];
  return [violation('visual-present', page, block.startLine,
    '"See it work" has no ```mermaid diagram — the example is meant to be seen, not only read')];
}

function limitsPresent(page) {
  if (page.type !== 'razor') return [];
  const block = blockByHeading(page, 'Limits');
  if (!block) return [];
  if (countWords(block.text) > 0) return [];
  return [violation('limits-present', page, block.startLine,
    '"Limits" is empty — a razor without a stated boundary is a slogan')];
}

/**
 * Sections whose claims are about people and practice rather than mechanism.
 * An unsourced claim here is indistinguishable, to a junior reader, from
 * established practice — so it has to name an origin.
 */
const SOURCED_SECTIONS = new Set(['staff', 'communication']);

function sourcesRequired(page) {
  const needed = page.type === 'razor' || SOURCED_SECTIONS.has(page.section);
  if (!needed || page.sources.length > 0) return [];
  return [violation('sources-required', page, 1,
    `sources are required for razor pages and every page in: ${[...SOURCED_SECTIONS].join(', ')}`)];
}

function summaryPresent(page) {
  if (page.type !== 'concept') return [];
  if (!page.summary) return [violation('summary-present', page, 1, 'summary is required on concept pages')];
  const words = countWords(page.summary);
  if (words > MAX_SUMMARY_WORDS) {
    return [violation('summary-present', page, 1, `summary is ${words} words (max ${MAX_SUMMARY_WORDS})`)];
  }
  return [];
}

const PAGE_RULES = [
  blocksExact, modelLength, speedrunLength, paragraphSize,
  examplePresent, visualPresent, limitsPresent, sourcesRequired, summaryPresent,
];

export function lintPage(page) {
  return PAGE_RULES.flatMap((rule) => rule(page));
}

export function lintCollection(pages, sections) {
  const out = [];
  const bySlug = new Map(pages.map((p) => [p.slug, p]));

  for (const page of pages) {
    for (const slug of [...page.next, ...page.razors, ...(page.prereq ?? [])]) {
      if (!bySlug.has(slug)) {
        out.push(violation('links-resolve', page, 1, `link target "${slug}" does not exist`));
      }
    }
  }

  const listed = new Map();
  for (const section of sections.values()) {
    for (const group of section.groups) {
      for (const slug of group.pages) {
        listed.set(slug, (listed.get(slug) ?? 0) + 1);
        if (!bySlug.has(slug)) {
          out.push({ rule: 'nav-orphan', file: `${section.id}/_section.json`, line: 1,
            message: `"${slug}" is listed in the nav but has no file` });
        }
      }
    }
  }

  for (const { term, page, owner } of duplicateDefinitions(pages)) {
    out.push(violation('terms-unique', page, 1,
      `"${term}" is already defined by ${owner.slug} — a term needs exactly one source`));
  }

  const terms = buildTermIndex(pages);
  for (const page of pages) {
    for (const block of page.blocks) {
      for (const { label } of termReferences(stripFences(block.text))) {
        if (!terms.has(normalize(label))) {
          out.push(violation('terms-resolve', page, block.startLine,
            `[[${label}]] has no defining page — add it to some page's "defines:" or drop the link`));
        }
      }
    }
  }

  for (const page of pages) {
    const count = listed.get(page.slug) ?? 0;
    if (count !== 1) {
      out.push(violation('nav-complete', page, 1,
        count === 0
          ? `"${page.slug}" is not listed in ${page.section}/_section.json — it would be unreachable`
          : `"${page.slug}" is listed ${count} times in the nav`));
    }
  }

  return out;
}
