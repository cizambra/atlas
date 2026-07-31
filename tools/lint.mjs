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

/**
 * The third capability — build it, or guide a team building it — is the one pages
 * fail, and they fail it by describing the shape of the work instead of handing over
 * a procedure. The wording of the beat is the author's ("How to hand work over" beats
 * a generic label); its existence, and the numbered steps under it, are not.
 */
function procedurePresent(page) {
  if (page.type !== 'concept') return [];
  const block = blockByHeading(page, 'Speedrun');
  if (!block) return [];

  const hasHowBeat = /^\*\*How\b[^*]*\*\*/m.test(block.text);
  const hasSteps = /^\s*1\.\s+\S/m.test(block.text);
  if (hasHowBeat && hasSteps) return [];

  const missing = !hasHowBeat
    ? 'no "**How ...**" beat'
    : 'a "How" beat with no numbered steps under it';
  return [violation('procedure-present', page, block.startLine,
    `"Speedrun" has ${missing} — a reader cannot build the thing from a description of it`)];
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

/**
 * An illustration carries an attribution obligation whether or not anyone else
 * ever sees the page, and alt text is what makes it readable at all when the
 * image fails to load. Both are required whenever an illustration is present.
 */
function illustrationCredited(page) {
  if (!page.illustration) return [];
  const out = [];
  if (!page.illustrationAlt) {
    out.push(violation('illustration-credited', page, 1,
      'illustration needs illustration_alt — describe what it shows, not that it is an image'));
  }
  if (!page.illustrationCredit) {
    out.push(violation('illustration-credited', page, 1,
      'illustration needs illustration_credit — creator and licence, or "authored for this atlas"'));
  }
  return out;
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
  blocksExact, modelLength, speedrunLength, procedurePresent, paragraphSize,
  examplePresent, visualPresent, limitsPresent, sourcesRequired, summaryPresent,
  illustrationCredited,
];

export function lintPage(page) {
  // Generated index pages are not authored content and have no block contract.
  if (page.type === 'generated') return [];
  return PAGE_RULES.flatMap((rule) => rule(page));
}

export function lintCollection(pages) {
  const out = [];
  const bySlug = new Map(pages.map((p) => [p.slug, p]));

  for (const page of pages) {
    for (const slug of [...page.razors, ...(page.prereq ?? [])]) {
      if (!bySlug.has(slug)) {
        out.push(violation('links-resolve', page, 1, `link target "${slug}" does not exist`));
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

  return out;
}
