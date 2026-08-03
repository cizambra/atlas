---
type: razor
title: The law of leaky abstractions
sidebar_position: 13
family: Laws of systems
defines: [leaky abstraction]
sources:
  - "Joel Spolsky, 'The Law of Leaky Abstractions' (2002)"
---

## Statement

All non-trivial abstractions leak, so the layer you were promised you could ignore is the one you
will debug.

## In plain terms

A **leaky abstraction** is one whose underlying details show through when something goes wrong —
the ORM hides SQL until a query is slow, the filesystem hides the disk until it is full, TCP hides
packet loss until the network is bad. Abstractions save you from the details most of the time, and
never save you from learning them.

## Decides

How much you can rely on not understanding what is beneath a layer you are using.

## Why it holds

Abstractions are simplifications, and a simplification is a claim that some detail does not matter.
That claim is true in the common case and false in the tail — and the tail is exactly where you end
up when something is failing.

The leaking is not a defect in the abstraction. A perfect abstraction would have to replicate every
behaviour of the thing beneath it, at which point it is not an abstraction. Leaking is what makes
it useful.

The practical consequence Spolsky draws is uncomfortable: abstractions save time working and do not
save time learning. You still have to understand the layer below, because you will be debugging
through it — and the abstraction has made that harder by hiding the mechanism.

There is a compounding version. Each layer added to a stack is another abstraction that mostly
holds, and debugging a problem that crosses four of them requires understanding all four plus the
interactions between their failure modes.

## Example

A team uses an ORM specifically so nobody has to write SQL, and for eighteen months it works.

Then a page gets slow. The cause is an N+1 query: a loop over 300 records, each lazily loading an
association, producing 301 queries where one join would do. Nothing in the application code looks
like a query at all — the loop reads as an ordinary iteration over objects.

Debugging it requires exactly what the ORM was adopted to avoid: reading the generated SQL,
understanding query plans, knowing what an index does, and knowing how the ORM decides to lazily
load.

The abstraction was genuinely valuable for eighteen months and it did not remove the requirement to
understand databases. It deferred it — to a moment when the person debugging had eighteen months
less practice at it than they would otherwise have had.

## Limits

It is not an argument against abstraction. The alternative is writing everything at the lowest
level, which is worse; the point is about what abstraction does and does not buy.

Some abstractions leak far less than others, and the difference is worth recognising. A
well-designed interface over a stable, well-understood mechanism leaks rarely; one over a
distributed system leaks constantly, because the underlying failure modes are richer than any
simplification.

And the razor is sometimes used to justify learning everything before using anything, which is
paralysis. The workable stance is to use the abstraction and know enough about the layer below to
debug through it when it fails.

## Source

Spolsky coined the phrase in a 2002 essay on Joel on Software, with examples ranging from TCP over
unreliable IP to SQL query optimisers to remote-procedure-call frameworks.

His conclusion is the part most often dropped: abstractions do not simplify our lives as much as
they were meant to, because the tooling saves working time and not learning time — so each new
layer raises rather than lowers what a competent engineer has to know.
