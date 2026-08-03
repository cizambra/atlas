---
type: razor
title: Two-pizza teams
sidebar_position: 23
family: Delivery and operations
defines: [two-pizza team, coordination cost]
sources:
  - "Jeff Bezos, Amazon (late 1990s); described in Brad Stone, The Everything Store (2013)"
  - "Fred Brooks, The Mythical Man-Month (1975) — the communication-path arithmetic"
---

## Statement

If a team cannot be fed by two pizzas, its coordination cost has begun to exceed its output.

## In plain terms

The **two-pizza team** is a size heuristic — roughly six to ten people. Past that, **coordination
cost** grows faster than capacity: more people means more communication paths, more meetings, more
alignment, and eventually the marginal person adds less than they consume.

## Decides

When a team should split, and how large to make a new one.

## Why it holds

The arithmetic is [[Brooks's Law|Brooks's]] communication-path count. A team of *n* has `n(n−1)/2`
pairs — six people have fifteen, twelve have sixty-six. Output grows with people; coordination grows
with pairs, and the second eventually wins.

The consequences appear before the number gets large. Meetings grow to include everyone who might
be affected, decisions need more alignment, and the amount of context each person must hold about
what others are doing rises.

Small teams also change decision-making qualitatively. Six people can decide in a conversation;
sixteen need a process, and the process is what slows everything after it.

The size constraint only works if it comes with scope. Amazon's version paired two-pizza teams with
service ownership — each team owning a service with an API, so the coordination between teams
happened through interfaces rather than through meetings. Small teams without decoupled scope just
means more dependencies.

The related failure is splitting along the wrong lines. A twelve-person team split into two sixes
that must coordinate constantly has more coordination overhead than before, because the paths that
were internal are now cross-team.

## Example

A team grows from seven to fourteen over a year, absorbing two adjacent areas.

The symptoms are gradual. Stand-up goes from ten minutes to thirty and most of it is irrelevant to
most people. Planning takes a full day. A design decision that used to be two people at a whiteboard
now needs a meeting with eight, because it might affect any of them.

The output does not double. Measured over two quarters it is up about 30% on seven people's
baseline, and the difference has gone into coordination that did not exist before.

The naive split is by seniority or by workload — two teams of seven, work divided evenly. That makes
it worse: the two halves still touch the same services, so every change needs cross-team agreement,
and the paths that were a conversation are now a ticket.

The split that works follows the [[ownership boundary]]. One team takes the checkout service end to
end, one takes the catalogue, each with its own deploy pipeline and its own pager. The coordination
that remains is an API contract, which is a much cheaper channel than a meeting.

## Limits

The number is a heuristic and a soft one. The right size depends on the work — a team doing
well-partitioned parallel work sustains more people than one doing tightly-coupled design.

It is also frequently applied without the ownership half, which is what makes it work. Splitting
teams while leaving them dependent on the same codebase, the same database and the same release
train produces the coordination cost of a large team plus the overhead of two.

And small teams have real fragility. Six people cannot sustain a 24/7 rotation, absorb two people
leaving, or cover deep specialisms — so the constraint has to be balanced against resilience rather
than applied absolutely.

## Source

The rule comes from Amazon in the late 1990s, attributed to Bezos, and is usually reported alongside
his broader argument that communication within a company is a symptom of dysfunction rather than a
virtue — teams should need less of it, not more.

Brooks supplies the arithmetic that makes it more than a preference, and the pairing with service
ownership is what distinguishes Amazon's version from a simple headcount rule.
