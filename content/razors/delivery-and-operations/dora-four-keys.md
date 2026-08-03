---
type: razor
title: The DORA four keys
sidebar_position: 3
family: Delivery and operations
defines: [four keys, deploy frequency, lead time for changes, change failure rate, time to restore]
sources:
  - "Nicole Forsgren, Jez Humble and Gene Kim, Accelerate (2018)"
  - "Google, DORA State of DevOps reports (2014–)"
---

## Statement

Deploy frequency, lead time, change failure rate and time to restore predict performance better
than anything teams usually track.

## In plain terms

The **four keys** are two speed measures and two stability measures. **Deploy frequency** and
**lead time for changes** say how fast you ship; **change failure rate** and **time to restore**
say how well. The finding that made them famous is that high performers are better at all four —
the speed-versus-stability tradeoff people assume is there does not appear in the data.

## Decides

What to measure about an engineering organisation's delivery, when almost everything else is a
vanity metric.

## Why it holds

The pairing is what makes them hard to game, and it is the design rather than an accident. Deploy
frequency alone is trivially inflated by shipping noise; change failure rate alone is optimised by
shipping nothing. Moving one without the other shows up immediately in its partner.

They are also outcome measures rather than activity measures. Story points, velocity, lines and
ticket counts describe what a team did; the four keys describe what actually reaches production and
what happens when it does — which is the thing anyone cares about.

The empirical claim is the part that changed practice. *Accelerate*'s survey work found the four
correlate with organisational performance, and that elite performers score well on speed and
stability simultaneously — so the assumed tradeoff is a symptom of poor practice rather than a law.

And they are diagnostic. A long lead time with a low failure rate points at process — approvals,
batching, waiting. A high failure rate with frequent deploys points at testing and rollout. The
combination tells you where to look, which a single number cannot.

## Example

A team is asked to demonstrate that it is improving. The available numbers are velocity, story
points delivered and tickets closed, all of which rose 30% last year while everyone agrees the team
is slower.

Measuring the four keys gives a different picture:

- deploy frequency: once every two weeks
- lead time from merge to production: nine days
- change failure rate: 18%
- time to restore: four hours on average

The diagnosis is in the shape rather than any single figure. Nine days of lead time against a
six-minute build says the delay is process — a release train, a change-approval board and a manual
QA gate — not engineering speed.

The high failure rate follows from the same cause. Two-week batches mean each release contains
forty changes, so when one breaks, identifying which is slow and rolling back reverts everything.

The intervention that moves all four is one change: smaller, more frequent releases. Deploy
frequency rises, lead time falls, and because each release contains one change rather than forty,
both failure rate and restore time fall with it — which is the correlation the research describes,
visible in one team.

## Limits

They measure delivery, not value. A team can score elite on all four while shipping features nobody
wants, and the keys have nothing to say about that.

They also apply unevenly. Firmware, embedded systems, regulated deployments and anything with a
physical release cycle cannot deploy daily, and holding them to the same targets is a category
error.

And [[Goodhart's Law]] applies as soon as they become targets rather than diagnostics. Deploy
frequency as a bonus metric produces empty deploys; the pairing constrains the gaming but does not
eliminate it, which is why a [[health metric]] outside the set is still worth having.

## Source

The measures come from the DORA research programme, running annual State of DevOps surveys since
2014 with tens of thousands of respondents, and *Accelerate* is where the methodology and the
statistical case are set out.

Later reports added a fifth measure — reliability, or operational performance — reflecting that the
original four say nothing about whether the service is actually meeting its objectives once
deployed.
