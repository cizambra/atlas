---
type: razor
title: Campbell's Law
sidebar_position: 15
family: Decision and judgment
defines: [Campbell's Law]
sources:
  - "Donald T. Campbell, 'Assessing the Impact of Planned Social Change' (1976)"
  - "Charles Goodhart (1975) — the same effect, independently, in monetary policy"
---

## Statement

The more a social indicator is used for decisions, the more it distorts the process it was meant
to monitor.

## In plain terms

**Campbell's Law** is the social-science twin of [[Goodhart's Law]], and it adds a specific claim:
the corruption scales with how much weight the indicator carries. A number that decides a bonus
distorts more than a number on a dashboard, and a number that decides whether a school stays open
distorts more than either.

## Decides

How much weight to attach to a quantitative indicator, given how much distortion you are willing
to accept.

## Why it holds

The mechanism is the same as Goodhart's — people optimise the measured proxy rather than the goal
— and Campbell's addition is that the pressure is proportional to the stakes.

That gives you a dial rather than a binary. The same metric can be a useful signal when it is
informational, a mildly distorted one when it appears in a review, and worthless when it decides
funding. Nothing about the metric changed; the weight did.

The corruption also has two distinct forms and they are worth separating. **Effort redirection** is
people genuinely working on the measured thing at the expense of the unmeasured thing, which is
legitimate behaviour producing an illegitimate outcome. **Direct manipulation** is altering the
number without altering the work, which is rarer and appears as the stakes rise.

## Example

A support organisation tracks first-response time. Initially it appears only on a team dashboard
and is used to spot staffing gaps, and it tracks the thing it stands for reasonably well.

It is then added to team reviews. Response times improve, and a pattern appears: agents send a
short acknowledgement immediately, stopping the clock, and begin working on the ticket afterwards.
Effort redirection — reasonable behaviour, and the metric now measures acknowledgement speed
rather than responsiveness.

It is then tied to a quarterly bonus. Now tickets are being reclassified on arrival to categories
with looser targets, and a small number are being closed and reopened to reset the clock. The
number improves further and its relationship to customer experience is gone entirely.

The same metric passed through three states without changing definition. What changed was how much
depended on it, which is exactly Campbell's claim.

## Limits

Like Goodhart's, it is not an argument against measurement. It is an argument for matching the
weight to the metric's manipulability, and for keeping some indicators deliberately
consequence-free so they stay honest.

It applies to social indicators, where the measured entities can respond. A metric measuring
something with no agency — disk usage, request latency under fixed load — does not corrupt in this
way, and treating all metrics as equally vulnerable is its own error.

And a corrupted metric is not always useless. It may still be a valid measure of the thing people
are now doing, which is information — as long as nobody continues to read it as a measure of the
original goal.

## Source

Campbell stated it in 1976 while working on the evaluation of social programmes, in a paper about
what happens to indicators used for administrative decision-making. His examples were educational
testing, crime statistics and social-programme evaluation, and the schooling case has proved the
most durable illustration.

Goodhart had described the same effect independently the previous year in a monetary-policy
context, which is why the two names attach to what is essentially one observation.
