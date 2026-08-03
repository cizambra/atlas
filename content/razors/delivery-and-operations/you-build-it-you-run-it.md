---
type: razor
title: You build it, you run it
sidebar_position: 13
family: Delivery and operations
defines: [operational ownership, feedback loop of ownership]
sources:
  - "Werner Vogels, interview in ACM Queue (2006)"
  - "Google SRE Book (2016) — the error-budget alternative"
---

## Statement

Carrying the pager for your own code is the fastest feedback loop in software.

## In plain terms

**Operational ownership** means the team that writes a service operates it, including on-call.
The argument is about incentives: an engineer woken by their own alert at 3am learns something
about the design that no amount of review will teach, and they can act on it directly.

## Decides

Whether to separate development from operations, or to have one team do both.

## Why it holds

The **feedback loop of ownership** is direct and immediate. When the person who chose the retry
policy is the person paged by it, the retry policy improves — because the cost lands on the person
who can change it, in a form they cannot ignore.

Separating them breaks that loop in a specific way. A developer who never operates the system does
not learn what makes it operable, and an operator who cannot change the code can only mitigate. The
information and the authority end up in different people.

It also changes what gets built. Teams carrying their own pager instrument better, write runbooks
that work, build better health checks and think harder about failure modes — not from discipline,
but because the alternative is being woken up.

Vogels' framing at Amazon was that this brings developers into daily contact with the customer, and
that the contact is what raises quality. The operational half is the part that generalised.

The alternative model is not "ops takes the pager". Google's SRE arrangement is that a service can
be operated by SRE only while it stays within its [[error budget]] — and when it does not, the pager
goes back to the development team. Ownership is conditional rather than transferred, which preserves
the incentive.

## Example

Two teams ship comparable services in the same organisation.

The first hands off to a central operations team. Its alerts are copied from a template, three of
its five runbooks describe a previous version, and it has no health check distinguishing "up" from
"can serve". The operations team pages on symptoms it cannot diagnose and escalates most of them.

The second holds its own pager. After the second time someone is woken by an alert that turned out
to be a false positive, the threshold gets fixed — that week, by the person who was woken.

After being unable to diagnose an incident at 3am, they add the missing metric the next morning.
After a rollback that took twenty minutes, someone spends a day making rollback a one-command
operation, without asking anyone.

None of those improvements was scheduled or prioritised. Each was made by a person with the
information, the authority and a personal reason — which is the loop, and the first team does not
have it.

## Limits

It requires the team to be large enough to sustain a rotation. Four engineers on a 24/7 pager is
not ownership, it is attrition, and the honest answer at that size is a follow-the-sun arrangement or
a shared rotation.

Operational expertise is also a real specialism. Kernel tuning, network debugging, database
internals and capacity planning are deep skills, and "the team runs it" does not mean the team
should learn all of them — which is what makes platform and SRE roles complementary rather than
contradictory.

And it can produce the [[the hero trap|hero pattern]] at team scale, where one person becomes the
de facto responder because they are fastest. The rotation has to be real for the loop to work.

## Source

Vogels stated it in a 2006 ACM Queue interview describing Amazon's shift to service teams: "you
build it, you run it" brings developers into contact with the day-to-day operation of their
software and with customers, and that contact is a large part of the quality improvement.

Google's SRE model is the most developed alternative, and the two are less opposed than they appear
— the error-budget mechanism exists specifically to keep the incentive on the development team even
when SRE holds the pager.
