---
type: razor
title: Metcalfe's Law
sidebar_position: 22
family: Laws of systems
defines: [Metcalfe's Law, network effect]
sources:
  - "Robert Metcalfe, presented from 1980; popularised by George Gilder (1993)"
  - "Bob Briscoe, Andrew Odlyzko and Benjamin Tilly, 'Metcalfe's Law is Wrong' (2006)"
---

## Statement

A network's value grows with the square of its nodes, which is why the second user is worth more
than the first.

## In plain terms

**Metcalfe's Law** says the value of a network scales with the number of possible connections
rather than the number of members. Ten users can form 45 pairs; twenty can form 190. That
superlinear growth is why **network effects** produce winner-take-most markets and why an empty
product is worth almost nothing regardless of quality.

## Decides

How to think about adoption for anything whose value depends on other people using it.

## Why it holds

The arithmetic is the connection count. A network of *n* nodes has `n(n−1)/2` possible pairs, which
grows as n², so each new member adds value proportional to the existing membership rather than a
fixed amount.

The consequences are asymmetric and they matter more than the formula. Below some threshold the
network is worth less than the effort of joining, so growth stalls — the cold-start problem is a
mathematical property, not a marketing failure.

Above the threshold, growth becomes self-reinforcing: more members make it more valuable, which
attracts more members. That is why these markets concentrate, and why a technically superior
product routinely loses to an established one.

The engineering translation is about switching costs. Any system with network properties — a shared
schema, an internal platform, a message format — becomes progressively harder to replace as
adoption grows, which is why the decision to standardise on one is much more consequential than it
looks on the day it is made.

## Example

An internal team builds a service catalogue: every service registers its owner, dependencies and
runbook.

With four services registered it is worth nothing. Nobody looks things up in it because the answer
is usually not there, so nobody registers, which is the cold start in its pure form.

The team seeds it — they register the eighty services themselves, from deploy metadata, badly and
incompletely. Now a lookup usually succeeds, so people start using it, and the incorrect entries
get corrected by the teams who own them because a wrong entry is now visible.

At eighty services the value is not twenty times the value at four. It is qualitatively different:
the catalogue can answer questions no individual entry could, like who depends on this service, and
those answers are what made it worth maintaining.

The other half arrives two years later, when someone proposes replacing it. It is now the source of
truth for four other systems, and the switching cost is the network rather than the code.

## Limits

The n² claim is almost certainly wrong as stated. Briscoe, Odlyzko and Tilly argue for `n log n`,
on the grounds that not all connections are equally valuable — most people care about a small
number of others, and value per potential connection falls sharply.

The distinction matters for the conclusions people draw. Under n², merging two networks always
produces a large windfall and dominance is near-inevitable; under `n log n`, both effects are much
weaker, and the paper was written partly to explain valuations of the dot-com era.

Negative network effects also exist and are omitted from the law entirely. Congestion, spam, noise
and moderation cost all grow with size, and past some point additional members reduce value —
which is the same shape as [[Universal Scalability Law|retrograde scaling]].

## Source

Metcalfe, co-inventor of Ethernet, presented the argument from around 1980 to sell network cards:
the cost of a network grows linearly with nodes while its value grows quadratically, so there is a
crossover point past which buying more is obviously correct.

George Gilder named it Metcalfe's Law in 1993, and Metcalfe himself has since said the formulation
was intended as a heuristic for a sales pitch rather than a precise claim.
