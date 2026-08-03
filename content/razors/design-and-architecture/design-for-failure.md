---
type: razor
title: Design for failure
sidebar_position: 16
family: Design and architecture
defines: [design for failure, failure domain]
sources:
  - "Werner Vogels, Amazon CTO — 'everything fails all the time' (2008)"
  - "Google SRE Book (2016)"
  - "Netflix Chaos Engineering / Chaos Monkey (2011–)"
---

## Statement

Everything fails all the time — so ask what happens when this dependency is down, not whether it
will be.

## In plain terms

**Design for failure** replaces one question with another. Not "how do we prevent this failing" but
"what does the system do while it is failing". At any real scale, some component is always broken,
so availability is a property of how gracefully the rest behaves rather than of nothing going
wrong.

## Decides

What to build around every call to something you do not control.

## Why it holds

The arithmetic forces it. A service depending on five components, each 99.9% available, is at
99.5% if all five are required — and adding more dependencies makes it worse, so at scale the
question of whether something is down is settled: something always is.

The reframing changes what gets built. "Will this fail?" produces effort spent on prevention;
"what happens when it fails?" produces timeouts, fallbacks, circuit breakers, degraded modes and
bounded **failure domains** — which is what actually determines the user's experience.

Failure domains are the structural half. A design where one saturated connection pool takes down
the whole process has one domain; one where each dependency has its own bounded pool has several,
and a failure is contained rather than total.

And the failure paths have to be exercised, because untested error handling is not error handling.
This is the argument underneath chaos engineering: failures injected deliberately, during working
hours, are how you find out whether the fallback works before the night it is needed.

## Example

A product page calls six services: catalogue, pricing, inventory, reviews, recommendations and
personalisation.

The prevention-oriented version treats each as reliable, calls them in sequence with default
timeouts, and renders when all six return. It works perfectly in staging.

In production the recommendation service degrades to four-second responses under load. Every
product page now takes four seconds, the web tier's threads are all waiting, and the whole site is
down — because of a component that contributes a sidebar nobody needs.

The failure-designed version asks what each dependency's absence means. Catalogue and pricing are
required, so a failure there is an error page. Inventory failing degrades to "check availability at
checkout". Reviews, recommendations and personalisation are optional, so each gets a short timeout
and renders nothing on failure.

Each also gets its own connection pool, so a saturated one cannot exhaust the others. The same
recommendation degradation now produces a page missing one sidebar, and nobody notices — which is
the entire difference, and none of it required the recommendation service to be more reliable.

## Limits

Every mitigation has a cost. Timeouts, retries, circuit breakers, bulkheads and fallbacks are all
machinery to build, test and reason about, and applying all of them to every call produces a system
where the resilience logic outweighs the logic it protects.

The right investment is proportional to consequence. A call to a payment provider deserves careful
handling; a call to an internal metrics endpoint deserves a timeout and nothing else.

Fallbacks also fail in ways that are worse than failing. Serving stale prices, an outdated
entitlement or a cached permission can be far worse than an error page, and "degrade gracefully" has
to be decided per case rather than assumed.

And untested failure paths give false confidence. A circuit breaker nobody has ever triggered is a
hypothesis, which is why deliberate failure injection is part of the razor rather than an optional
extra.

## Source

Vogels' formulation — "everything fails all the time" — comes from Amazon's experience running
services at a scale where component failure is continuous rather than exceptional, and it is the
design premise underneath much of AWS's service model.

Netflix's Chaos Monkey made the testing half concrete by terminating production instances at random
during working hours, on the argument that a system which cannot survive a scheduled failure will
not survive an unscheduled one.
