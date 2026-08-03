---
type: razor
title: Write to decide
sidebar_position: 14
family: Communication
defines: [document type declaration]
sources:
  - "Design-doc practice at Google, Uber and Oxide Computer (2010s–)"
  - "Oxide Computer, 'RFD: Requests for Discussion' (2020)"
---

## Statement

Say which one this document is in the first line; a reader who guesses wrong reads it uselessly.

## In plain terms

A **document type declaration** is one line at the top saying what kind of document this is and what
it wants: a decision to be made, a proposal for feedback, a record of something already settled, or
information with no action. A reader who thinks they are reviewing a proposal when it is a record —
or the reverse — wastes the whole reading.

## Decides

The first line of any substantial document.

## Why it holds

The type determines how to read. A decision document should be read adversarially, looking for the
flaw before it is committed. A record should be read for comprehension, because the decision is
made. A proposal for feedback invites redesign; a settled design does not.

Guessing wrong is expensive in both directions. Reviewers who treat a settled decision as open
produce a redesign nobody wanted; reviewers who treat an open proposal as settled produce a
rubber stamp, and the objection surfaces during implementation instead.

The ambiguity is also frequently the author's. Writing "this document is asking for a decision by
Friday on whether to split the schema" forces you to know which it is, and a surprising number of
documents are unclear because their author had not decided whether they were proposing or informing.

Status is the other half of the same line. Draft, in review, accepted, superseded — because a
reader who cannot tell whether a design document describes the current system or an old proposal
will believe whichever is more convenient.

The RFD model formalises both: a numbered document with an explicit state machine, so the type and
the status are properties of the artifact rather than things a reader infers from tone.

## Example

An engineer opens a document titled "Schema Split Design".

Without a declaration, they cannot tell what is wanted. Is this a proposal to argue with, a decision
already taken that they should understand, or a record of what was built last quarter? The tone is
confident, which suggests settled — so they read for comprehension and leave no comments.

It was a proposal, and the author needed exactly their objection. It surfaces in month two as
rework.

The declared version opens: "**Type:** decision. **Status:** in review. **Asking for:** a decision by
15 October on whether to split the schema this quarter. **Decider:** Priya. **Reviewers:** the data
platform and reporting leads."

Five facts, one line each, and the reader now knows to read adversarially, that their comment
matters, and that there is a deadline.

Six months later the same document is read by someone deciding whether to merge the schemas back.
The status line says "accepted, 15 October" — so they read it as a record, and go looking for the
reasoning rather than offering an opinion on a decision that was made.

## Limits

It is a convention and needs enforcement to mean anything. A template with a type field that
everyone sets to "proposal" out of habit has added a line and no information.

Some documents genuinely span types. A design that is settled in parts and open in others needs the
declaration at section level, and a single global type flattens it misleadingly.

And a declaration does not fix a document that has not decided what it wants. The line is a forcing
function for the author's clarity, which is most of its value — but an unclear document with an
accurate "type: unclear" is still unclear.

## Source

The practice is convergent rather than attributable to one source: design-doc templates at Google,
Uber's RFC process, and similar systems all arrived at explicit type and status headers for the same
reason.

Oxide Computer's RFD process is the most fully specified public version, with a documented state
machine — ideation, discussion, published, committed, abandoned — that makes a document's standing
unambiguous at any point in its life.
