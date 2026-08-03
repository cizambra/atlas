---
type: razor
title: Brooks's Law
sidebar_position: 7
family: Laws of systems
defines: [Brooks's Law, communication paths, ramp-up cost]
sources:
  - "Fred Brooks, The Mythical Man-Month (1975)"
---

## Statement

Adding people to a late project makes it later, because communication paths grow faster than hands
do.

## In plain terms

**Brooks's Law** is the observation that people and months are not interchangeable. New people
have to be brought up to speed by the people who were already productive, and every additional
person adds coordination that everyone pays. On a late project, both costs land immediately and
the benefit arrives later, if at all.

## Decides

Whether adding people to a project that is behind will help.

## Why it holds

Two costs are paid up front. **Ramp-up cost** is the time existing engineers spend teaching rather
than building, which removes capacity exactly when it is scarcest. A new person on a non-trivial
system is net negative for weeks.

**Communication paths** grow quadratically. A team of *n* has `n(n−1)/2` pairs, so going from four
people to eight takes the pairs from six to twenty-eight. Coordination overhead grows with the
pairs while output grows with the people, and past some size the second cannot keep up.

The third factor is partitionability. Some work divides cleanly and some does not, and the tasks
remaining on a late project are disproportionately the ones that do not — the integration, the
awkward dependency, the part only one person understands. Brooks's illustration is that nine women
cannot produce a baby in one month.

The combination is what makes it a law rather than a caution: the costs are certain and immediate,
the benefit is uncertain and delayed, and on a late project there is no time for the delay.

## Example

A migration is four weeks from its date and about eight weeks of work remains. Three engineers are
added from another team.

The first two weeks are net negative. The three original engineers spend roughly half their time
explaining the schema, the migration tooling and the reasons behind decisions made months ago, so
effective capacity drops from three to about two.

Coordination grows immediately. Six people means fifteen communication pairs where there were
three, a daily sync appears, and decisions that took a conversation now take a thread.

By week four the new engineers are genuinely productive and the project is further behind than it
would have been. It finishes in week eleven — and the counterfactual, unstaffed, was about week
nine.

The version that would have worked is different in kind: cut scope, or add the people to a *later*
phase where the ramp-up has time to pay back.

## Limits

It is specifically about late projects and non-partitionable work. Adding people early, to work
that divides cleanly, is ordinary and effective — the law is not an argument against growing
teams.

The ramp-up cost is also not fixed. Good onboarding, a [[paved road]], documentation and a
well-structured codebase can shrink it substantially, and a team that has invested there is much
less subject to the law than one that has not.

And some work genuinely does partition. Independent bug fixes, separate services, parallel test
writing — where the coordination requirement is genuinely low, adding people works, and the honest
question is which category the remaining work is in.

## Source

Brooks formulated it in *The Mythical Man-Month*, drawing on managing the IBM OS/360 development —
one of the largest software projects of its era and one that ran famously late.

The book's central argument is broader than the law: that the man-month is a fiction as a unit of
work, because it assumes people and time are interchangeable, and they are only interchangeable
when tasks require no communication.
