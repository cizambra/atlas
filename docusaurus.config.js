import { basename } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import remarkBlocks from './plugins/remark-blocks.mjs';
import remarkTerms from './plugins/remark-terms.mjs';
import remarkFurniture from './plugins/remark-furniture.mjs';
import { loadContent } from './build/content.mjs';
import { buildTermIndex } from './build/terms.mjs';

const { pages } = loadContent('content');
const terms = buildTermIndex(pages);
const currentSlugOf = (file) => basename(file.path ?? '', '.md');
const pagesBySlug = new Map(pages.map((p) => [p.slug, p]));
const readAsset = (rel) => {
  const file = join('static', rel);
  return existsSync(file) ? readFileSync(file, 'utf8') : null;
};

/** @type {import('@docusaurus/types').Config} */
export default {
  title: 'Atlas',
  tagline: 'AI engineering, interviews, staff engineering, communication',
  url: 'https://example.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'favicon.svg',

  // MANDATORY: Docusaurus 3 parses .md as MDX by default, which turns raw HTML
  // into a JSX parse error. 'detect' means .md is CommonMark and .mdx is MDX.
  markdown: { format: 'detect' },

  presets: [
    ['classic', {
      docs: {
        path: 'content',
        routeBasePath: '/',
        sidebarPath: './sidebars.js',
        beforeDefaultRemarkPlugins: [
          remarkBlocks,
          [remarkTerms, { terms, currentSlugOf }],
          [remarkFurniture, { pagesBySlug, readAsset }],
        ],
      },
      blog: false,
      theme: { customCss: './src/css/custom.css' },
    }],
  ],

  themeConfig: {
    navbar: {
      title: 'Atlas',
      items: [{ type: 'docSidebar', sidebarId: 'atlas', position: 'left', label: 'Sections' }],
    },
    colorMode: { respectPrefersColorScheme: true },
  },
};
