---
type: razor
title: Choose Boring Technology
section: razors
family: Delivery and operations
sources:
  - "Dan McKinley, 'Choose Boring Technology' (2015), mcfunley.com"
---

## Statement

Every team gets a small budget of innovation tokens. Spend them where the novelty is
the product, and take the boring option everywhere else.

## Decides

Whether to adopt an unfamiliar technology for a particular component — a database, a
queue, a language, a deployment target.

Reach for this razor the moment someone proposes the new thing and the argument is
about its features rather than about what it will cost you at 3am.

## Why it holds

The cost of new technology is not the learning curve. It is the set of failure modes
nobody on your team has seen yet. A mature database has a decade of people writing
down how it breaks; a new one has a landing page.

That cost is real, but it arrives late. You pay it during an incident, when the thing
behaves in a way none of your instincts predict and the documentation does not cover.

The asymmetry is what makes this a razor rather than a preference. A new technology's
benefits are visible immediately and easy to argue for in a meeting — faster writes,
nicer API, better benchmarks. Its costs are invisible, deferred, and land on whoever
is on call months later. Unaided judgment over-adopts, because the pro column is
legible and the con column is not.

An innovation token is an accounting trick for that invisible column. It stands for a
fixed amount of your team's capacity to hold unfamiliar failure modes in working
memory. You get roughly three. Spending one is fine; spending three in a quarter means
every incident is now unfamiliar territory at once.

## Example

A team is building a service that stores event timelines and needs range queries by
time. Someone proposes a purpose-built time-series database. Someone else proposes
Postgres with a BRIN index.

The time-series database is genuinely better at the query. It is also a new operational
surface: a new backup story, new failure modes, a new on-call runbook, and nobody on
the team has debugged it under load.

The token framing is what makes the decision sayable out loud. "We have two tokens left
this quarter and one is already going to the new deployment platform. This service is
plumbing for a feature, not our differentiator. Postgres until the query actually
hurts — and we will know it hurts, because we will have the latency graph."

Notice what the framing did not do. It did not claim the time-series database was worse.
It moved the argument from which technology is better to what this team can afford to
be surprised by, which is the question that was actually load-bearing.

## Limits

Boring is the wrong call when the novel thing is the product. If your differentiator is
a vector search engine, taking the boring option there means shipping a worse product
to save operational cost on the exact component customers are paying you for.

And boring is relative to your team, not to the technology's age. Kafka is boring at a
company that has run it for five years and novel at one that has not. The question is
never how old something is — it is how many people on your team have already debugged
it at 3am.

The razor also says nothing about when to pay down a boring choice that has stopped
fitting. It governs adoption, not the decision to migrate later.

## Source

Dan McKinley, "Choose Boring Technology" (2015). The innovation-token framing
originates in that essay, written from his time as a principal engineer at Etsy, and
the phrase has since become industry shorthand.
