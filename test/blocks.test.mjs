import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitBlocks, paragraphsOf, countWords, countSentences, tokens } from '../tools/blocks.mjs';

test('splits on ## headings and records line numbers', () => {
  const body = '## The model\n\nAlpha.\n\n## Decide it\n\nBeta.\n';
  const blocks = splitBlocks(body, 5);
  assert.deepEqual(blocks.map((b) => b.heading), ['The model', 'Decide it']);
  assert.equal(blocks[0].startLine, 5);
  assert.equal(blocks[1].startLine, 9);
  assert.equal(blocks[0].text.trim(), 'Alpha.');
});

test('keeps ### headings inside the parent block', () => {
  const blocks = splitBlocks('## Why it\'s true\n\n### Detail\n\nText.\n', 1);
  assert.equal(blocks.length, 1);
  assert.match(blocks[0].text, /### Detail/);
});

test('ignores ## inside fenced code', () => {
  const blocks = splitBlocks('## The model\n\n```\n## not a heading\n```\n', 1);
  assert.equal(blocks.length, 1);
});

test('returns no blocks for an empty body', () => {
  assert.deepEqual(splitBlocks('\n', 1), []);
});

test('paragraphsOf excludes tables, lists, quotes, fences and headings', () => {
  const text = [
    'A real paragraph.',
    '',
    '| a | b |',
    '| - | - |',
    '',
    '- list item one',
    '- list item two',
    '',
    '> a quote',
    '',
    '```',
    'code line',
    '```',
    '',
    '### A heading',
    '',
    'Another real paragraph.',
  ].join('\n');
  assert.deepEqual(paragraphsOf(text), ['A real paragraph.', 'Another real paragraph.']);
});

test('countWords counts whitespace-separated tokens', () => {
  assert.equal(countWords('one two  three\nfour'), 4);
  assert.equal(countWords('   '), 0);
});

test('countSentences counts terminators, minimum one', () => {
  assert.equal(countSentences('One. Two! Three?'), 3);
  assert.equal(countSentences('No terminator'), 1);
});

test('tokens drops short words and stopwords, and dedupes', () => {
  assert.deepEqual(tokens('The cache holds cache entries with staleness'), ['cache', 'holds', 'entries', 'staleness']);
});
