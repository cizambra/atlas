---
type: razor
title: Grice's maxims
sidebar_position: 6
family: Communication
defines: [Grice's maxims, cooperative principle]
sources:
  - "Paul Grice, 'Logic and Conversation' (1975)"
---

## Statement

Be as informative as needed, truthful, relevant and clear — most bad writing violates exactly one of
the four.

## In plain terms

**Grice's maxims** describe what people assume you are doing when you communicate: giving the right
amount of information, telling the truth, staying relevant, and being clear. They are descriptive
rather than prescriptive — and their diagnostic value is that most unclear writing breaks one of
them specifically, which tells you what to fix.

## Decides

What is actually wrong with a piece of writing that is technically correct and does not work.

## Why it holds

Grice's underlying claim is the **cooperative principle**: conversation works because both parties
assume the other is trying to be understood. The maxims are what that assumption unpacks into.

**Quantity** — as informative as required, and no more. Violated in both directions: the document
that omits the step everyone needs, and the one that includes forty pages because omitting anything
felt risky.

**Quality** — do not say what you believe false, or what you lack evidence for. In technical writing
this is mostly about unmarked confidence: stating an estimate as a fact, or an inference as an
observation.

**Relation** — be relevant. The most commonly violated in engineering writing, because the material
that was hard-won feels important, and relevance is judged from the reader's task rather than the
writer's effort.

**Manner** — be clear, brief and orderly, avoid ambiguity. Jargon, unmarked acronyms, sentences with
two ideas, and structure that follows the investigation rather than the argument.

The value is in the specificity. "This document is unclear" is not actionable; "this violates
quantity — you have included the whole investigation when the reader needs the conclusion" tells the
writer exactly what to do.

## Example

A design document is returned by three reviewers with the comment that it is hard to follow. The
author cannot tell what to change.

Running the maxims produces four distinct diagnoses rather than one vague one.

Quantity: pages three to seven cover four alternatives that were rejected in the first hour. The
reader needs to know they were considered and why, in a paragraph — not the full analysis.

Quality: "this approach will scale to 10,000 requests per second" is stated as fact and is an
extrapolation from a single benchmark. Marking it as an estimate with its basis is a one-line change
that also makes it defensible.

Relation: two pages on the history of the current system's design. Interesting, and it does not
bear on the decision being asked for.

Manner: fourteen unexplained acronyms, and a section whose heading is "Considerations" containing
three unrelated things.

Four specific edits rather than a rewrite, and each one is checkable by the person who made it.

## Limits

They are descriptive linguistics rather than a writing method. Grice was explaining how implicature
works — how people infer meaning from apparent violations — not issuing style advice, and the maxims
are frequently flouted on purpose to good effect.

They are also not independent. Removing irrelevant material improves manner; being clearer usually
reduces quantity — so the four overlap in practice and "which maxim" is sometimes an unhelpful
question.

And they say nothing about structure at scale. A document can satisfy all four sentence by sentence
and still be badly organised, which is what the [[pyramid principle]] is for.

## Source

Grice presented the maxims in his 1967 William James lectures, published as "Logic and Conversation"
in 1975, as part of an account of how listeners derive meaning beyond what is literally said.

His interest was in *flouting* — a deliberate, obvious violation signals additional meaning, which
is how irony and understatement work. The use of the maxims as a writing checklist is a later
appropriation, and a productive one.
