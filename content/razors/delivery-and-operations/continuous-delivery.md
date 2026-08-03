---
type: razor
title: Continuous delivery
sidebar_position: 4
family: Delivery and operations
defines: [continuous delivery, deployment pipeline, batch size]
sources:
  - "Jez Humble and David Farley, Continuous Delivery (2010)"
  - "Nicole Forsgren, Jez Humble and Gene Kim, Accelerate (2018)"
---

## Statement

Keep the software releasable at all times; batching changes makes each release riskier, not safer.

## In plain terms

**Continuous delivery** means the main branch is always in a shippable state and releasing is a
business decision rather than an engineering project. The counterintuitive part is the risk claim:
teams batch changes to feel safe, and batching is what makes releases dangerous.

## Decides

Whether to release small changes continuously or accumulate them into scheduled releases.

## Why it holds

**Batch size** is the variable that drives everything else. A release containing one change has one
possible cause when it breaks; a release containing forty has forty, and identifying which is a
search rather than a lookup.

Rollback follows the same arithmetic. Reverting a single change is precise; reverting a batch
reverts thirty-nine changes that were fine, which is why teams under pressure fix forward instead —
and fixing forward during an incident is how a small failure becomes a long one.

The risk per release also does not fall with frequency, so total exposure is roughly constant while
the *cost of any single failure* falls sharply. Twenty small releases and one large one carry
similar aggregate risk, distributed very differently.

The **deployment pipeline** is what makes it possible: every commit builds, tests and produces a
deployable artifact automatically, so "releasable" is a verified property rather than an opinion.
Without it, continuous delivery is a slogan.

The practices that follow are the actual work — comprehensive automated tests, trunk-based
development, decoupling deploy from release, and the ability to roll back quickly — and each is
independently useful.

## Example

A team releases every two weeks, deliberately, on the reasoning that fewer releases mean fewer
opportunities to break production.

A release goes out containing 43 merged changes. Error rates rise 20 minutes later, and the
investigation begins with 43 candidates. Nobody wants to roll back, because reverting would undo
42 changes that are fine — including a fix another team is waiting on.

So they fix forward, under pressure, at 6pm. The eventual cause is a config change in the
eleventh commit, found after two hours.

The continuous version releases each change as it merges. The same config change goes out alone,
error rates rise, and the correlation is unambiguous because nothing else shipped in that window.
Rollback is one revert affecting one change, and it takes four minutes.

The change was equally broken in both worlds. What differed was that one world could identify and
undo it, and the other could not — which is entirely a function of batch size.

## Limits

It requires investment that does not exist by default. Comprehensive automated tests, a reliable
pipeline, fast rollback and good observability are prerequisites, and continuous delivery without
them is continuous breakage.

Some contexts genuinely cannot. Regulated releases with external approval, mobile applications
subject to app-store review, on-premise software shipped to customers, and embedded firmware all
have release constraints that are not negotiable by engineering.

The useful distinction there is between delivery and deployment. Keeping the software continuously
*releasable* is achievable almost anywhere; whether you choose to release it that often is a
separate decision, and the discipline is in the first half.

## Source

Humble and Farley's 2010 book is the definitive treatment, and the deployment pipeline is its
central artifact — a sequence of automated stages that a change must pass, each providing more
confidence than the last.

*Accelerate* later supplied the empirical support, finding that continuous delivery practices
predict both delivery performance and organisational performance, and that the speed-safety tradeoff
teams assume does not appear in the data.
