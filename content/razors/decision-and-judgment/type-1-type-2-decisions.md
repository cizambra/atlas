---
type: razor
title: Type 1 / Type 2 decisions
family: Decision and judgment
defines: [Type 1 decision, Type 2 decision, one-way door]
sources:
  - "Jeff Bezos, Amazon shareholder letter (2015)"
  - "Jeff Bezos, Amazon shareholder letter (1997) — the long-term framing"
---

## Statement

One-way doors deserve deliberation; two-way doors deserve speed — and most doors are
two-way.

## Decides

How much process a decision gets: who is consulted, how long it takes, and what evidence
is required before someone can act.

## Why it holds

The cost of being wrong differs by orders of magnitude between a reversible decision and
an irreversible one. A **Type 2 decision** you can walk back costs the time spent
walking back. A **Type 1 decision** you cannot costs whatever the wrong world costs, for
as long as you live in it.

Organisations tend to run one process for both, and it is always the heavy one, because
the heavy process is what everyone remembers being punished for skipping. So the choices
you could undo in an afternoon get committee time they never needed, and the ones you can
never take back get no more care than the rest.

Bezos's specific claim is that this gets worse with size. A large organisation defaults
to Type 1 process everywhere, which produces "slowness, unthoughtful risk aversion,
failure to experiment sufficiently" — the cost is invisible because it shows up as
things that never got tried.

## Example

Choosing a logging library is a two-way door. If it turns out badly you swap it in a
week, so the correct process is that one person picks and everyone lives with it.

Choosing how tenant identity is represented in your data model is a one-way door. Get it
wrong and the fix is a migration across every table, every query, and every integration
that has since been built on it — measured in quarters. That decision earns a written
document, named dissenters, and a week of thinking.

The failure mode is running them the other way round, which happens more often than it
sounds: the logging library gets an RFC because it is easy to have opinions about, and
the tenancy model gets decided in a standup because it felt like an implementation
detail.

## Limits

Reversibility is a spectrum, not a pair of buckets, and people systematically
overestimate where things sit on it. "We can always migrate later" is the sentence most
often said immediately before walking through a one-way door.

The usable test is to price it: what would reversing this cost in weeks, six months from
now, with the data we will have by then? If nobody can answer, treat it as Type 1 until
somebody can.

It also says nothing about which decision is right. It allocates attention, and a fast
decision on a two-way door is still a decision you have to make well enough to learn
from.

## Source

The framing appears in Amazon's 2015 shareholder letter, where Bezos distinguishes
"consequential and irreversible or nearly irreversible" Type 1 decisions from
"changeable, reversible" Type 2 ones, and argues that large organisations misapply the
Type 1 process to both.
