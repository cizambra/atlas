---
type: razor
title: The pyramid principle
sidebar_position: 2
family: Communication
defines: [pyramid principle, MECE]
sources:
  - "Barbara Minto, The Pyramid Principle (1987)"
  - "Barbara Minto, The Minto Pyramid Principle: Logic in Writing, Thinking and Problem Solving (2009)"
---

## Statement

One governing claim, a few points that each independently support it, evidence beneath those.

## In plain terms

The **pyramid principle** structures a document as a hierarchy: one claim at the top, three to five
supporting points under it that each independently support the claim, and evidence under each of
those. Every level answers the question the level above provokes, which is how a reader gets a
coherent argument at whatever depth they stop at.

## Decides

How to structure any document longer than a paragraph that is making an argument.

## Why it holds

The structure follows the reader's questions. A claim provokes "why?", which the supporting points
answer; each point provokes "how do you know?", which the evidence answers. A document ordered this
way is answering questions in the order they arise, which is why it feels effortless to read.

Grouping is what makes it hold up. Minto's requirement is that supporting points be **MECE** —
mutually exclusive and collectively exhaustive — so they do not overlap and together they cover the
claim. Overlapping points feel repetitive; incomplete ones leave a hole the reader falls into.

The number matters more than it seems. Three to five is not aesthetic — it is what a reader can hold
while evaluating, and a list of nine supporting points is one nobody can weigh against the claim.

The structure also disciplines the writer. Building the pyramid forces you to state the claim
explicitly, which frequently reveals that you had several claims, or that one of your supporting
points does not actually support the thing you wrote at the top.

And it survives being cut. A reader who reads only the top has your position; one who reads two
levels has the argument; one who reads everything has the proof — all three coherent, which is what
progressive disclosure means for prose.

## Example

An argument for splitting a shared schema, structured as a pyramid.

**Claim**: we should split the schema this quarter.

Three supporting points, chosen to be non-overlapping and to cover the claim. It is the binding
constraint on delivery. It is achievable in the time available. Delaying it has a specific cost.

Under the first: lead time is nine days against a six-minute build, three teams coordinate every
release, and four releases were blocked by conflicts last quarter. Under the second: the migration
path is proven on a smaller schema, eight engineer-weeks estimated, one team can do it. Under the
third: tiered pricing requires per-tenant schema changes and slips to Q1 without this.

A reader who reads only the claim knows the position. One who reads the three points has the whole
argument in fifteen seconds and can already tell which of the three they doubt. One who reads the
evidence can check it.

The MECE test catches a common failure here. An earlier draft had four points, two of which were
"releases are slow" and "teams block each other" — the same point twice, which read as padding and
made the argument feel weaker rather than stronger.

## Limits

It is a structure for arguments, not for everything. Reference material, tutorials, narratives and
exploratory writing have other shapes, and forcing them into a pyramid produces something worse.

MECE is also easier to state than to achieve. Real supporting points overlap at the edges, and
chasing perfect mutual exclusivity produces categories designed for the framework rather than for
the reader.

And the structure can hide a weak claim behind an impressive shape. A well-built pyramid over a
premise nobody accepts is a well-organised document that fails at the first line, which is why the
governing claim deserves most of the thinking.

## Source

Minto developed the principle at McKinsey in the 1960s and 70s, training consultants to structure
recommendations, and published it in 1987. The full method covers ordering — chronological,
structural, comparative — and the [[SCQA]] introduction pattern as well as the pyramid itself.

Her stronger claim is that the structure is a thinking tool rather than a writing one: you cannot
build the pyramid until you know what you are claiming, so the difficulty of building it is
diagnostic.
