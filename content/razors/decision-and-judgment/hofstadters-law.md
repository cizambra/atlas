---
type: razor
title: Hofstadter's Law
sidebar_position: 21
family: Decision and judgment
defines: [Hofstadter's Law, planning fallacy, reference class forecasting]
sources:
  - "Douglas Hofstadter, Gödel, Escher, Bach (1979)"
  - "Daniel Kahneman and Amos Tversky, 'Intuitive Prediction' (1979) — the planning fallacy"
  - "Bent Flyvbjerg, reference class forecasting research (2006–)"
---

## Statement

It always takes longer than you expect, even when you account for Hofstadter's Law.

## In plain terms

**Hofstadter's Law** is a joke with a real finding inside it. Estimates are systematically
optimistic, and knowing that does not fix them — people who consciously pad their estimates still
run over. The bias is not in the arithmetic, it is in what gets imagined, and adding a multiplier
to an incomplete picture does not complete it.

## Decides

How much to trust an estimate, including your own, and what to do instead.

## Why it holds

Estimation works by imagining the work, and imagination produces the path where things go
according to plan. The specific problems that cause overruns are unknown at estimation time — that
is what makes them problems — so they cannot be in the mental simulation.

Kahneman and Tversky named this the **planning fallacy**, and its distinguishing feature is that it
survives experience. People who have overrun on ten projects estimate the eleventh optimistically,
because they estimate from the inside view: the specifics of this project, which look tractable.

The self-referential clause is the honest part. Padding does not fix it, because the padding is
applied to a picture that is missing categories of work rather than quantities — integration
surprises, the awkward caller, the dependency that changes, the person who leaves.

What does work is the outside view. **Reference class forecasting** ignores the details entirely
and asks how long similar things have actually taken, which captures the unimaginable problems
because they happened in the reference data whether or not anyone can name them.

## Example

A team estimates a migration at six weeks. The estimate is careful, built bottom-up from tasks,
and reviewed. Someone applies a 1.5× buffer for safety, giving nine.

It takes seventeen. The overrun is not in any estimated task: two callers turned out to have
undocumented behaviour, the reporting team's job was discovered in month two, a dependency
released a breaking change, and one of the three engineers was pulled onto an incident for three
weeks.

None of those was imaginable during estimation, and none of them is fixed by a 1.5× multiplier
applied to a list that does not contain them.

The outside view was available and unused. This team's last four projects were estimated at 6, 4,
8 and 5 weeks and took 14, 9, 20 and 11 — a consistent ratio of about 2.4×. Applied to six weeks
that gives fourteen, which is a much better forecast than nine and required no insight into this
project at all.

## Limits

It is a claim about the direction of error, not a licence to multiply arbitrarily. An estimate
inflated far enough is unfalsifiable and [[Parkinson's Law]] will then consume the padding, which
produces the overrun it was meant to prevent.

Reference class forecasting needs a reference class. For genuinely novel work there is no history
to draw on, and the honest response is a range with the uncertainty stated rather than a number
with a multiplier.

And it is sometimes used to excuse poor planning. "It always takes longer" is true and is not a
reason to skip the decomposition — the outside view corrects a bias in a careful estimate, and
does nothing for a careless one.

## Source

Hofstadter states the law in *Gödel, Escher, Bach*, in a discussion of how long it takes computers
to solve problems people expected to be easy — chess programs in particular. The self-reference is
the point: it belongs to a book about strange loops, and it is one.

The empirical backing came separately. Kahneman and Tversky described the planning fallacy in
1979, and Flyvbjerg's later work on large infrastructure projects both confirmed the scale of the
bias and established reference class forecasting as the correction that actually works.
