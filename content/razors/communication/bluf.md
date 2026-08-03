---
type: razor
title: BLUF
sidebar_position: 1
family: Communication
defines: [BLUF, bottom line up front]
sources:
  - "US Army, Effective Writing / Army Regulation 25-50 — BLUF as staff-writing doctrine"
  - "Barbara Minto, The Pyramid Principle (1987) — the same shape, independently"
---

## Statement

Bottom line up front: the first sentence carries the conclusion and the ask.

## In plain terms

**BLUF** — **bottom line up front** — means the reader gets the answer before the reasoning. Not a preview of
what the document will cover — the actual conclusion, and what you want them to do about it.
Everything after it is support for a reader who wants to check.

## Decides

Where to put the conclusion in anything written for someone who will decide something.

## Why it holds

Readers decide at every line whether to continue, and most of them stop early. A conclusion at the
end is read by whoever finished; a conclusion at the start is read by everyone, including the person
who only had ninety seconds.

It also changes how the middle is read. A reader who knows the conclusion evaluates the evidence
against it, which is a different and much more efficient activity than accumulating evidence and
waiting to find out what it is for.

The military origin is instructive about why the doctrine exists. Staff writing goes to people with
more documents than time, in conditions where a reader may be interrupted — so a format where the
essential content survives the reader stopping is a requirement rather than a courtesy.

The ask is the half that gets dropped. "We should split the schema" is a conclusion; "we should
split the schema, and I need it in the Q4 plan ahead of the observability work" is a conclusion with
an action attached — and a document with no ask produces agreement and nothing else.

The instinct it fights is real. Writing in the order you discovered something feels honest, and it
puts the payoff where the fewest people reach it.

## Example

A document arguing for a schema split, written both ways.

The discovered order opens with background: how the system came to share a schema, what the team
investigated, what the release process looks like, what the measurements were. The recommendation is
on page four.

A director reads the first paragraph, learns that there is some history involving a database, and
files it. It comes up in a planning meeting three weeks later as "the platform team wants to do
something with the database", which is what survived.

The BLUF version opens: "I recommend funding the schema split this quarter — eight engineer-weeks.
I need it prioritised above the observability work. Without it, tiered pricing slips into Q1."

Three sentences containing the recommendation, the cost, the ask and the consequence. A reader who
stops there has everything needed to decide; a reader who continues finds the nine-day lead time,
the four blocking conflicts, and the history — now serving as evidence for a claim they already hold
rather than as a preamble to one they have not reached.

## Limits

It is wrong where the sequence is the lesson. A postmortem or a debugging write-up should build
chronologically, because the reader needs to feel the wrong turns to learn from them — putting the
cause first removes the instruction.

It is also wrong when you are asking for the framing rather than the decision. A document that opens
with a confident conclusion you have not committed to reads as false certainty, and "here is the
question I am stuck on" is the honest opening.

And a conclusion first does not license omitting the reasoning. BLUF orders the material; it does
not reduce it, and a document that is only a conclusion is an assertion.

## Source

BLUF is US military staff-writing doctrine, codified in Army writing standards, where the
requirement is that the recommendation appears in the opening sentence and the supporting material
follows in decreasing order of importance.

Minto arrived at the same structure independently at McKinsey, and the [[pyramid principle]] is the
fuller version — BLUF is what its top level looks like from the reader's side.
