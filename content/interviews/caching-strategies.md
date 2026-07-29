---
type: concept
title: Caching strategies
section: interviews
group: Building blocks
summary: A cache is a faster copy of data; the caching strategy is the rule for what happens to that copy on a write.
defines: [cache, caching strategy, cache-aside, read-through, write-through, write-behind, write-around, refresh-ahead, TTL, eviction, hit rate, thundering herd, cache penetration, hot key]
razors: [choose-boring-technology]
prereq: []
next: [cache-layers]
---

## The model

A cache is a copy of data kept somewhere faster to reach than the place it came from. A
read checks the copy first; when the copy is missing or stale, something has to fetch
the real value.

The caching strategy is the rule for what happens on a write — whether the copy is
updated, deleted, or left to expire. That rule determines how far behind the copy can
fall.

## When to use it

You are choosing between four things: no cache, read-through, write-through, and
write-behind.

1. **Is the miss path an order of magnitude slower, or is the database the contended
   resource?** If neither, no cache — you would take on an invalidation problem to buy
   nothing.
2. **Can a reader tolerate a stale value, and for how long?** If the reader is the
   person who just made the write, usually not — that points at write-through or
   write-around.
3. **Is the write volume high enough that a synchronous cache write hurts?** If yes,
   write-behind, and accept a durability risk you did not have before.

## Speedrun

**What** — a copy of data kept closer than its source, so most reads never travel the
whole distance. There is usually more than one: browser, CDN, application memory, a
shared Redis, the database's own buffer pool.

**How to pick a strategy**

1. **Name the staleness budget in seconds** before considering any option. Every later
   step is a consequence of this number.
2. **Choose the read path.** The application fills the cache on a miss (cache-aside), or
   the cache fills itself (read-through). Cache-aside keeps the cache optional.
3. **Choose the write path.** Update the copy (write-through), delete it (invalidate),
   or write only to the database and let the copy age out (write-around).
4. **Set the TTL below your staleness budget, with jitter**, so it is a correctness
   backstop rather than the only thing keeping the copy honest.
5. **Name the failure you are accepting.** Every combination has one — stale reads, lost
   writes, or a cold first read. If you cannot name yours, you have not chosen yet.

**When it is full** — something must be thrown out, usually the least recently used
entry. TTL and eviction are different tools: TTL bounds how *stale* a copy can get,
eviction bounds how much *memory* the cache uses. A real cache needs both.

**Why it works** — the bet is that reads outnumber writes by enough to pay for keeping
the copy. Fill once, serve many. When the bet is wrong — a key written more often than
it is read — the cache costs more than it saves.

**Numbers to carry** — Redis `GET` ~0.5 ms · indexed Postgres lookup ~1–5 ms ·
same-region cross-AZ hop ~0.5 ms. A cache pays off when the miss path is roughly ten
times slower, or when the database is the contended resource rather than the slow one.

**The one failure everyone hits** — the thundering herd. A popular key expires, every
concurrent reader misses at once, and they all hit the database together. Jitter the
TTL so keys do not expire in lockstep, and coalesce concurrent misses so one request
refills the key.

**Say which one you are doing** — "caching to take load off the primary" and "caching
to save latency" are different designs with different TTLs. Naming it is half the
answer.

## Going deeper

### Where the copy lives

None of the strategies mean anything until you know where the copy sits, because the
same rule behaves differently in each place. Six of them line up between a user and your
database.

The browser holds copies you can never reach again. A CDN at the edge holds them for
everyone, purgeable in seconds. A reverse proxy inside your own infrastructure holds
them with instant control.

Your application's memory is the fastest of all, but keeps one copy per instance with no
way to clear them centrally. A shared store like Redis keeps a single copy every
instance agrees on, one network hop away. The database's buffer pool holds recently-read
pages in RAM, which you size but do not manage.

One line organises them: the further out you push a copy, the cheaper the hit and the
weaker your control over it. [[cache layers]] takes each one apart in full.

**For the rest of this page, assume the copy is in Redis.** That is where a strategy
question normally lands, because it is the only layer where all six strategies are
actually available to you — a browser cannot write-behind, and a buffer pool does not
take instructions.

### The strategies, in full

Three of them describe how a **read** is served; three describe what a **write** does.
Real systems combine one of each — "cache-aside with write-around" is a complete
answer, "read-through" alone is not.

| Strategy | What it does | Cost |
|---|---|---|
| **Cache-aside** (lazy loading) | The application checks the cache, and on a miss fetches from the database and fills the cache itself | The logic lives in every caller; easy to get subtly different in each |
| **Read-through** | The cache fetches from the database on a miss; the application only ever talks to the cache | The cache is now on the read path — if it is down, reads fail |
| **Refresh-ahead** | The cache refreshes hot entries *before* they expire | Wasted work for keys nobody asks for again |
| **Write-through** | The write goes to cache and database synchronously | Latency on every write |
| **Write-behind** (write-back) | The write goes to the cache now and the database later | A crash loses acknowledged writes |
| **Write-around** | The write goes to the database only; the cache fills on the next read | The first read after every write is a miss |

Cache-aside is the most common in practice, and read-through is what most people
actually mean when they say it. The difference matters in an interview: cache-aside
keeps the cache optional, read-through makes it a dependency.

### Eviction: what to throw out

