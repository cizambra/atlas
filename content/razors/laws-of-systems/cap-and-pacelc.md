---
type: razor
title: CAP and PACELC
sidebar_position: 5
family: Laws of systems
defines: [CAP theorem, PACELC, linearizability]
sources:
  - "Eric Brewer, PODC keynote (2000)"
  - "Gilbert & Lynch, 'Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services' (2002)"
  - "Daniel Abadi, 'Consistency Tradeoffs in Modern Distributed Database System Design' (2010)"
  - "Eric Brewer, 'CAP Twelve Years Later' (2012)"
---

## Statement

During a partition you choose consistency or availability; when there is no partition
you still choose latency or consistency — and the second choice is the one you make
every day.

## In plain terms

When the network splits, you have to pick: answer with data that may be stale, or refuse to
answer until you are certain. That is the famous choice — the **CAP theorem** — and it is rare.

The one you make every day is quieter, because every copy you keep in step costs you time on
every single request.

## Decides

Which datastore and which replication configuration a given workload needs, per
operation rather than per system.

## Why it holds

A partition means two halves of your system cannot talk. A write arrives at one half.
Either you accept it — and the other half now serves stale data, so you gave up
consistency — or you refuse it, and you gave up availability. There is no third option,
which is what Gilbert and Lynch proved.

But partitions are rare, and CAP says nothing about the other 99.9% of the time. That is
Abadi's addition: **PACELC** reads "if Partition, then Availability or Consistency; Else,
Latency or Consistency."

The *else* branch is the daily trade. Making a write durable across three replicas
before acknowledging it costs a round trip; acknowledging locally and replicating after
is faster and can lose the write. No partition is involved — you are simply buying
latency with consistency, on every single request.

## Example

A shopping cart is PA/EL. Accept the write locally, replicate afterwards, and if two
devices race, merge the carts. A cart that rejects an add-to-cart because a replica is
unreachable is a worse product than a cart that occasionally shows an extra item.

A ledger is PC/EC. Refuse the write rather than accept one you might have to un-accept,
and pay the cross-replica round trip on every transaction. Two conflicting balances are
not a merge problem, they are an audit.

The answer that marks someone who has done this is that both live in the same
application, and the interesting work is deciding which operations sit in which camp —
not picking one database and declaring the system "AP."

## Limits

The C in CAP is **linearizability**, not the C in ACID. Conflating them is the most
common error in the room: a system can be perfectly consistent in the ACID sense and not
linearizable, and the two words are measuring different things.

"CP versus AP" as a label for a whole database is too coarse to be useful. Most real
systems are tunable per operation — quorum sizes, read-your-writes, bounded staleness —
and Brewer's own 2012 retrospective argues the binary framing misled people for a
decade.

Partition tolerance is also not a choice. If you have a network, you have partitions,
so "CA" is not a design; it is a single-node system or a claim that has not been tested
yet.

## Source

Eric Brewer stated the conjecture in a 2000 keynote; Gilbert and Lynch proved a formal
version in 2002. Daniel Abadi extended it to PACELC in 2010, specifically because CAP's
silence about the non-partition case left out the trade practitioners actually make.
Brewer's 'CAP Twelve Years Later' walks back the binary reading himself.
