---
type: razor
title: Separation of concerns
sidebar_position: 2
family: Design and architecture
defines: [separation of concerns]
sources:
  - "Edsger W. Dijkstra, 'On the role of scientific thought' (1974)"
---

## Statement

Study one aspect at a time, so each can be reasoned about without holding the others in your head.

## In plain terms

**Separation of concerns** is a claim about human capacity rather than about elegance. You can hold
a limited amount in your head at once, so a design where correctness, performance and persistence
are tangled together forces you to reason about all three simultaneously — and nobody can.
Separating them lets you be wrong about one at a time.

## Decides

Where to draw a boundary inside a component, and whether a piece of code is doing too much.

## Why it holds

Dijkstra's argument is explicitly cognitive. He describes focusing on one aspect while temporarily
ignoring the others — not because the others do not matter, but because attending to several
simultaneously exceeds what a mind can do reliably.

The consequence is about verification. A function that decides business logic, formats output and
writes to a database cannot be checked for correctness without also reasoning about formatting and
persistence, so every review of it is three reviews done badly at once.

It also determines what a change costs. Concerns that are separated can change independently: a new
output format touches the formatting concern and nothing else. Concerns that are tangled mean every
change is a change to everything, and the blast radius of a small edit is the whole component.

The test that makes it concrete: can you describe what this unit does in one sentence with no
"and"? If the sentence needs an "and", it holds two concerns, and each of them will be harder to
reason about than it would be alone.

## Example

An order-processing function validates the order, calculates tax, applies a discount, writes to the
database, sends a confirmation email and returns a formatted response. Two hundred lines, and it
works.

Changing the tax calculation requires understanding all six. The test for it needs a database and a
mail server. A bug in the discount logic can only be reproduced by constructing a full order and
running the whole path.

Separated, each concern becomes checkable alone. Tax calculation is a pure function of an order and
a jurisdiction, tested in microseconds with no infrastructure. The persistence concern is tested
against a database with a trivial calculation. The email is tested by asserting it was requested.

The behaviour is identical and the code is longer. What changed is that a tax rule change is now a
ten-line diff in one file that a reviewer can verify without holding the other five concerns in
mind — which is exactly the capacity Dijkstra was talking about.

## Limits

Separation has a cost, and beyond some point it inverts. A change that touches six files across
four layers is harder to follow than one that touches a single cohesive function, and codebases
over-separated into thin layers are genuinely worse to work in.

The right unit is a concern, not a size. Splitting a function because it is long, rather than
because it holds two ideas, produces fragments that are individually small and collectively
incomprehensible.

And some things belong together. Cohesion is the other half of the principle: code that changes for
the same reason should live in the same place, and separating it into different modules is the same
mistake pointed the other way.

## Source

Dijkstra coined the phrase in a 1974 essay, describing it as focusing on one aspect at a time —
"it is what I sometimes have called 'the separation of concerns'" — and explicitly framing it as the
only available technique for ordering one's thoughts effectively.

His caution is worth quoting alongside it: separating concerns does not mean ignoring the others,
only that from the point of view of one, the others are temporarily irrelevant.