A cache is finite, so filling it means throwing something away. The policy decides
what.

- **LRU** — least recently used. The default, and right whenever access has temporal
  locality: recently used things get used again.
- **LFU** — least frequently used. Better when popularity is stable, worse when it
  shifts, because yesterday's hot key keeps its count and squats.
- **FIFO** — oldest first. Simple, rarely the best choice.
- **W-TinyLFU** and **ARC** — modern hybrids that get close to LFU's hit rate while
  still adapting when the popular set changes. What Caffeine and modern Redis use.

The scan problem is worth knowing. One batch job that touches every key in order will
walk straight through an LRU cache and evict the entire hot set, because every key it
touches is "most recently used." That is why caches meant to survive analytics traffic
use something LFU-flavoured.

### Why the bet pays: hit rate is everything

The whole economics of a cache is one equation, where $h$ is the hit rate:

$$t_{\text{effective}} = h \cdot t_{\text{hit}} + (1 - h) \cdot t_{\text{miss}}$$

Put the numbers in. At a 95% hit rate with a 0.5 ms hit and a 5 ms miss, the effective
read is $0.95(0.5) + 0.05(5) = 0.73$ ms — about seven times faster than going to the
database every time.

Now drop the hit rate to 50%: $0.5(0.5) + 0.5(5) = 2.75$ ms. Not even a two-times win,
in exchange for an invalidation problem you now own forever.

That is the thing people miss. Hit rate dominates everything else, and hit rate is a
property of your access pattern rather than of your cache. Real key popularity is
usually Zipf-like — a small share of keys takes most of the traffic — which is why a
cache holding 5% of the key space can serve 80% of reads.

### The numbers behind the rule of thumb

"An order of magnitude" is not arbitrary. Adding a cache adds a network hop on the hit
path and an invalidation problem on the write path, so the saving has to be big enough
to be worth both.

If the miss path is only twice as slow, a 90% hit rate buys you a 1.8× improvement and
a permanent correctness liability. If the miss path is fifty times slower — a
cross-region call, a fan-out query, an external API — even a mediocre hit rate wins.

The second case is different in kind: when the database is the *contended* resource,
you are not buying latency, you are buying headroom. A cache that saves no time per
request but removes 90% of queries can still be the thing that keeps the primary alive.

### The failure modes, and the fix for each

**Thundering herd** (or cache stampede). A popular key expires and every concurrent
reader misses at once. Fix with jittered TTLs plus request coalescing, so one request
refills while the rest wait on it.

**Cache penetration.** Requests for keys that do not exist miss every time and hit the
database every time — the cache never helps, and an attacker can aim it. Fix by caching
the negative result with a short TTL, or by putting a Bloom filter in front.

**Cache avalanche.** A large set of keys expires at the same moment, usually because
they were all warmed together at deploy. Jitter the TTL when you *write* the key, not
only when it expires.

**Hot key.** One key is popular enough to saturate the single node that owns it.
Replicate that key across nodes, or put a small in-process cache in front of the shared
one to absorb the repeats.

**Divergence.** Two concurrent writers with no version on the row can leave the cache
ahead of the database: writer B lands in the cache, then writer A's slower database
write lands after it. Nothing in the system notices.

Fix divergence with a compare-and-set against a version column, or by invalidating the
key instead of writing it. Invalidation is the boring option — it trades one guaranteed
extra read for never reasoning about write ordering at all.

### Two designs that look the same

Write-through pays latency on every write to buy exactly one guarantee: the cache is
never behind the database. That guarantee earns its price only when a read-after-write
is user-visible — your own profile edit, not somebody else's feed.

Turn it around and the rule sharpens. If nobody can perceive the staleness, you are
paying write latency for nothing, and read-through with a TTL is strictly cheaper.

This is also why "caching for load" and "caching for latency" diverge. Caching for
latency wants long TTLs on the slowest queries; caching for load wants coverage of the
most *frequent* queries, even the fast ones, because the goal is fewer trips rather
than shorter ones.

## See it work

```mermaid
flowchart LR
  R([Read]) --> Q{In cache?}
  Q -->|hit ~0.5ms| RET([Return copy])
  Q -->|miss| DB[(Database ~1-5ms)]
  DB --> FILL[Fill cache · TTL 60s + jitter]
  FILL --> RET
  W([Write]) --> SRC[(Database)]
  SRC -.->|copy just ages out| EXP((TTL expiry))
```

A product feed. Reads outnumber writes by orders of magnitude, and no user can tell
whether a price changed two seconds ago or sixty. That is the staleness budget, and
naming it before picking a strategy is what makes the rest mechanical.

Cache-aside with write-around, and a 60-second TTL. On a miss the reader fills the
cache; on a write nothing special happens and the copy simply ages out. No write-path
hop, and no invalidation ordering to reason about.

Then raise the thundering herd before anyone asks. Jitter the TTL so a popular key's
expiry spreads across a window, and coalesce concurrent misses so one request refills
it while the rest wait.

What makes this a good answer is not the choice. It is that the staleness budget was
stated first, so the strategy reads as a consequence rather than a preference.

## Next

[[cache layers]] is next — this page assumed Redis, and that one covers what changes
when the copy sits further out or further in.

After it, consistency models makes "tolerate a stale read" precise, and hot keys
explains why one key can melt a cache sized correctly for the whole key space.
