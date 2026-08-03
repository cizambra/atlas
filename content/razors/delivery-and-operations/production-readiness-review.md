---
type: razor
title: Production readiness review
sidebar_position: 14
family: Delivery and operations
defines: [production readiness review, operational contract]
sources:
  - "Google SRE Book, 'Evolving SRE Engagement' — the PRR model (2016)"
  - "Google SRE Workbook (2018)"
---

## Statement

A service earns the right to page you: runbooks, alerts, dashboards, and an owner, before it takes
traffic.

## In plain terms

A **production readiness review** is a checklist a service passes before it is allowed to serve real
traffic. Not a quality gate on the code — an **operational contract** covering whether anyone can
run it: is it monitored, is there a runbook, does it have an owner, can it be rolled back.

## Decides

What a service must have before it goes live, and what it means for a platform or SRE team to take
one on.

## Why it holds

The work being checked for is the work that never gets prioritised. Runbooks, alerts, dashboards
and rollback procedures have no user-visible value, so they lose every prioritisation conversation —
right up until the first incident, when their absence is what makes it long.

A gate at launch is the one moment the leverage exists. Before traffic, "this needs a runbook" is a
condition of shipping; after traffic, it is a request competing with features, and it loses.

The contract framing is what makes it fair rather than bureaucratic. If another team is going to
carry the pager, they are entitled to specify what makes the service operable — and if the owning
team carries it themselves, the checklist is protecting their own nights.

The items that recur across every version of this are few: an owner, alerts tied to user-visible
symptoms, a dashboard someone can read at 3am, a runbook tested by someone who did not write it, a
rollback that works, documented dependencies and their failure behaviour, and a capacity estimate.

And it has a second effect worth naming: the review surfaces design problems. A service that cannot
be rolled back, or whose failure mode is unbounded, usually reveals that during the readiness
conversation rather than during the incident.

## Example

A new recommendation service is a week from launch. The code is reviewed, tested and performant.

The readiness review finds seven gaps, none of them about the code:

- no alert on error rate, only on host CPU
- a dashboard showing JVM metrics and no request metrics
- a runbook that is a page titled "TODO"
- no defined owner after the launch team disbands
- a rollback requiring a manual database step nobody has run
- two dependencies with no timeout
- no estimate of what happens at three times projected traffic

Every one of these is half a day's work, and every one becomes a multi-hour incident if it is
missing when something breaks.

The rollback gap is the one that changes the design. Investigating it reveals that the service
writes to a shared table in a format the previous version cannot read — so a rollback would corrupt
data, which is a design problem that a launch checklist happened to catch.

The launch slips a week. The alternative was launching with an untested rollback into a schema
change, which is the shape of most bad nights.

## Limits

It becomes a bureaucracy if it is not maintained. A checklist that grows every time something goes
wrong reaches forty items, most of which do not apply, and teams start treating it as paperwork —
at which point it is a delay rather than a control.

It is also a gate, with the latency gates always carry. For a small internal service with three
users, a full review is disproportionate, and a tiered version — full review for user-facing
services, a short one otherwise — is what keeps it credible.

And passing it is not a permanent property. A service reviewed two years ago has changed, its
dependencies have changed, and its runbook has rotted — which is why the practice needs periodic
re-review rather than a one-time stamp.

## Source

The PRR is Google SRE's engagement model: SRE teams take on services conditionally, and the review
is the negotiation of what operability means before they accept the pager.

The SRE Workbook adds the practical detail, including the observation that the review's greatest
value is frequently the design conversation it forces rather than the checklist items themselves.
