import { test } from 'node:test';
import assert from 'node:assert/strict';
import remarkBlocks from '../plugins/remark-blocks.mjs';

const h2 = (text) => ({ type: 'heading', depth: 2, children: [{ type: 'text', value: text }] });
const para = (text) => ({ type: 'paragraph', children: [{ type: 'text', value: text }] });

function run(children) {
  const tree = { type: 'root', children };
  remarkBlocks()(tree);
  return tree;
}

const htmlValues = (tree) => tree.children.filter((n) => n.type === 'html').map((n) => n.value);

test('wraps each ## section in a div carrying a slugified class', () => {
  const tree = run([h2('The model'), para('A model.'), h2("Why it's true"), para('Because.')]);
  const html = htmlValues(tree);
  assert.ok(html.includes('<div class="block block--the-model">'));
  assert.ok(html.includes('<div class="block block--why-it-s-true">'));
  assert.equal(html.filter((v) => v === '</div>').length, 2);
});

test('the opening div precedes its heading and the closing div follows the section', () => {
  const tree = run([h2('The model'), para('A model.')]);
  assert.equal(tree.children[0].value, '<div class="block block--the-model">');
  assert.equal(tree.children[1].type, 'heading');
  assert.equal(tree.children.at(-1).value, '</div>');
});

test('content before the first ## is left alone', () => {
  const tree = run([para('Intro.'), h2('The model'), para('A model.')]);
  assert.equal(tree.children[0].type, 'paragraph');
});

test('adds a computed reading time to Speedrun and to no other block', () => {
  const tree = run([h2('Speedrun'), para('word '.repeat(400)), h2('Going deeper'), para('short')]);
  const speedrun = tree.children.find((n) => n.type === 'heading');
  const injected = speedrun.children.at(-1);
  assert.equal(injected.type, 'html');
  assert.equal(injected.value, '<span class="reading-time">2 min</span>');

  const deeper = tree.children.filter((n) => n.type === 'heading')[1];
  assert.ok(!deeper.children.some((c) => c.type === 'html'));
});

test('reading time never rounds below one minute', () => {
  const tree = run([h2('Speedrun'), para('three short words')]);
  const heading = tree.children.find((n) => n.type === 'heading');
  assert.match(heading.children.at(-1).value, /1 min/);
});

test('fenced code does not count toward reading time', () => {
  const code = { type: 'code', lang: 'mermaid', value: 'flowchart LR\n' + 'A --> B\n'.repeat(500) };
  const tree = run([h2('Speedrun'), para('ten words here to keep this well under a minute'), code]);
  const heading = tree.children.find((n) => n.type === 'heading');
  assert.match(heading.children.at(-1).value, /1 min/);
});

test('leaves a tree with no ## headings untouched', () => {
  const tree = run([para('Just prose.')]);
  assert.equal(tree.children.length, 1);
});

test('slugifies headings with nested inline formatting, including the emphasised word', () => {
  const heading = {
    type: 'heading',
    depth: 2,
    children: [
      { type: 'text', value: 'Why ' },
      { type: 'emphasis', children: [{ type: 'text', value: "it's" }] },
      { type: 'text', value: ' true' },
    ],
  };
  const tree = run([heading, para('Because.')]);
  const html = htmlValues(tree);
  assert.ok(html.includes('<div class="block block--why-it-s-true">'));
});

test('injects the reading time when the Speedrun heading text is wrapped entirely in emphasis', () => {
  const heading = {
    type: 'heading',
    depth: 2,
    children: [{ type: 'emphasis', children: [{ type: 'text', value: 'Speedrun' }] }],
  };
  const tree = run([heading, para('word '.repeat(400))]);
  const speedrunHeading = tree.children.find((n) => n.type === 'heading');
  const injected = speedrunHeading.children.at(-1);
  assert.equal(injected.type, 'html');
  assert.equal(injected.value, '<span class="reading-time">2 min</span>');
});
