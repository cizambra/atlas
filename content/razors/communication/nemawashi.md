---
type: razor
title: Nemawashi
sidebar_position: 9
family: Communication
defines: [nemawashi]
sources:
  - "Toyota Production System; Jeffrey Liker, The Toyota Way (2004)"
  - "Tanya Reilly, The Staff Engineer's Path (2022) — the engineering application"
---

## Statement

Socialise a decision one-to-one before the meeting, so the meeting confirms rather than discovers.

## In plain terms

**Nemawashi** is Japanese for preparing a tree's roots before transplanting it. As a practice it
means talking to each person who matters individually, before the decision meeting — so objections
are raised, answered and incorporated in private, and the meeting ratifies something people have
already shaped.

## Decides

Whether to bring a proposal to a group cold, or to talk to people first.

## Why it holds

The failure it prevents is about public position-taking rather than about the idea. Someone hearing
a proposal for the first time in a group must respond with no time to think, and the safe public
response to an unfamiliar proposal is caution — which, once stated, is expensive to abandon.

The individual conversation removes all of that. They can ask the naive question, raise the
objection that turns out to be wrong, and change their mind at no cost, because nobody is watching.

The part that distinguishes it from lobbying is that the proposal changes. Nemawashi is not counting
votes — if you leave five conversations with the same proposal you went in with, you were selling.
The version that arrives at the meeting should visibly contain what people told you.

That is also why it produces better decisions rather than merely smoother ones. The objections you
collect in private are the ones that would have surfaced during implementation, and collecting them
early is the cheapest possible time.

The order matters: start with the people most likely to disagree. Their objections shape the
proposal, and arriving at the sceptic last with a finished position is how you get a public fight.

## Example

A proposal to split a shared database goes to an architecture review.

Cold, it takes forty minutes and decides nothing. The data platform lead asks a question nobody can
answer, publicly, and now holds a public position. The meeting ends with "let's take this offline",
which means the real conversation has not happened yet and was not with anyone in the room.

The nemawashi version runs three conversations first. The data platform lead raises the reporting
team's nightly job, which reads across all four tables — so the proposal changes: reporting gets a
read replica in phase one rather than phase three.

An engineer with no title but a long memory says a version of this was attempted in 2022 and
stalled. The proposal gains a ratchet and a named owner for the tail.

The VP is last, and arrives already knowing that the two people they trust are satisfied.

The meeting takes twelve minutes. The data platform lead explains the reporting phase — because it
is their contribution — which means they are advocating rather than approving, and that is a
different level of support when the project gets difficult in month four.

## Limits

It has a manipulative version and the difference is whether the proposal actually changes.
Pre-wiring to neutralise opposition rather than to incorporate it is politics, people can tell, and
it works once.

It also costs time. Five conversations before a meeting is most of a day, which is not proportionate
for a decision that could be made in the room by three people.

And it can exclude. Someone not on the list of pre-conversations discovers a formed consensus in the
meeting, which is exactly the position nemawashi exists to spare people — so who you talk to is
itself a decision with fairness consequences.

## Source

Nemawashi is one of the principles Liker documents in *The Toyota Way*, where the fuller version is
*nemawashi* for consensus-building followed by rapid implementation — slow to decide, fast to
execute, on the argument that time spent building agreement is recovered in the absence of
resistance afterwards.

The engineering literature has converged on the same practice under the name pre-wiring, and
Reilly's treatment is the clearest on why it is a staff-level habit rather than a political one.
