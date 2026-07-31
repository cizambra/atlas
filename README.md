# Atlas

A reference on AI engineering, technical interviews, staff engineering and
communication.

    npm install
    npm run lint      # the content contract — 16 rules, no Docusaurus involved
    npm test          # unit tests for the lint and the three remark plugins
    npm start         # generate + dev server
    npm run build     # generate + lint + static build into build/

## How it fits together

`content/` is plain markdown. Every page conforms to a block contract — six
fixed `##` sections for a concept page, six different ones for a razor —
enforced by `npm run lint`, which reads markdown and frontmatter only and
imports nothing from Docusaurus.

That independence is deliberate. The site generator is replaceable; the
discipline that makes the pages worth reading is not. `tools/` holds the lint
and the generator for the derived pages; `plugins/` holds three remark
transforms that turn frontmatter and `[[term]]` markers into page furniture.

Three pages are generated rather than authored, and are gitignored:
`content/index.md`, `content/glossary.md`, `content/razors/index.md`. Run
`npm run generate` to rebuild them; `start` and `build` do it for you.

## Conventions worth knowing before you edit

- **`tools/`, not `build/`.** Docusaurus owns `build/` as its output directory.
  Putting our source there once cost us a deleted lint.
- **No `"type": "module"` in `package.json`.** Docusaurus breaks in the browser
  with `require is not defined` if it is present. Every source file is `.mjs`,
  which is ESM regardless.
- **Display maths needs `$$` on their own lines.** `remark-math` reads a
  single-line `$$x$$` as inline.
- **`stylesheets` and `scripts` in the config are emitted verbatim.** They are
  the only asset paths Docusaurus does not prefix with baseUrl. Import CSS from
  `src/css/custom.css` instead, so webpack owns the URL — a missing stylesheet
  fails silently, leaving correct markup with no styling.
- **`[[term]]`** links to whichever page declares that term in `defines:`. An
  undefined term fails the lint with a file and line.

See `test/fixtures/` for what a valid page looks like.

Design: `~/docs/superpowers/specs/2026-07-28-learning-atlas-design.md`
Migration: `~/docs/superpowers/specs/2026-07-29-atlas-docusaurus-migration-design.md`
