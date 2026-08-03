---
type: razor
title: Postel's Law, and its retraction
sidebar_position: 16
family: Laws of systems
defines: [Postel's Law, robustness principle, protocol ossification]
sources:
  - "Jon Postel, RFC 761 (1980)"
  - "Martin Thomson and David Schinazi, RFC 9413, 'Maintaining Robust Protocols' (2023)"
---

## Statement

Be liberal in what you accept was protocol doctrine for forty years; RFC 9413 walked it back
because tolerance ossifies protocols.

## In plain terms

**Postel's Law** — the **robustness principle** — says be conservative in what you send and liberal
in what you accept. It made the early internet work. It also means every bug that is tolerated
becomes a feature someone depends on, and after forty years the IETF published a document
explaining why that turned out to be a problem.

## Decides

How strictly to validate input at an interface you control.

## Why it holds

The original argument is sound and still applies at launch. Early implementations are buggy, there
is no reference implementation, and a protocol whose implementations reject each other's minor
deviations never reaches critical mass. Tolerance is what allowed independent implementations to
interoperate at all.

The failure mode is delayed and severe. A sender producing malformed output that receivers accept
never learns it is wrong, so the bug propagates into every deployment — and now the malformed form
is the de facto standard. This is [[Hyrum's Law]] operating at protocol scale.

**Protocol ossification** is where it ends. Once enough middleboxes and implementations depend on
accidental behaviour, the protocol cannot be changed — which is why TLS 1.3 had to disguise itself
as TLS 1.2 on the wire, and why QUIC was built on UDP and encrypted almost everything: the
alternative was being blocked by intermediaries that had grown to depend on details nobody
specified.

RFC 9413's correction is not "reject everything". It is that tolerance must be paired with active
maintenance: log what you tolerate, report it, and remove the tolerance on a schedule — otherwise
each act of leniency is a permanent commitment.

## Example

An API accepts a date field. The specification says ISO 8601, and one client sends
`2026-3-7` — no zero padding, technically invalid.

The lenient response is to parse it anyway. Nothing breaks, the client never finds out, and the
behaviour ships.

Three years later there are 200 integrations and roughly a fifth send unpadded dates, because
several were built by copying a working example. The parser now has four date formats in it, each
added the same way.

The attempt to tighten it fails. Rejecting unpadded dates breaks forty customers who have been
working for years, and none of them did anything they were told not to — the system accepted it, so
it was allowed.

The maintained version is the same tolerance with a clock attached: accept it, log it with the
client identity, return a deprecation warning header, tell the client, and reject it in twelve
months. The leniency buys the same interoperability and does not become permanent.

## Limits

Strictness has its own costs and they are not small. A protocol that rejects on any deviation is
brittle, hard to implement independently, and can fail to reach adoption at all — which is the
problem Postel was solving.

The correction is also specific to protocols with many independent implementations. For an internal
API with three known callers, strictness is cheap because you can fix the callers, and the whole
tension largely disappears.

And the distinction that matters is between security-relevant and cosmetic deviations. Tolerating a
missing zero is a maintenance question; tolerating a malformed length field is a vulnerability, and
the robustness principle was never an argument for the second.

## Source

Postel stated it in RFC 761 in 1980, specifying TCP, and it became one of the most quoted lines in
internet engineering.

RFC 9413, published in 2023 by Martin Thomson and David Schinazi, is the formal reconsideration. It
does not reject the principle so much as add the missing half: tolerance without a feedback loop
produces ossification, and the document sets out what active maintenance of that loop looks like.
