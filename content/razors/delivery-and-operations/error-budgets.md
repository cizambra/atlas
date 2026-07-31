---
type: razor
title: Error budgets
family: Delivery and operations
defines: [error budget, SLO, SLI]
sources:
  - "Betsy Beyer et al., Site Reliability Engineering (Google, 2016), ch. 3"
  - "Google SRE Workbook (2018) — implementing SLOs"
---

## Statement

100% is the wrong reliability target; choose a number below it and spend the difference
on shipping.

## In plain terms

Chasing perfect uptime costs more than it is worth, and it quietly stops you shipping. So pick
the amount of failure you can live with, say one request in a thousand, and treat it as money
to spend. While you are under budget you ship freely. When you run out, you stop and fix.

## Decides

Whether the team ships the next feature or stops to stabilise — without that being an
argument between the people who like shipping and the people who like sleeping.

## Why it holds

Reliability past a point is invisible. A user on mobile data experiences more failure
from their own network than from a service running at 99.9%, so the difference between
99.9% and 99.99% never reaches them.

It is also not linearly priced. Each additional nine costs roughly an order of magnitude
more — redundancy, review, on-call load, slower change — and buys an improvement the
user cannot detect.

The budget's real work is procedural rather than technical. "Are we reliable enough to
ship?" is a values question, and values questions are settled by whoever is most
senior in the room. Converting it to "have we spent 43 minutes this month?" makes it a
fact, and facts can be checked by anyone.

## Example

An **SLO** of 99.9% monthly availability allows $0.001 \times 30 \times 24 \times 60
\approx 43$ minutes of unavailability. That is the budget.

Week two, a bad deploy burns 31 of those minutes. The policy — agreed in advance, in
writing, when nobody was upset — says a burn above 70% freezes feature launches until
the month resets, and the team spends the remainder on the deploy pipeline that let it
through.

Nobody argued. The number was set before the incident, which is the only time such a
number can be set honestly.

## Limits

The SLO has to come from what users actually experience, not from what the system
currently achieves. An SLO reverse-engineered from last quarter's uptime measures your
history and licenses whatever you were already doing.

The budget is worthless if the freeze is ever overridden. One executive exception
teaches the organisation that the number is decorative, and after that a burnt budget
produces a conversation rather than a consequence — which is exactly the state the
mechanism existed to escape.

It also does not fit every service. A payment ledger or a medical device is not a place
to argue that some failure is affordable, and stretching the framing there is how the
idea gets a bad name.

## Source

Google's *Site Reliability Engineering* (2016), chapter 3, is the canonical statement,
including the argument that 100% is the wrong target because users cannot distinguish it
from 99.999%. The *SRE Workbook* (2018) covers the harder part: choosing indicators
(**SLIs**) that track what users feel rather than what is easy to measure.
