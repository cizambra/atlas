---
type: razor
title: Hyrum's Law
family: Laws of systems
defines: [Hyrum's Law]
sources:
  - "Hyrum Wright, hyrumslaw.com"
  - "Winters, Manshreck & Wright, Software Engineering at Google (2020)"
---

## Statement

With a sufficient number of users, every observable behaviour of your system will be
depended on by somebody, regardless of what you promised in the contract.

## Decides

Whether you can actually change a thing — as distinct from whether you are *permitted*
to change it by your own documentation.

## Why it holds

People program against what they observe, not against what you wrote down. Nobody reads
a contract to discover that iteration order is unspecified; they run the code, see an
order, and build on it.

The set of observable behaviours is enormous and mostly undocumented: timing, the exact
text of an error message, whether a list comes back sorted, whether a bug happens to
round down. Every one of those is a surface somebody can attach to.

Scale is what converts possibility into certainty. At ten users, most incidental
behaviours go unnoticed. At ten thousand, someone has depended on each of them, and you
will find out by breaking them.

## Example

A JSON API returns object keys in insertion order because that is what the serialiser
happened to do. The documentation says nothing about ordering, because ordering was
never a feature.

A client team writes a test that snapshots the response body. It passes for two years.
You upgrade the serialiser, the key order changes, their pipeline goes red, and the
conversation that follows is not about whose fault it is — it is about the fact that you
now cannot upgrade the serialiser.

The contract said you could. Hyrum's Law says you could not, and Hyrum's Law is the one
that governs the deploy.

## Limits

"Sufficient number of users" is doing real work in the statement. An internal API with
three known callers is genuinely changeable — you can read all the call sites, and the
law does not apply in any useful sense.

It is also a description of risk, not a prohibition. The conclusion is not "never
change anything"; it is that changes to observable behaviour need the same machinery as
changes to documented behaviour — versioning, deprecation windows, and a way to find out
who depends on what.

The best response is to make fewer behaviours observable in the first place. Randomising
iteration order deliberately, as Go does for maps, converts an accidental promise into
an obvious error.

## Source

Named for Hyrum Wright, a software engineer at Google, and popularised through
*Software Engineering at Google* (2020), where it describes the practical experience of
maintaining APIs used by tens of thousands of engineers in a single repository.
