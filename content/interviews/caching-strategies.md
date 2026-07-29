---
type: concept
title: Caching strategies
section: interviews
group: Building blocks
summary: A cache is a faster copy of data; the caching strategy is the rule for what happens to that copy on a write.
razors: [choose-boring-technology]
next: []
---

## The model

A cache is a copy of data kept somewhere faster to reach than the place it came from. A
read checks the copy first; when the copy is missing or stale, something has to fetch
the real value.

The caching strategy is the rule for what happens on a write — whether the copy is
updated, deleted, or left to expire. That rule determines how far behind the copy can
fall.

## Decide it

1. **Can a reader tolerate a stale value, and for how long?** If the reader is the
   person who just made the write, the answer is usually no — that points at
   write-through or write-around.
2. **Is the write volume high enough that a synchronous cache write hurts?** If yes,
   write-behind, and accept that you now own a durability risk you did not have before.
3. **Is the key space large and sparsely read?** Then read-through, and do not try to
   warm it.

## Why it's true

Underneath every caching decision is a single bet: that reads outnumber writes by
enough to pay for keeping the copy. When that bet is wrong — a key written more often
than it is read — the cache costs more than it saves, and no strategy rescues it.

### What write-through actually buys

Write-through pays latency on every write to buy exactly one guarantee: the cache is
never behind the database. That guarantee is only worth its price when a read-after-write
is user-visible — your own profile edit, not somebody else's feed.

Turn it around and the rule sharpens. If nobody can perceive the staleness, you are
paying write latency for nothing, and read-through with a TTL is strictly cheaper.

### Where it goes wrong

Two concurrent writers with no version on the row can leave the cache newer than the
database. Writer B lands in the cache, then writer A's slower database write lands
after it. The two now disagree, and nothing in the system notices.

The fixes are a compare-and-set against a version column, or invalidating the key
instead of writing it. Invalidation is the boring option: it trades one guaranteed
extra read for never having to reason about write ordering at all.

### Numbers that anchor the decision

Rough figures worth carrying into a room: a Redis `GET` around 0.5 ms, an indexed
Postgres lookup around 1–5 ms, a same-region cross-AZ round trip around 0.5 ms.

Those numbers force a conclusion people skip. A cache pays for itself when the miss
path is roughly an order of magnitude slower, or when the database is the *contended*
resource rather than the slow one. Caching a 2 ms query behind a 0.5 ms lookup buys
almost nothing and hands you an invalidation problem.

Say which one you are doing out loud. "I am caching to take load off the primary" is a
different design from "I am caching to save latency," and the two lead to different
TTLs.

## Worked example

A product feed. Reads outnumber writes by orders of magnitude, and no user can tell
whether a price changed two seconds ago or sixty. That is the staleness budget, and
naming it first is what makes everything after it mechanical.

Read-through with a 60-second TTL. On a miss the reader fills the cache; on a write
nothing special happens and the entry simply ages out. No write-path hop, no
invalidation ordering to reason about.

The failure mode to raise unprompted is the thundering herd. When a popular key
expires, every concurrent reader misses at once and they all hit the database together.
Jitter the TTL so keys do not expire in lockstep, and coalesce concurrent misses for
the same key so only one request goes through.

What makes this a good answer is not the choice itself. It is that the staleness budget
was stated before the strategy, so the strategy reads as a consequence rather than a
preference.

## Next

Consistency models and hot keys are the two pages this one leans on next — the first
makes "tolerate a stale read" precise, the second explains why a single key can melt a
cache that is sized correctly for the whole key space.
