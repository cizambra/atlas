---
type: razor
title: SCQA
sidebar_position: 3
family: Communication
defines: [SCQA, the complication]
sources:
  - "Barbara Minto, The Pyramid Principle (1987)"
---

## Statement

Situation, complication, question, answer — four sentences that make a reader want the
recommendation before you give it.

## In plain terms

**SCQA** is Minto's opening pattern: state the **situation** the reader already agrees with, name
**the complication** that disturbs it, and that raises a **question** which your document answers.
Four sentences, and the reader arrives at your recommendation already wanting one.

## Decides

How to open a document so the reader cares about the answer before reading it.

## Why it holds

The pattern works by manufacturing a question the reader is holding. A recommendation offered to
someone with no question is an interruption; the same recommendation offered to someone who has just
formulated the question is an answer.

Starting from agreement is what makes it safe. The situation is deliberately uncontroversial — facts
the reader already accepts — so the opening cannot be argued with, and the reader is aligned before
anything contested appears.

**The complication** is the whole engine. It is the change, the problem or the tension that makes
the situation no longer stable — and it is what converts a static description into something
demanding a response.

The question is usually implicit, which is a feature. A well-constructed situation and complication
produce exactly one obvious question in the reader's mind, and writing it out is optional; what
matters is that the reader has it.

It also disciplines scope. If your document answers a different question from the one your
complication raises, that mismatch is visible in four sentences rather than discovered by a confused
reader on page three.

## Example

An opening for the same schema-split argument, built as SCQA.

**Situation**: "We ship releases every two weeks, and the release process requires three teams to
coordinate." Uncontested — everyone knows this.

**Complication**: "Tiered pricing is committed for Q4, and it requires per-tenant schema changes
that all three teams would have to agree on for every deploy."

**Question**, unstated and unavoidable: how do we ship tiered pricing without the release process
making it impossible?

**Answer**: "Split the schema this quarter — eight engineer-weeks, ahead of the observability work."

The reader arrives at the recommendation holding the question it answers. Compare the same content
opened as "I would like to propose splitting our shared database schema", which is a proposal
arriving at someone with no reason to want one.

The complication is also doing diagnostic work. Drafting it forces the question of why *now* — and a
document whose complication is weak is usually a document proposing something real that has no
urgency, which is worth knowing before sending it.

## Limits

It is an opening pattern, not a document structure. SCQA gets the reader to the question; the
[[pyramid principle]] structures the answer, and a document that is only SCQA has an excellent first
paragraph.

It can also feel manufactured when the complication is thin. Constructing artificial tension to make
a routine update feel urgent is transparent, and readers discount the next one.

And it assumes a shared situation. Where the reader does not already accept the opening facts, the
pattern breaks at the first sentence — and establishing the situation becomes the document's real
work.

## Source

Minto developed SCQA as the introduction pattern within the pyramid method, on the argument that
the top of the pyramid needs a reason to be read — the pyramid organises the answer, and SCQA
establishes that there is a question.

The variants she describes are worth knowing: leading with the situation for a neutral audience, with
the complication for an urgent one, and with the answer for a reader who already has the question —
which is [[bottom line up front|BLUF]].
