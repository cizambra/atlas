---
type: razor
title: Cost of delay
sidebar_position: 21
family: Delivery and operations
defines: [cost of delay, CD3]
sources:
  - "Donald Reinertsen, The Principles of Product Development Flow (2009)"
  - "Joshua Arnold, Black Swan Farming — cost of delay in practice (2013–)"
---

## Statement

Price a week of lateness and prioritisation stops being an argument about opinions.

## In plain terms

**Cost of delay** is what it costs to have something a week later than you could. Putting a number
on it — even a rough one — converts prioritisation from a contest of advocacy into arithmetic, and
it routinely reverses the order teams had chosen.

## Decides

Which of several worthwhile things to do first.

## Why it holds

Most prioritisation compares value, which is only half the equation. Two features worth £100k each
are not equally urgent if one loses £10k a week while it waits and the other loses nothing —
and value-only ranking cannot see that difference.

**CD3** — cost of delay divided by duration — is the sequencing rule that follows. Doing the
highest cost-of-delay per unit of time first minimises total delay cost across the whole portfolio,
which is a mathematical result rather than a preference.

The consequence is frequently counterintuitive. A small item with moderate urgency outranks a large
item with high urgency, because it clears quickly and stops accruing — so the "most important"
thing is often not the thing to do first.

The delay profiles also differ in shape, and the shape matters more than the magnitude. Some costs
are linear — a week late is a week of lost revenue. Some are a step function — a compliance deadline
where being one day late costs everything and two weeks early costs nothing. Some decay — a seasonal
opportunity that is worthless after Christmas.

And Reinertsen's central observation is that most organisations have no estimate at all. Not a bad
one — none — which means every prioritisation argument is conducted without the variable that should
decide it.

## Example

Three projects compete for a quarter, and the argument has run for two weeks.

The compliance report is legally required by 1 March. Estimated four weeks. Cost of delay is a step
function: zero until the deadline, then a fine and a licence risk — call it £500k the day it is
late.

The checkout optimisation is expected to lift conversion about 2%, worth roughly £40k a month.
Estimated six weeks. Linear cost of delay: about £10k a week, indefinitely.

The internal tooling improvement saves the support team eight hours a week. Estimated two weeks.
Linear: about £2k a week.

Ranking by value alone puts compliance first, then checkout, then tooling — which is what everyone
was arguing for. Ranking by CD3 changes the middle: tooling scores £1k per week of duration,
checkout £1.7k, compliance dominates everything near the deadline and nothing before it.

The sequence that minimises total cost is compliance timed to finish just before 1 March, checkout
started now, and tooling slotted into the gap — because the two-week item can complete inside the
slack without displacing anything.

Nothing about the projects changed. The two-week argument ended in an afternoon because the
comparison had units.

## Limits

The numbers are estimates and frequently poor ones. The response is not to abandon the method but
to use ranges and orders of magnitude — the value is in comparability, and being wrong by 30% rarely
changes a ranking.

Some costs genuinely resist quantification. Strategic option value, morale, technical foundation
work and reputational risk all have real cost-of-delay profiles and no defensible number, and
forcing one produces false precision that is worse than judgment.

And it is a sequencing tool, not a selection tool. CD3 tells you what order to do things in; it does
not tell you whether any of them is worth doing, and using it that way systematically starves work
whose benefit is diffuse.

## Source

Reinertsen developed the framework in *The Principles of Product Development Flow*, where cost of
delay is presented as the single most useful economic variable in product development and the one
most commonly absent.

Arnold's field work at Maersk and elsewhere supplied the practical evidence, including the finding
that the distribution is extremely skewed — a small number of items carry most of the cost of delay,
and teams routinely cannot identify which.
