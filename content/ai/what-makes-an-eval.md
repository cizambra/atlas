---
type: concept
title: What makes something an eval
section: ai
group: Evaluation
summary: An eval is a measurement you would be willing to be wrong about in public.
razors: []
next: []
---

## The model

An eval measures how well a system does a task: you run it over a set of example
inputs and score the outputs. The result is a rate over that set — 82% of answers cited
the right document — not a pass or fail on any one case.

That makes it an estimate, not a fact. Measure the same system on a different 200
examples and the number moves. Everything else about evals follows from that one
property.

## Decide it

You are choosing between four things: eyeballing a few outputs, a deterministic test,
online monitoring, and a real offline eval.

1. **How many times will you change this system?** Once — spot-check a dozen outputs
   and ship. Repeatedly — build the eval, because its cost is paid once and saved on
   every later change.
2. **Is the output right-or-wrong, or better-or-worse?** A fixed correct answer is a
   test, and a test is cheaper. Only better-or-worse needs a rate over a sample.
3. **Would a bad output show up in production, and can you afford to let it?** Visible
   in metrics and cheap to roll back — monitor online instead. Invisible in aggregate,
   or expensive once shipped — you need to catch it before release.

## Why it's true

### When it is worth building one

An eval is a fixed cost paid up front — collecting the sample, defining the outcome,
scoring it once by hand — against a variable saving on every change that follows. One
change does not repay it. Twenty do.

That is why the honest first question is how many times you will touch the system.
Teams build elaborate evals for something they ship once, then skip them for the
component they will be tuning every week.

The third alternative is not testing less, it is testing later. If a bad output appears
in production metrics within a day and rolling back is cheap, online monitoring catches
the same problem for a fraction of the work. Offline evals earn their place when the
failure is invisible in aggregate or expensive to have shipped at all.

One filter before any of that: name the decision the number will change. If a move from
78% to 84% would not cause you to do anything differently, you are building a
dashboard, not an eval.

### An eval is not a test

A test asserts a fixed correct answer and fails when it is not there. An eval estimates
a rate over a population, which means it carries sampling error and has to be large
enough to separate a real change from noise.

That difference has a sharp practical edge. A 20-item eval that moves from 14 to 16 has
told you almost nothing, and teams ship on exactly that evidence constantly.

### Why a bad golden set is worse than none

An unrepresentative sample does not leave you ignorant. It leaves you confident and
wrong, which is strictly worse — with no number at all you would have been more careful.

The usual mechanism is mundane. The golden set gets built from examples that were easy
to collect, which skews it toward questions somebody already thought of, and the system
then gets tuned against a distribution nobody actually sends.

### Agreement is the ceiling

If two careful people disagree about whether an answer was correct, the task carries
irreducible ambiguity, and no judge — human or model — can be more right than that
ambiguity allows.

So measure agreement before trusting any judge. It tells you the ceiling on the metric,
and an unexpected disagreement rate usually means the rubric is underspecified rather
than that the annotators were careless.

### And then Goodhart

Once the eval becomes the target it stops being a good measure. That is Goodhart's Law,
and it applies here with full force, because optimizing against a fixed set is exactly
what the work looks like. The defense is a held-out set nobody tunes against.

## Worked example

A retrieval-augmented support assistant. The population is real support questions, so
the set is sampled from logs by frequency rather than hand-picked — 200 items, weighted
so common questions appear about as often as they truly do.

The outcome is deliberately narrow: did the answer come from the right document? A
person can score that in ten seconds, which matters more than it sounds, because an
outcome nobody can afford to score does not get scored.

Two annotators label the same 50 items before anything else happens. They agree on 43.
That 86% is the ceiling — a judge scoring above it is not more accurate, it is
reproducing one annotator's bias.

Only now is the eval usable, and it answers a real decision: chunk size 512 versus
1024. If the gap is three items out of 200, that sits inside the noise, and the honest
report is "no detected difference" rather than "1024 wins."

## Next

Building a golden set, LLM-as-judge, and calibrating a judge against humans are the
three pages that expand this one — the first on sampling, the second on automating the
score, the third on knowing when to believe it.
