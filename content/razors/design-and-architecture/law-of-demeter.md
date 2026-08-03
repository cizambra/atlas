---
type: razor
title: The Law of Demeter
sidebar_position: 3
family: Design and architecture
defines: [Law of Demeter, train wreck]
sources:
  - "Ian Holland, Northeastern University Demeter Project (1987)"
  - "Karl Lieberherr and Ian Holland, 'Assuring good style for object-oriented programs' (1989)"
---

## Statement

Talk to your immediate collaborators only; a chain of dots is a dependency on someone else's
internals.

## In plain terms

The **Law of Demeter** says a unit should only talk to things it directly knows about — its own
fields, its parameters, and objects it created. `order.customer.address.postcode` reaches through
three objects, which means your code now depends on the internal structure of all three, and any of
them can break you by reorganising.

## Decides

Whether a chained call is acceptable or should be replaced by asking the immediate collaborator.

## Why it holds

Each dot in a chain is a coupling. `order.customer.address.postcode` depends on Order having a
Customer, Customer having an Address, and Address having a postcode — three structural facts, none
of which the calling code owns or was promised.

That makes the change surface enormous. A refactor inside Address breaks every caller that reached
through to it, and those callers are scattered across code that has nothing to do with addresses.

The **train wreck** — the long chain of dots — is the visible symptom, and the underlying problem is
that the caller is doing work that belongs to someone else. Asking `order.shippingPostcode()` moves
the traversal inside the object that owns the relationship, where it can change freely.

It also makes testing dramatically cheaper. Mocking a three-deep chain requires constructing three
stub objects; mocking one method requires one, which is a good proxy for how much coupling was
there.

## Example

A shipping calculator computes cost from `order.getCustomer().getAddress().getCountry().getZone()`.
It works, and it is the obvious code to write.

Two refactors later it does not. Customer addresses become a list to support multiple shipping
destinations, and every caller that reached through `getAddress()` breaks — forty call sites, in
code that mostly has nothing to do with addresses.

The Demeter version asks `order.shippingZone()`. The traversal lives inside Order, which owns the
relationship, and the change from one address to a list is one edit in one place.

The unit test difference is just as stark. The chained version needs four stub objects wired
together in the right shape; the direct version needs one method stubbed, and a test that is one
line instead of nine.

The rule did not make the code shorter. It moved a piece of knowledge — how to find a shipping
zone from an order — to the object that should have had it.

## Limits

It applies to objects with behaviour, not to data. Navigating a JSON document, a configuration
tree or a plain data structure is not a Demeter violation, because there is no encapsulation being
breached — the shape *is* the contract.

Applied dogmatically it produces the middle-man problem: every object grows delegating methods that
exist only to forward calls, and the interface bloats without adding meaning. `order.shippingZone()`
is good; `order.customerAddressCountryZoneCode()` is the same coupling with more ceremony.

Fluent interfaces and builders also chain deliberately and are not violations, because each call
returns the same object rather than reaching into a different one.

## Source

The rule came out of the Demeter Project at Northeastern University in 1987 — a research effort on
adaptive programming, named after the Greek goddess of agriculture, on the theme of growing software
rather than constructing it.

Lieberherr and Holland's 1989 paper gives the formal version, which is stricter than the informal
"one dot" heuristic it is usually quoted as, and the heuristic is what survived.
