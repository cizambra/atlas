---
type: pattern
title: Union-find
sidebar_position: 15
group: Algorithms
summary: Track which things are connected as connections arrive, answering "same group?" in effectively constant time.
defines: [union-find, disjoint set union, path compression, union by rank]
razors: []
prereq: [bfs-and-dfs]
---

## The model

**Union-find** — also called disjoint set union — maintains a collection of groups under two
operations: merge two groups, and ask whether two elements are in the same one.

The reason it exists alongside [[breadth-first search|BFS]] is that it handles connections
**arriving over time**. A traversal answers connectivity for a graph you already have; a
union-find answers it after every new edge, without re-traversing anything. That incremental
property is what the problems using it have in common.

## Recognise it

Reach for union-find when:

- Edges or connections **arrive one at a time**, and you must answer connectivity as you go.
- The question is **"are these two in the same group?"** rather than "what is the path?"
- You are counting **connected components** and merging reduces the count.
- The problem involves detecting a **cycle in an undirected graph** — an edge joining two
  nodes already in the same set closes a cycle.
- You are building a minimum spanning tree with Kruskal's algorithm.

The tell against it: if you need the actual path between two nodes, or distances, union-find
cannot give you either. It knows only which group things are in.

## The template

```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))     # each element starts as its own root
        self.rank = [0] * n              # tree height, for merging smartly
        self.count = n                   # number of components

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])   # PATH COMPRESSION
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                 # already together — this edge is a cycle
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra              # UNION BY RANK: shorter under taller
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        self.count -= 1
        return True
```

Both optimisations are load-bearing. Without **path compression**, repeated finds walk long
chains. Without **union by rank**, merges can build a chain in the first place. Either alone is
decent; together they are what makes the structure fast.

The `union` returning `False` is the cycle detector, and it is free — worth noticing rather
than writing a separate check.

## Why it works

Each element points at a parent, and the root of a chain identifies the group. `find` walks to
the root; `union` points one root at another.

**Path compression** flattens the chain during `find` — every node visited is repointed
straight at the root, so the next query is one step. **Union by rank** attaches the shorter
tree under the taller one, so chains never grow when they could be avoided.

Together they give `O(α(n))` per operation, where α is the inverse Ackermann function. That
value is below 5 for any input that fits in the universe, so the honest description is
**effectively constant** — and saying it that way, rather than reciting the name, is what
demonstrates you know what the bound means.

The comparison with a traversal is the reason to choose it. Answering connectivity after each
of `m` edges by re-running BFS costs `O(m × (V + E))`. Union-find costs `O(m × α(n))`, which is
effectively `O(m)`. For a static graph asked once, BFS is simpler and equally good; for a graph
that keeps changing, union-find is the only reasonable answer.

## Worked example

"Count the connected components" in a graph with 5 nodes, given edges `(0,1)`, `(1,2)`,
`(3,4)`, `(0,2)`.

Start with 5 components, each node its own root.

Edge `(0,1)`: different roots, so merge. 1 points at 0, and the count drops to 4.

Edge `(1,2)`: `find(1)` walks to 0, and `find(2)` is 2. Different, so merge — 2 points at 0,
count 3.

Edge `(3,4)`: different, merge, count 2. The groups are now `{0,1,2}` and `{3,4}`.

Edge `(0,2)`: `find(0)` is 0 and `find(2)` is 0. **Same root**, so no merge and the count stays
at 2. That edge closed a cycle, and `union` returning false is how you know.

Two components, and the cycle was detected without a separate pass. Notice what path
compression did along the way — after `find(2)` walked `2 → 0`, node 2 was repointed directly
at 0, so the last query answered in one step rather than two.

The incremental property is the thing to point at. If a fifth edge arrived now, the answer
updates in effectively constant time. Re-running BFS would mean traversing the whole graph
again for every edge, which is the difference the pattern exists to make.

## Classic problems

- **Number of Connected Components in an Undirected Graph** — the example above.
- **Graph Valid Tree** — a tree is connected with exactly `n − 1` edges and no cycle, which is
  three checks union-find gives you at once.
- **Redundant Connection** — return the edge that creates a cycle, which is literally the first
  `union` that returns false.
- **Number of Islands** — solvable with DFS or union-find; the union-find version is the right
  answer to the follow-up "now islands appear one at a time" (**Number of Islands II**).
- **Accounts Merge** — group accounts sharing an email, where the union-find is over emails and
  the grouping falls out.
- **Most Stones Removed** — connect stones sharing a row or column, then the answer is
  `n` minus the component count.
- **Kruskal's minimum spanning tree** — sort edges by weight and union them, skipping any that
  would close a cycle. Union-find is what makes the algorithm practical.
