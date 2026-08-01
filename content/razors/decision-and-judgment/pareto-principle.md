---
type: razor
title: The Pareto principle
sidebar_position: 3
family: Decision and judgment
defines: [Pareto principle, the vital few]
sources:
  - "Vilfredo Pareto, Cours d'économie politique (1896–97) — the observation about land ownership"
  - "Joseph M. Juran, Quality Control Handbook (1951) — named it, and coined 'the vital few and the trivial many'"
  - "Joseph M. Juran, 'The Non-Pareto Principle: Mea Culpa' (1975) — his own correction of the attribution"
---

## Statement

Roughly 80% of the effect comes from 20% of the causes — find that 20% before optimising anything.

## In plain terms

The **Pareto principle** says effects are almost never spread evenly across their causes. A few of
them do most of the work, and the rest barely matter. So the useful first move is not to work
harder on everything — it is to find the few that count, which usually takes an afternoon of
measuring rather than a week of guessing.

## Decides

Where to spend effort when you cannot spend it everywhere — which bugs to fix, which endpoints to
optimise, which customers to talk to, which part of a system to rewrite.

## Why it holds

Most real distributions are skewed rather than flat. Traffic concentrates on a few endpoints,
crashes concentrate in a few code paths, revenue concentrates in a few accounts, and support load
concentrates in a few issues. Nothing arranges this deliberately; it is what happens when many
small independent factors compound.

The consequence is that effort spread evenly is mostly wasted. If a fifth of the causes produce
four fifths of the effect, then working uniformly across all of them puts 80% of your effort where
20% of the outcome is.

The reason this is a razor rather than a statistic is what it tells you to do *first*. Before
optimising, measure the distribution. That is usually cheap, it is usually skipped, and it usually
changes what you would have worked on.

The numbers are not the point, and treating them as exact is the most common misreading. It is
sometimes 90/10 and sometimes 60/30 — what matters is that it is rarely 50/50, and that you can
find out which it is.

## Example

A team gets a mandate to improve API latency and starts with the endpoints they know are slow.

Someone measures first instead. Of 340 endpoints, six account for 78% of total request time — and
two of the six are internal health checks running far more often than anyone realised. Fixing those
two is a day of work, and it removes a third of the total load.

The endpoint the team was about to optimise turns out to be the eleventh-largest contributor. It is
genuinely slow, it is called forty times a day, and improving it by half would have moved the
overall number by a rounding error.

The afternoon of measurement is what separated a day of work that mattered from a fortnight that
would not have. Nobody on the team was wrong about which endpoints were slow; they were wrong about
which slowness added up to anything.

## Limits

It describes a common shape, not a law. Plenty of distributions are close to uniform, and asserting
80/20 without measuring is exactly the guessing the razor exists to replace.

It says nothing about the *remaining* 80% of causes, and some of them cannot be ignored. A rare
failure that is catastrophic, a small customer with a strategic contract, an edge case with legal
consequences — these are in the tail and still have to be handled. The principle allocates
optimisation effort, not obligations.

It also does not compose indefinitely. "Apply it again to the top 20%" sounds neat and frequently
finds nothing, because within the vital few the distribution is often much flatter.

And it can be gamed against you when it becomes a target, in the manner of [[Goodhart's Law]]: a
team measured on "fix the top 20%" will define the categories so that the easy work lands inside
them.

## Source

Vilfredo Pareto observed in the 1890s that about 80% of land in Italy was owned by about 20% of the
population, and found similar skews elsewhere. He did not propose it as a general principle.

Joseph Juran did, in the 1951 *Quality Control Handbook*, applying it to quality defects and
naming it after Pareto — a phrase he coined alongside the more careful "the vital few and the
trivial many". Juran later wrote a paper conceding the attribution was his own error: the
underlying idea was Pareto's, but the generalisation was Juran's, and he had given the credit away.
