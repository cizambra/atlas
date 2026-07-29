import { tokens } from './blocks.mjs';

const textOf = (page) => page.blocks.map((b) => b.text).join('\n');

const subHeadings = (page) =>
  page.blocks.flatMap((b) => [...b.text.matchAll(/^###\s+(.*?)\s*$/gm)].map((m) => m[1]));

export function buildSearchIndex(pages) {
  return {
    pages: pages.map((page) => {
      const statement = page.blocks.find((b) => b.heading === 'Statement')?.text.trim();
      return {
        slug: page.slug,
        section: page.section,
        title: page.title,
        kicker: page.type === 'razor' ? (page.family ?? '') : (page.group ?? ''),
        blurb: page.type === 'razor' ? (statement ?? '') : (page.summary ?? ''),
        headings: subHeadings(page),
        tokens: tokens(`${page.title} ${page.summary ?? ''} ${textOf(page)}`),
      };
    }),
  };
}
