---
type: razor
title: Simple made easy
sidebar_position: 6
family: Design and architecture
defines: [simple vs easy, complecting]
sources:
  - "Rich Hickey, 'Simple Made Easy', Strange Loop (2011)"
---

## Statement

Simple means unentangled; easy means familiar. Choosing easy over simple is how systems become
impossible to change.

## In plain terms

**Simple vs easy** is a distinction most people collapse. *Simple* is objective — one role, one
task, not braided together with anything else. *Easy* is relative to you — near at hand, familiar,
quick to start with. A tool can be extremely easy and deeply complex, and adopting it because it is
easy is a decision about today at the expense of every day after.

## Decides

Whether to adopt something because it is quick to start with, or because it keeps things separate.

## Why it holds

Hickey's etymology is the argument. *Simplex* means one fold or braid; *complex* means braided
together. So complexity is not about size or difficulty — it is about how many things are
intertwined, and how many you must therefore reason about at once.

**Complecting** is his word for the act of braiding, and the point is that it is something you
choose. Every time state is tied to identity, or a policy is tied to its implementation, or a
value is tied to the time it was computed, you have complected two things and every future change
must consider both.

Easy, by contrast, is a property of your position rather than of the thing. A framework you know is
easy; the same framework is hard for a new joiner. Familiarity changes, so optimising for it
optimises a variable that will not hold.

The costs also arrive at different times, which is why the trade is systematically misjudged. Easy
pays out immediately and complexity is paid later, continuously, by everyone — and the person
choosing rarely pays most of it.

## Example

A team picks a framework that generates a working CRUD application from a schema in ten minutes.
Genuinely easy, and the first month is fast.

What it complected is invisible at the time. Validation is tied to the persistence layer, so
business rules cannot be tested without a database. Routing is tied to the class hierarchy, so
moving an endpoint means moving a file. Serialisation is tied to the domain model, so an API change
means a schema change.

Two years in, the cost is concrete. Adding a field touches four concerns because they were braided
at the start. The business rules cannot be extracted to a service because they were never separate.
Upgrading the framework is a project, because everything depends on it.

The simple alternative was slower for a month. Plain functions for validation, an explicit route
table, a mapping layer between the API and the domain — more code, no generation, and each piece
independently replaceable.

Neither choice was wrong on its own terms. The framework was easy and it was not simple, and the
team chose without noticing that those were different claims.

## Limits

Simple is not always available. Some domains genuinely braid — a distributed transaction ties
consistency, latency and failure handling together by nature — and pursuing simplicity where the
essential complexity is high produces elegant code that does not solve the problem.

Easy also has real value. Familiarity means the team is productive now, hiring is cheaper, and the
failure modes are known — which is most of the [[boring technology]] argument, and it does not
disappear because Hickey drew a distinction.

And the talk is frequently used to justify unfamiliar tools on the grounds that unfamiliarity is
merely "not easy". Sometimes true, and it is also the exact argument someone makes for a stack
nobody can operate.

## Source

Hickey delivered "Simple Made Easy" at Strange Loop in 2011, and it has become one of the most
cited talks in software design. The framing is etymological throughout: simple against complex,
easy against hard, and the claim that the industry has conflated the two axes.

His practical target was the state and identity braiding common in object-oriented programming,
which is also the argument underneath Clojure's design — the talk is a design rationale as much as
a general principle.
