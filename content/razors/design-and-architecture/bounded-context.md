---
type: razor
title: Bounded context
sidebar_position: 11
family: Design and architecture
defines: [bounded context, ubiquitous language, context map]
sources:
  - "Eric Evans, Domain-Driven Design (2003)"
  - "Vaughn Vernon, Implementing Domain-Driven Design (2013)"
---

## Statement

The same word means different things to different teams; draw the boundary where the meaning
changes.

## In plain terms

A **bounded context** is the region within which a term has one consistent meaning. "Customer"
means something different to billing, to support and to marketing — different attributes, different
lifecycle, different rules. Trying to build one shared Customer model across all three produces an
object that satisfies nobody and couples everything.

## Decides

Where to draw a service or module boundary, and whether two things called by the same name are the
same thing.

## Why it holds

A model is only coherent within a context. Billing's customer has a payment method, a tax
jurisdiction and a billing cycle; support's customer has a contact history, a satisfaction score
and an entitlement level. Both are correct, and neither is a subset of the other.

The unified model is what fails. Merging them produces an object with forty fields, most of which
are null in any given use, plus rules that are conditional on which team is asking — and every
change to it requires agreement from all three.

**Ubiquitous language** is the mechanism inside the boundary: within a context, the code, the
conversations and the documents all use the same words with the same meanings, which removes the
translation layer that otherwise sits invisibly between domain experts and engineers.

Between contexts you need translation rather than sharing. A **context map** records how contexts
relate — which is upstream, which conforms, where an anti-corruption layer converts one model to
the other — and making that explicit is what stops one context's vocabulary leaking into another's.

The practical detection rule: when two teams argue at length about what a word means, they are in
different contexts, and the argument is a boundary trying to become visible.

## Example

A company builds a shared Customer service so there is one source of truth.

Two years later it has 60 fields. Billing needs `taxId` and `billingCycle`; support needs
`escalationTier`; marketing needs `consentFlags` and `segment`. Any given consumer uses about eight
of the sixty, and the other fifty-two are null or irrelevant.

The costs are structural. A field addition requires three teams to agree. The lifecycle rules
conflict — marketing considers a lead a customer, billing does not until a payment method exists,
and support does not until there is an entitlement — so the status field has nine values encoding
three different state machines.

The bounded-context version gives each team its own model with its own Customer. They share an
identifier and nothing else, and a small translation layer maps between them where they genuinely
interact.

That is more code and less coupling. Billing changes its customer model without asking anyone, the
lifecycle rules stop conflicting because they were never the same lifecycle, and the word "customer"
means one thing inside each boundary instead of three things everywhere.

## Limits

Boundaries have a cost, and drawing too many produces a distributed system where a simple question
requires four calls. The unit is a genuine difference in meaning, not a team or a table.

Duplication across contexts is also intentional and frequently resisted. Two Customer models with
overlapping fields look like a violation of DRY, and they are not — they are two models of
different things that happen to share a name.

And the boundary is discovered rather than designed. Evans is explicit that contexts emerge from
the language people actually use, so drawing them from an architecture diagram before talking to
domain experts produces boundaries in the wrong places.

## Source

Evans introduced the concept in *Domain-Driven Design*, as one of the strategic patterns — the part
of the book concerned with large-scale structure rather than with entities and value objects.

Vernon's later treatment is more practical about implementation, particularly on how bounded
contexts map onto service boundaries, which is the question most teams actually arrive with.
