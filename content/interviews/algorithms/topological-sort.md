---
type: pattern
title: Topological sort
sidebar_position: 14
group: Algorithms
summary: Order tasks so every dependency comes before what needs it — and the same algorithm tells you when no such order exists.
defines: [topological sort, directed acyclic graph, in-degree, Kahn's algorithm]
razors: [conways-law]
prereq: [bfs-and-dfs]
---

## The model

Given tasks with dependencies, produce an order where every task comes after everything it
depends on. Course prerequisites, build targets, package installs, job schedules.

The structure this requires is a **directed acyclic graph** — directed because dependencies
point one way, acyclic because a cycle makes the problem unsolvable. That second half is the
useful part: the algorithm that produces an order also *detects* when no order exists, so
"can this be scheduled at all" and "in what order" are the same question.

## Recognise it

Reach for topological sort when:

- The problem describes **prerequisites**, dependencies, or "must happen before".
- You are asked whether a set of tasks **can be completed** — that is cycle detection.
- The input is pairs like `[a, b]` meaning "b depends on a", which is an edge list wearing a
  disguise.
- You need a **build order**, an install order, or any linearisation of a dependency graph.
- The problem mentions courses, recipes, compilation, or task scheduling.

The tell: if the answer is "impossible when there is a circular dependency", you are in this
pattern whether the problem says graph or not.

## The template

Kahn's algorithm is BFS over in-degrees, and it is the one to write because it detects cycles
without extra bookkeeping.

```python
from collections import deque, defaultdict

def topo_sort(n, edges):
    """edges: (a, b) means a must come before b. Returns order, or [] if cyclic."""
    graph = defaultdict(list)
    in_degree = [0] * n
    for a, b in edges:
        graph[a].append(b)
        in_degree[b] += 1              # count what each node waits for

    q = deque(i for i in range(n) if in_degree[i] == 0)   # nothing blocks these
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nxt in graph[node]:
            in_degree[nxt] -= 1        # this dependency is satisfied
            if in_degree[nxt] == 0:    # everything it waited for is done
                q.append(nxt)

    return order if len(order) == n else []   # short → a cycle exists
```

The final length check is the cycle detection, and it is free. Nodes inside a cycle never
reach in-degree zero, so they never enter the queue, so the order comes out short.

## Why it works

Each node is enqueued once and each edge is examined once when its source is processed, giving
`O(V + E)` time and `O(V + E)` space for the graph and the queue.

The correctness argument is an invariant. A node is enqueued only when its **in-degree**
reaches zero, meaning every prerequisite has already been output. So at the moment any node is
appended to the order, everything it depends on precedes it — which is exactly the property
being asked for, maintained at every step rather than checked at the end.

The cycle result falls out of the same invariant. If nodes `a` and `b` depend on each other,
neither can reach in-degree zero without the other going first, so neither ever enters the
queue. Any node in or downstream of a cycle is therefore missing from the output, and a short
result is proof that a cycle exists.

Two things worth being precise about, because both are common follow-ups.

**The order is not unique.** Whenever several nodes have in-degree zero at once, any of them
may go next, and a problem wanting a specific one needs a tiebreak — usually a priority queue
rather than a plain one.

**DFS gives an alternative.** Post-order, reversed, also produces a valid order. Detecting
cycles then requires three states per node rather than just visited, which is why Kahn's is
easier to get right under pressure.

## Worked example

"Course Schedule II": four courses, with prerequisites `[0→1]`, `[0→2]`, `[1→3]`, `[2→3]`.
Course 0 unlocks 1 and 2; both 1 and 2 must precede 3.

In-degrees start at `[0, 1, 1, 2]`. Only course 0 has nothing blocking it, so the queue begins
with `[0]`.

Process 0 and append it to the order. Its edges point at 1 and 2, so both drop to in-degree 0
and both enter the queue.

Process 1. Its only edge points at 3, whose in-degree falls from 2 to 1 — still blocked,
because 2 has not been taken yet, so 3 does not enter the queue.

Process 2. Now 3's in-degree drops from 1 to 0, and 3 enters the queue. Process 3, and the
queue empties.

The order is `[0, 1, 2, 3]`, length 4, which matches the course count — so no cycle. Note that
`[0, 2, 1, 3]` would have been equally valid; 1 and 2 were both available at the same moment
and the queue happened to hold 1 first.

Now add a prerequisite `[3→0]`, making it circular. Every course now has in-degree at least 1,
so the initial queue is *empty*, the loop never runs, and the order has length 0. Short output,
therefore a cycle, therefore impossible — and no separate cycle-detection pass was needed.

## Classic problems

- **Course Schedule** — can all courses be finished? The cycle check alone.
- **Course Schedule II** — the order itself, which is the example above.
- **Alien Dictionary** — infer letter ordering from a sorted word list. The hard part is
  building the graph; the sort is mechanical once you have it.
- **Minimum Height Trees** — peel leaves layer by layer, which is the same in-degree idea on
  an undirected graph.
- **Sequence Reconstruction** — is the topological order unique? True exactly when the queue
  never holds more than one node, which is a neat one-line addition.
- **Parallel Courses** — the number of semesters is the number of BFS levels, so this is
  topological sort and level-order at once.
- **Build order / package resolution** — the real-world version, and the reason
  [[Conway's Law]] shows up here: a dependency graph with cycles usually means two teams that
  should have been one.
