---
type: razor
title: Disagree and commit
sidebar_position: 12
family: Decision and judgment
defines: [commit after losing]
sources:
  - "Andy Grove, High Output Management (1983) — Intel's constructive confrontation"
  - "Jeff Bezos, Amazon shareholder letter (2016)"
  - "Scott McNealy, Sun Microsystems — an early use of the phrase"
---

## Statement

Argue hard before the decision, then execute as if you had won the argument.

## In plain terms

Disagreement is how groups avoid bad decisions, and endless disagreement is how they avoid making
any. The rule separates the two phases: argue as strongly as you can while it is open, and once it
closes, **commit after losing** — build the thing you argued against, properly, without
relitigating it in side channels.

## Decides

What to do after a decision goes against you.

## Why it holds

A decision implemented half-heartedly by people who disagreed with it fails for reasons that have
nothing to do with whether it was right. Which means the organisation learns nothing: the outcome
was determined by the execution, so it cannot be evidence about the choice.

The rule also removes the incentive to win by attrition. Without a defined close, the most
persistent objector decides everything, and that selects for stamina rather than for judgment.

It has a precondition that is frequently dropped, and dropping it is what turns the phrase into a
weapon. The disagreement has to have been genuinely heard and answered first — a team told to
disagree and commit without having been listened to learns that the phrase means "stop talking",
and the next decision gets silence instead of input.

The test for whether it was real: the person who lost should be able to state the reasoning that
beat them. If they cannot, they were overruled rather than persuaded, and the commitment will not
survive the first difficulty.

## Example

A team argues for two weeks about whether to use a queue between two services. One senior engineer
is strongly against — the operational overhead is real and nobody there has run the component in
production.

The decision goes the other way. The argument was heard, answered in writing, and closed by a
named owner.

The failing version is what happens next in most organisations. The engineer builds it, mentions
in three separate conversations that it was not their idea, and when a queue incident happens in
month two, says so again. The incident is now evidence about the decision — except the design was
under-invested from the start, so it is evidence about nothing.

The version that works is the same engineer building it as though they had argued for it: the
monitoring is thorough, the runbook exists, the failure modes they predicted are the ones they
guard against. If it still fails, that is real information — and their prediction is now worth
much more next time.

## Limits

It does not apply to decisions that are unsafe, unethical or outside the decider's authority.
Committing is a professional norm about ordinary technical disagreement, not an obligation to
implement something you believe is harmful.

It also assumes the decision was actually closed by someone with standing to close it. Where no
owner exists and the "decision" is one person's assumption, there is nothing to commit to and the
correct move is to establish the owner.

And it should not silence new evidence. Committing means not relitigating the same argument; it
does not mean staying quiet when something genuinely new appears, and confusing those two is how
organisations ride bad decisions past the point anyone could tell.

## Source

The practice predates the phrase. Grove's Intel ran on "constructive confrontation" — argue
vigorously, decide, then support the decision fully — and describes it in *High Output Management*
as the mechanism that lets a company be both contentious and fast.

Bezos gave the phrase its current currency in the 2016 Amazon shareholder letter, with an example
of himself committing to a decision he disagreed with rather than escalating it, and the
observation that this saves an enormous amount of time on decisions that would otherwise stall.
