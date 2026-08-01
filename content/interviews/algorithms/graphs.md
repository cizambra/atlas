---
type: pattern
title: Graphs
sidebar_position: 13
group: Algorithms
summary: Most of the work is recognising the graph and choosing a representation — the traversal is usually the easy part.
defines: [adjacency list, adjacency matrix, edge list, directed graph, weighted graph, Dijkstra's algorithm, implicit graph]
razors: []
prereq: [bfs-and-dfs]
---

## The model

A graph is nodes and edges. That is general enough to describe almost anything, which is why
the difficulty is rarely the algorithm — it is noticing that you have a graph at all and
choosing how to store it.

Once the graph exists, four questions decide everything: is it a **directed graph**, is it a
**weighted graph**, can it have cycles, and how dense is it. Those answers pick the representation
and the algorithm, in that order.

## Recognise it

You have a graph whenever things are connected to other things. The **implicit graph** cases
are the ones people miss:

- A **grid** — cells are nodes, adjacent cells are edges.
- **Words** where an edge is "differs by one letter", as in Word Ladder.
- **States** of a puzzle, where an edge is a legal move. The nodes need not exist in memory.
- **Dependencies**, prerequisites, or "must come before" — a directed graph, usually wanting
  [[topological sort]].
- **Equations or ratios**, where `a/b = 2` is a weighted edge in both directions.

And the algorithm follows from the shape:

| Question | Answer |
|---|---|
| Shortest path, unweighted | [[breadth-first search]] |
| Shortest path, weighted, non-negative | Dijkstra |
| Connectivity, components, cycles | [[depth-first search]] or [[union-find]] |
| Ordering with dependencies | Topological sort |
| Minimum spanning tree | Kruskal or Prim |

## The template

```python
from collections import defaultdict
import heapq

# Adjacency list — the default. Build it from an edge list first.
graph = defaultdict(list)
for a, b in edges:
    graph[a].append(b)
    graph[b].append(a)          # omit this line for a DIRECTED graph

# Weighted: store the cost alongside the neighbour
for a, b, w in weighted_edges:
    graph[a].append((b, w))

# Dijkstra — BFS with a priority queue instead of a plain one
def dijkstra(graph, start):
    dist = {start: 0}
    pq = [(0, start)]
    while pq:
        d, node = heapq.heappop(pq)
        if d > dist.get(node, float('inf')):
            continue                        # stale entry — skip it
        for nxt, w in graph[node]:
            nd = d + w
            if nd < dist.get(nxt, float('inf')):
                dist[nxt] = nd
                heapq.heappush(pq, (nd, nxt))
    return dist
```

Building the adjacency list from whatever the input gives you is step one of nearly every
graph problem, and doing it explicitly rather than in your head is worth the thirty seconds.

## Why it works

The representation decides your complexity, so choose it deliberately.

An **adjacency list** stores each node's neighbours, costing `O(V + E)` space. Iterating a
node's neighbours is proportional to how many it has. This is the default, because real graphs
are sparse.

An **adjacency matrix** is a `V × V` grid of booleans or weights, costing `O(V²)` space. It
answers "is there an edge between these two?" in `O(1)`, which the list cannot. Use it only
when the graph is dense or that lookup dominates.

An **edge list** is just the pairs. It is what problems hand you, and it is right for Kruskal's
algorithm, which sorts edges rather than traversing.

Traversal is `O(V + E)` with a list and `O(V²)` with a matrix — the matrix forces you to scan
a whole row to find neighbours. On a sparse graph that difference is enormous, which is the
reason the list is the default.

**Dijkstra's algorithm** is `O((V + E) log V)` with a binary heap. It is BFS with a priority
queue, and the reason plain BFS fails on weights is that the first arrival is no longer the
cheapest — a path of many light edges can beat one heavy edge. The heap fixes that by always
expanding the cheapest frontier node next.

The precondition worth stating: Dijkstra requires **non-negative** weights. With a negative
edge, a node finalised as cheapest can later be improved, and the algorithm gives a confidently
wrong answer. That case needs Bellman-Ford, which is `O(VE)` and also detects negative cycles.

## Worked example

"Network delay time": a signal starts at node `k` and travels along weighted edges. How long
until every node receives it, or `−1` if some never do?

This is single-source shortest path with weights, so Dijkstra — and the answer is the
*maximum* of the shortest distances, since the signal is done when the last node has it.

Take 4 nodes with edges `(1→2, cost 1)`, `(1→3, cost 4)`, `(2→3, cost 1)`, `(3→4, cost 2)`,
starting at node 1.

Pop `(0, node 1)`. Its neighbours get tentative distances: node 2 at 1, node 3 at 4. Both go
on the heap.

Pop the cheapest, `(1, node 2)`. Its neighbour node 3 can be reached at `1 + 1 = 2`, which
beats the 4 already recorded — so node 3 is improved and pushed again at 2.

Pop `(2, node 3)`. Node 4 becomes `2 + 2 = 4`, pushed.

Pop `(4, node 3)` — the stale entry from the very first step. Its distance of 4 is worse than
the 2 already recorded, so it is skipped. That check is why the heap can hold duplicates
safely.

Pop `(4, node 4)` and the heap empties. Distances are `{1: 0, 2: 1, 3: 2, 4: 4}`, so the answer
is 4.

The stale-entry skip is the detail worth understanding rather than copying. Rather than
updating a node's priority inside the heap — which most heap implementations cannot do — you
push a new entry and ignore the old one when it surfaces. Plain BFS would have answered 4 for
node 3 by taking the direct edge first, which is the concrete reason weights need Dijkstra.

## Classic problems

- **Number of Islands** / **Clone Graph** — traversal on an implicit and an explicit graph.
- **Course Schedule** — directed, acyclic, and really [[topological sort]].
- **Network Delay Time** — the Dijkstra example above.
- **Cheapest Flights Within K Stops** — Dijkstra with an extra state dimension, or
  Bellman-Ford, and the problem that shows why "shortest" can need more than distance.
- **Word Ladder** — the implicit graph, where building the edges efficiently is the real work.
- **Evaluate Division** — weighted edges as ratios, answered by traversal with a running
  product, or by union-find with weights.
- **Min Cost to Connect All Points** — a minimum spanning tree, so Kruskal with
  [[union-find]] or Prim with a heap.
- **Alien Dictionary** — build a graph from observations, then sort it. The hardest part is
  never the algorithm.
