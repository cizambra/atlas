---
type: pattern
title: BFS and DFS
sidebar_position: 12
group: Algorithms
summary: The same traversal with a different container — a queue explores by distance, a stack by depth, and that decides which problems each solves.
defines: [breadth-first search, depth-first search, visited set, frontier, connected component, multi-source BFS]
razors: []
prereq: [trees-and-traversals]
---

## The model

Both explore a graph by keeping a collection of nodes to visit next. **Breadth-first search**
uses a queue, so it visits everything one step away, then two steps, and so on.
**Depth-first search** uses a stack — usually the call stack — so it follows one path as far
as it goes before backing up.

That single difference decides everything downstream. BFS reaches every node by the fewest
edges, so it finds shortest paths in an unweighted graph. DFS does not, but it uses less
memory on deep graphs and is the natural shape for anything recursive.

## Recognise it

Reach for **BFS** when:

- The problem asks for the **shortest path**, **minimum steps**, or **fewest moves** in an
  unweighted graph.
- You need things **level by level** — "how many rounds until everything is infected".
- The graph is very deep but the answer is likely shallow.

Reach for **DFS** when:

- You need to explore *whether* something is reachable, not how far.
- You are finding **connected components**, cycles, or islands.
- The problem is naturally recursive — subtrees, backtracking, topological ordering.
- Memory matters and the graph is deep and narrow.

And recognise the graph at all: **a grid is a graph**. Cells are nodes, adjacent cells are
edges, and "number of islands" is connected components wearing a costume.

## The template

```python
from collections import deque

def bfs(start, neighbours):
    """Shortest number of edges from start to every reachable node."""
    dist = {start: 0}
    q = deque([start])
    while q:
        node = q.popleft()                    # popleft — the whole difference
        for nxt in neighbours(node):
            if nxt not in dist:               # mark on ENQUEUE, not on dequeue
                dist[nxt] = dist[node] + 1
                q.append(nxt)
    return dist

def dfs(node, seen, neighbours):
    if node in seen:
        return
    seen.add(node)
    for nxt in neighbours(node):
        dfs(nxt, seen, neighbours)

# Grid neighbours — the four-direction idiom
DIRS = [(0, 1), (0, -1), (1, 0), (-1, 0)]
def grid_neighbours(r, c, grid):
    for dr, dc in DIRS:
        nr, nc = r + dr, c + dc
        if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]):
            yield nr, nc
```

Mark nodes as visited **when you enqueue them**, not when you dequeue. Marking on dequeue lets
the same node be added several times before it is processed, which quietly turns a linear
traversal into an exponential one on dense graphs.

## Why it works

Both visit each node once and each edge once, so both are `O(V + E)` time. The
**visited set** is what guarantees "once" — without it, any cycle makes the traversal run
forever, and this is the bug that appears most often.

Space is where they differ. BFS holds the **frontier**, which can be the entire widest level —
`O(V)` in the worst case, and genuinely large on a wide graph. DFS holds one path, so it is
`O(depth)`, which is far smaller on wide shallow graphs and worse on deep ones, where it
overflows the call stack.

The property that makes BFS find shortest paths is worth stating precisely, because it is the
reason to choose it. Since the queue processes nodes in non-decreasing order of distance, the
first time you reach a node is by the fewest possible edges. So you can stop at the target
immediately, and you never need to revisit.

That guarantee holds **only when every edge costs the same**. With weights, the first arrival
is no longer the cheapest, and BFS gives a confidently wrong answer — you need Dijkstra, which
is BFS with a priority queue instead of a plain one.

## Worked example

"Rotting oranges": a grid where rotten oranges spread to adjacent fresh ones each minute. How
many minutes until none are fresh?

This says *minimum time for something to spread*, which is shortest path in disguise — so BFS,
and specifically multi-source BFS, because every rotten orange starts spreading simultaneously.

Seed the queue with **every** rotten cell at distance 0. That is the move worth internalising:
BFS does not require a single start, and starting from all sources at once is what makes
simultaneous spread fall out naturally rather than needing per-source runs.

Take a 3×3 grid with rotten cells at the top-left and bottom-right, and fresh cells elsewhere.
Minute 0 is those two cells. Processing them enqueues their neighbours at distance 1 — two
cells adjacent to each source.

Minute 1 processes those four, enqueueing their unvisited neighbours at distance 2. Minute 2
processes those, and the queue empties with every cell reached.

The answer is 2, and it is simply the largest distance recorded. Each of the nine cells was
enqueued exactly once, giving `O(V + E)` — here `O(rows × cols)`, since a grid cell has at
most four edges.

The check that catches people is at the end: if any fresh orange was never reached, it is
unreachable and the answer is −1. BFS tells you that for free — an unvisited node is one no
path reaches — and forgetting to look is the difference between passing and not.

## Classic problems

- **Number of Islands** — connected components on a grid, DFS or BFS, either works.
- **Rotting Oranges** — the multi-source BFS above.
- **Word Ladder** — shortest transformation, where the hard part is realising that words are
  nodes and one-letter differences are edges.
- **Clone Graph** — traversal plus a map from original to copy, so cycles terminate.
- **Course Schedule** — cycle detection with DFS, which is [[topological sort|topological sorting]] in disguise.
- **Pacific Atlantic Water Flow** — two multi-source traversals from the borders inward,
  which is much easier than simulating flow outward from each cell.
- **Walls and Gates** / **01 Matrix** — multi-source BFS from all the zeros at once.
- **Shortest Path in Binary Matrix** — BFS with eight directions, and the reminder that
  "shortest" plus "unweighted" is always this pattern.
