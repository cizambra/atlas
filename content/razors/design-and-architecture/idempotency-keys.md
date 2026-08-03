---
type: razor
title: Idempotency keys
sidebar_position: 18
family: Design and architecture
defines: [exactly-once processing]
sources:
  - "Stripe API design and engineering blog (2014–)"
  - "Nathan Marz and others on exactly-once delivery being unachievable (2012–)"
  - "Tyler Treat, 'You Cannot Have Exactly-Once Delivery' (2015)"
---

## Statement

Exactly-once delivery does not exist; make the operation safe to repeat and at-least-once becomes
enough.

## In plain terms

[[exactly-once|Exactly-once]] delivery is impossible over an unreliable network — the sender cannot
distinguish a lost request from a lost response, so it must either retry (risking duplicates) or
not (risking loss). An [[idempotency key]] sidesteps it: the caller supplies a unique token, the
receiver records it, and a repeat with the same key returns the original result.

## Decides

What to do about retries on any operation with a side effect.

## Why it holds

The impossibility is fundamental rather than an engineering gap. A client that times out has two
indistinguishable possibilities: the request never arrived, or it arrived and the response was
lost. No amount of protocol design resolves it, because the information required is on the other
side of the failure.

That leaves two honest choices. [[at-most-once|At-most-once]] — do not retry — loses work.
[[at-least-once|At-least-once]] — retry — duplicates it. Duplicates are the better failure to
have, because they are fixable at the receiver, and loss is not.

Idempotency is what makes them fixable. If processing the same request twice has the same effect as
processing it once, at-least-once delivery becomes indistinguishable from **exactly-once
processing** — which is what anyone actually wanted.

The key has to come from the caller, which is the part people get wrong. Deduplicating on a hash of
the request body breaks legitimate identical requests — two genuine £10 charges to the same card
look alike — so the caller generates a unique token per intended operation and reuses it across
retries of that operation.

## Example

A payment endpoint charges a card. A client sends the request, the network drops the response after
the charge succeeded, and the client retries.

Without a key, the customer is charged twice. The retry is correct behaviour by a client that
cannot know what happened, and the endpoint has no way to tell it apart from a second genuine
purchase.

With an idempotency key, the client generates a UUID when the user clicks Pay and sends it with
every attempt. The server stores the key with the result before responding.

The retry arrives, the server finds the key, and returns the stored response without charging
again. From the client's perspective the operation happened exactly once, which is what mattered.

Two details decide whether it actually works. The key must be recorded in the same transaction as
the effect, or a crash between them reopens the window. And in-flight duplicates need handling —
a second request arriving while the first is still processing should wait or return a conflict,
rather than proceeding in parallel.

## Limits

Not everything can be made idempotent cheaply. Operations that are inherently incremental —
appending to a log, incrementing a counter, sending an email — need explicit dedup state, and that
state has a size and a retention question attached.

The keys also have to expire, which reopens the window. A 24-hour retention is typical, and a retry
arriving on day three will duplicate — usually acceptable, and it should be a decision rather than
a surprise.

And storing the key is a write, so the endpoint now has a durability requirement it did not have
before. In a distributed system that store must be consistent with the effect, which can be the
hardest part of the whole design.

## Source

Stripe popularised the pattern as a first-class API feature, with a client-supplied
`Idempotency-Key` header, published semantics and a documented retention window — an approach now
copied across most payment and infrastructure APIs.

The theoretical half is older and well established: exactly-once *delivery* is impossible, while
exactly-once *processing* is achievable through idempotency or transactional deduplication, and
conflating the two is the source of most of the confusion in the area.
