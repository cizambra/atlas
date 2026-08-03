---
type: razor
title: The ladder of inference
sidebar_position: 7
family: Communication
defines: [ladder of inference]
sources:
  - "Chris Argyris, Overcoming Organizational Defenses (1990)"
  - "Peter Senge, The Fifth Discipline Fieldbook (1994) — the widely used version"
---

## Statement

You climb from data to conclusion in one step and forget the climb — disagreements are usually about
rungs, not conclusions.

## In plain terms

The **ladder of inference** describes the steps between observing something and acting on it: you
select some data, add meaning, make assumptions, draw conclusions, form beliefs, and act. The climb
is automatic and invisible, so two people who saw the same thing can hold opposite conclusions and
argue about the top rung.

## Decides

Where to look when two reasonable people disagree and neither is moving.

## Why it holds

The rungs are where the divergence happens and the conclusion is where the argument happens, which
is why the argument does not converge.

Selection is the first and most invisible rung. Two people watching the same meeting notice
different things — one registers that the proposal had no rollback plan, the other that the author
was interrupted twice — and everything after that is built on different data.

Interpretation is next and is where most of the damage is. "They did not respond to my message" is
data; "they are ignoring this" is meaning added to it, and it feels like an observation.

The reflexive loop is Argyris' addition and the reason the ladder is sticky. Beliefs formed at the
top change what data you select at the bottom, so each climb reinforces itself and the two people
diverge further with every cycle.

The practical move is to climb down out loud. "Here is what I noticed, here is what I took it to
mean, here is what I concluded" makes the rungs inspectable — and it very frequently turns out that
agreement holds until rung two, which is a much smaller disagreement than the one being had.

## Example

Two engineers disagree about whether a service is ready to launch. Three conversations produce the
same two positions.

Climbing down finds the divergence almost immediately. A selected the load-test results and the
error-budget policy; B selected the two incidents in the dependent service last month and the fact
that the runbook is unfinished. Different data, both real, neither mentioned.

At the interpretation rung they diverge again. A read "load tests pass at 3× projected traffic" as
evidence of headroom; B read the same number as evidence that nobody has tested the failure path,
because passing under load says nothing about behaviour when the dependency is down.

Their conclusions — ready, not ready — are downstream of both differences, and arguing about
readiness could not have surfaced either.

Once stated, the resolution is small. They agree the load result is real and that the failure path is
untested, which is not a disagreement about launching at all — it is a missing game day, which takes
an afternoon.

## Limits

Climbing down takes time and social permission. In a hostile discussion, "let me explain how I got
here" reads as condescension, and the technique works best where both parties have already agreed
to examine reasoning rather than defend positions.

It also does not resolve genuine value differences. Two people who select the same data, interpret
it identically, and weight risk differently have a disagreement the ladder will locate and cannot
settle — which is a decider's job.

And the model is a description rather than a mechanism. There is no evidence that cognition works in
six discrete rungs; the value is entirely in the vocabulary it gives for asking where two accounts
diverged.

## Source

Argyris developed the ladder as part of his work on organisational learning and defensive routines,
where the central problem is that people act on private inferences they never state and cannot
therefore be corrected on.

Senge's *Fifth Discipline Fieldbook* popularised the version most people know, alongside the related
practice of [[advocacy and inquiry|balancing advocacy with inquiry]] — stating your reasoning and
asking for theirs, which is the ladder used in both directions.
