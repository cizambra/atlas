---
type: razor
title: Advocacy and inquiry
sidebar_position: 8
family: Communication
defines: [advocacy and inquiry]
sources:
  - "Chris Argyris, Overcoming Organizational Defenses (1990)"
  - "Peter Senge, The Fifth Discipline (1990) and the Fieldbook (1994)"
---

## Statement

State your reasoning and ask for theirs; pure advocacy produces winners rather than decisions.

## In plain terms

**Advocacy and inquiry** are the two things you can do in a disagreement. Advocacy is arguing for
your position; inquiry is investigating theirs. Most technical discussions are advocacy on both
sides, which produces a winner — and a winner is not the same as an answer.

## Decides

How to conduct a disagreement so that the outcome is decided by information rather than by
persistence.

## Why it holds

Pure advocacy has no mechanism for changing anyone's mind. Both parties state positions with
increasing force, neither learns what the other knows, and the outcome is decided by seniority,
stamina or volume.

Pure inquiry has the opposite failure. Someone who only asks questions never puts their own
reasoning on the table, which means it cannot be examined — and it reads as either evasive or as
interrogation.

The combination is what makes reasoning inspectable in both directions. "Here is what I think and
why — what am I missing?" exposes your own [[ladder of inference]] and asks for theirs, which is the
only move that can locate where two accounts diverge.

Argyris' finding is that people espouse this and do not do it. Asked how they handle disagreement,
managers describe balanced inquiry; observed, they advocate and treat questions as rhetorical — and
the gap is invisible to them, which is why it persists.

The practical form is specific. Advocate by stating the reasoning rather than the conclusion: not
"we should use a queue" but "I think a queue, because I expect the downstream to be unavailable
several times a quarter and I do not want to lose writes." That is a claim someone can engage with.

Then inquire genuinely: "what would make that wrong?" and "what are you seeing that I am not?" —
asked to get an answer rather than to set up a rebuttal, which listeners can reliably tell apart.

## Example

Two engineers disagree about introducing a queue between two services. Three meetings, same two
positions.

The advocacy version is what happened. A argues coupling is a risk; B argues the operational
overhead is real and nobody there has run the component. Each round is a stronger restatement, and
by the third meeting both are more certain and no new information has entered.

The combined version starts differently. A states the reasoning rather than the position: "I expect
the downstream to be unavailable a few times a quarter, and a synchronous call means we lose those
writes. That is what I am protecting against."

Then inquires: "what is the strongest case against?" B answers with something A did not have — the
downstream has a 99.95% record over eighteen months, and the two outages both took the upstream
down anyway, so there would have been nothing to queue.

B then advocates with reasoning: "my concern is that a queue adds a component nobody here can debug
at 3am, and the failure mode is silent." A did not have that either.

Neither position won. What emerged was that the real question is measurable — how often is the
downstream independently unavailable — and it takes an afternoon to answer.

## Limits

It is slower than advocacy, and not every disagreement deserves it. For a reversible decision, one
person deciding quickly beats a careful mutual inquiry that costs an hour.

It also requires both parties to participate. Genuine inquiry against someone doing pure advocacy is
a losing position — you expose your reasoning and get restatement — and at that point the honest
move is to name the pattern or to escalate.

And it can become a performance. "I am curious about your thinking" asked by someone who has already
decided is transparent, and it costs more trust than plain advocacy would have.

## Source

Argyris developed the distinction through decades of observing how organisations avoid learning, and
his central finding is the gap between espoused theory and theory-in-use — people believe they
balance the two and do not.

Senge brought it into wider circulation through *The Fifth Discipline*, where it sits alongside the
ladder of inference as a pair of tools for making private reasoning public.
