---
type: razor
title: The end-to-end argument
sidebar_position: 17
family: Laws of systems
defines: [end-to-end argument]
sources:
  - "J. H. Saltzer, D. P. Reed and D. D. Clark, 'End-to-End Arguments in System Design' (1984)"
---

## Statement

Put function at the endpoints; the network cannot guarantee correctness the endpoints must check
anyway.

## In plain terms

The **end-to-end argument** says that if the endpoints have to verify something themselves for
correctness, then doing it in the middle as well is redundant for correctness — though it may still
be worth doing for performance. It is the reason the internet's core is simple and the intelligence
lives at the edges.

## Decides

Which layer a check, a guarantee or a feature belongs in.

## Why it holds

The argument is about where correctness can actually be established. A network can deliver a
message reliably between two routers and still lose it to a crash at the receiving application — so
the application must verify end to end regardless, and once it does, the intermediate guarantee has
not removed any required work.

That produces a clean rule: a function can be completely and correctly implemented only with the
knowledge of the endpoints, so implementing it in the middle is either redundant or incomplete.

The middle is also the wrong place for another reason. Every intermediate node implementing a
guarantee has to be correct, has to be upgraded to change the guarantee, and becomes something
every future protocol has to be compatible with — which is exactly the ossification
[[Postel's Law]]'s retraction describes.

The performance caveat is part of the original and usually dropped. Link-level retransmission on a
lossy wireless hop is genuinely valuable — not because it makes the end-to-end check unnecessary,
but because it makes the common case much faster. Optimisation in the middle is fine; *correctness*
in the middle is not.

## Example

A team building a document pipeline is deciding where to guarantee that a file arrived intact.

The proposal is to add checksums at each hop: uploader to gateway, gateway to queue, queue to
worker, worker to store. Four verified handoffs, and the file is guaranteed correct.

It is not. A bug in the gateway that corrupts the file after verification and before re-sending
passes every hop check, because each hop verifies what it received rather than what the user sent.
The only check that can catch it is the one comparing the stored file to the uploader's original
hash.

Once that end-to-end check exists, three of the four hop checks add no correctness. What they can
add is early detection — catching a corruption at hop one rather than after four expensive stages —
which is a performance argument and a legitimate one, made explicitly rather than by confusion with
correctness.

## Limits

It is not an argument for a featureless middle. The paper is explicit that intermediate mechanisms
are frequently worth having for performance, and dogmatic application produces systems that are
correct and unusably slow.

It also assumes the endpoints can do the check. Where one endpoint is a constrained device, a
third-party client you do not control, or a browser you cannot trust, the middle may be the only
place a guarantee can be enforced — which is why authentication and authorisation legitimately live
in gateways.

And the boundary of "end" is a design decision rather than a given. In a system of systems, one
service's endpoint is another's middle, and the argument has to be applied per correctness property
rather than globally.

## Source

Saltzer, Reed and Clark published the argument in 1984, drawing on experience with the ARPANET and
early internet protocols, and it is among the most influential papers in system design.

Its practical legacy is the shape of the internet: a simple, unreliable, best-effort core with
reliability, ordering and encryption implemented by the hosts at the edges — which is what allowed
new transport protocols to be deployed without changing the network.
