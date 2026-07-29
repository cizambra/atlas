# Atlas

A static reference on AI engineering, technical interviews, and staff engineering.

    npm install
    npm run build     # content/ -> dist/, fails on any lint violation
    npm test
    npm run serve     # http://localhost:8080

Design: `~/docs/superpowers/specs/2026-07-28-learning-atlas-design.md`

Every page conforms to a block contract enforced at build time. See
`test/fixtures/` for what a valid page looks like.
