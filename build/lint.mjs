import { paragraphsOf, countWords, countSentences, tokens } from './blocks.mjs';

export const CONTRACTS = {
  concept: ['The model', 'Decide it', "Why it's true", 'Worked example', 'Next'],
  razor: ['Statement', 'Decides', 'Why it holds', 'Example', 'Limits', 'Source'],
};

const MAX_MODEL_WORDS = 120;
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
  const block = blockByHeading(page, 'Worked example');
  if (!block) return [];
  const out = [];
  const words = countWords(block.text);
  if (words < MIN_EXAMPLE_WORDS) {
    out.push(violation('example-present', page, block.startLine,
      `"Worked example" is ${words} words (min ${MIN_EXAMPLE_WORDS})`));
  }
  const exampleTokens = new Set(tokens(block.text));
  const shared = tokens(page.summary ?? '').filter((t) => exampleTokens.has(t));
  if (shared.length === 0) {
    out.push(violation('example-present', page, block.startLine,
      '"Worked example" shares no significant word with the summary — it may not be an example of this page'));
  }
  return out;
}

function limitsPresent(page) {
  if (page.type !== 'razor') return [];
  const block = blockByHeading(page, 'Limits');
  if (!block) return [];
  if (countWords(block.text) > 0) return [];
  return [violation('limits-present', page, block.startLine,
    '"Limits" is empty — a razor without a stated boundary is a slogan')];
}

function sourcesRequired(page) {
  const needed = page.type === 'razor' || page.section === 'staff';
  if (!needed || page.sources.length > 0) return [];
  return [violation('sources-required', page, 1,
    'sources are required for razor pages and every page in the staff section')];
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

const PAGE_RULES = [blocksExact, modelLength, paragraphSize, examplePresent, limitsPresent, sourcesRequired, summaryPresent];

export function lintPage(page) {
  return PAGE_RULES.flatMap((rule) => rule(page));
}
