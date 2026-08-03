---
type: razor
title: The toil budget
sidebar_position: 15
family: Delivery and operations
defines: [toil, toil budget]
sources:
  - "Google SRE Book, 'Eliminating Toil' (2016)"
---

## Statement

Cap manual, repetitive, automatable work at half a team's time, or operations eats all of
engineering.

## In plain terms

**Toil** is operational work that is manual, repetitive, automatable, tactical, devoid of enduring
value, and grows with the service. Not all operations work — the specific kind that produces
nothing lasting. The **toil budget** caps it at 50%, because without a cap it expands until there is
no engineering left.

## Decides

How much operational work a team should absorb before automating it, and what to do when the cap is
exceeded.

## Why it holds

Toil grows with the service and engineering capacity does not. Twice the traffic means roughly twice
the tickets, twice the manual interventions and twice the restarts — so a team that absorbs toil
linearly hits a ceiling where it can do nothing else.

The trap is that absorbing it is always locally rational. Doing the manual step takes twenty
minutes; automating it takes two days. Every individual instance favours doing it by hand, and the
aggregate is a team that spends its year on twenty-minute tasks.

The cap forces the aggregate view. At 50%, exceeding it is a signal that triggers action rather than
a state to endure — the response is either automation, or reducing the service's operational
surface, or giving work back to the developing team.

The 50% figure is a policy choice rather than a finding, and its function is to make the tradeoff
visible. Any explicit number works; having none is what produces the drift.

Google's definition is worth keeping strict, because "toil" gets applied to all operations work and
then the cap means nothing. Design review, capacity planning and incident analysis are operational
and produce enduring value — they are not toil, and capping them would be the wrong intervention.

## Example

A platform team of six supports forty services. The work is real: access requests, certificate
rotations, quota increases, restarting a stuck job, re-running failed pipelines.

Each item takes fifteen to forty minutes, and none is hard. Nobody tracks the total, and the team's
sense is that they are busy with "support".

Measuring it for a month finds 71% of the team's time in that category. The largest single item is
access requests — 90 a month, twelve minutes each — which is one person's entire capacity, forever,
doing something a form and an approval rule could do.

The 50% cap makes that a decision rather than a condition. Automating access requests takes three
weeks and removes 18 hours a month permanently; certificate rotation takes a week and removes
another eight.

What matters is not the automation, which was always possible. It is that the cap made the
aggregate visible — at 71% the team could not have taken on a new service, and nobody had noticed,
because every individual ticket was twenty minutes.

## Limits

Some toil is not worth automating, and the arithmetic decides. A manual task taking an hour a
quarter does not justify two weeks of automation, and treating the cap as an obligation to automate
everything is worse than the toil.

Automation also has its own toil. A brittle script that fails weekly and needs manual intervention
has converted one kind of repetitive work into another, sometimes with worse failure modes.

And the 50% number is arbitrary in a way that matters. A team whose product *is* operations may
legitimately run higher, and a small team may find any cap unachievable — the useful part is
measuring and having a threshold, not the specific figure.

## Source

The concept and the cap come from Google's SRE book, where the 50% ceiling is policy: SRE teams are
expected to spend at least half their time on engineering, and exceeding the toil cap triggers work
being handed back to the developing team.

The six-part definition — manual, repetitive, automatable, tactical, without enduring value, and
scaling linearly with service growth — is the load-bearing part, because it is what stops the term
expanding to cover all operational work.
