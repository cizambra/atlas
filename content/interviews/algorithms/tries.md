---
type: pattern
title: Tries
sidebar_position: 24
group: Algorithms
summary: A tree keyed by character, so prefix questions cost the length of the prefix rather than the size of the dictionary.
defines: [trie, prefix tree, terminal marker, autocomplete]
razors: []
prereq: [trees-and-traversals]
---

## The model

A **trie** — a prefix tree — stores strings as paths through a tree, one character per edge.
Every word sharing a prefix shares the path for that prefix.

The consequence is the whole reason it exists: looking up a word, or asking whether any word
starts with a prefix, costs `O(length)` and is **completely independent of how many words are
stored**. A million-word dictionary answers a five-character prefix query in five steps.

## Recognise it

Reach for a trie when:

- The problem is about **prefixes** — autocomplete, "does any word start with", longest common
  prefix.
- You need to search a **dictionary of words** repeatedly, especially inside another search.
- The problem combines word lookup with a grid or board traversal — Word Search II is the
  canonical case.
- You would otherwise check "is this a word" against a set, inside a loop that builds
  candidates character by character.

That last cue is the strongest. A [[hash set]] answers "is this exact string present" in
`O(1)`, which is better than a trie. A trie wins when you are building a string incrementally
and want to **stop early** the moment no word can extend it.

## The template

```python
class TrieNode:
    def __init__(self):
        self.children = {}          # char → TrieNode
        self.is_word = False        # TERMINAL MARKER — "car" inside "cart"

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_word = True

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_word     # must be a WORD, not just a path

    def starts_with(self, prefix):
        return self._walk(prefix) is not None        # a path is enough
```

The `is_word` flag is the detail that matters. Without it you cannot distinguish "car is a
stored word" from "car is merely a prefix of cart" — and the difference between `search` and
`starts_with` is exactly that one check.

## Why it works

Insert and lookup both walk one character at a time, so both are `O(L)` where `L` is the word
length. Nothing in that cost mentions `n`, the number of stored words, which is the property
being bought.

Space is `O(total characters)` in the worst case, and much less in practice because shared
prefixes are stored once. A dictionary of `cat`, `car`, `card`, `care` stores `c-a` once rather
than four times.

The comparison with a hash set is the one to be able to make. A set gives `O(L)` exact lookup —
hashing reads the whole string anyway — and uses less memory with less pointer chasing. So for
"is this word in the dictionary", a set wins.

What a set cannot do is answer prefix questions or fail early. Asking a set for all words
starting with `pre` means scanning every key. Asking a trie means walking three nodes and
collecting the subtree. That gap is why autocomplete uses tries and spell-check often does not.

The early-exit property is what makes tries transformative inside a search. When you are
building candidate strings — walking a grid, backtracking through choices — a trie tells you
after each character whether *any* word can still extend the current path. A set can only
answer once the string is complete, so it cannot prune.

## Worked example

"Word Search II": find every word from a dictionary that appears in a letter grid, moving
between adjacent cells.

The naive approach runs a separate grid search per word. With 1,000 words and a large board,
that is 1,000 independent traversals, each exploring paths that share nothing.

The trie inverts it. Build a trie of all 1,000 words, then walk the grid **once** with
[[backtracking]], carrying a trie node alongside the path.

At each step you have a cell and a trie node. Move to an adjacent cell and check whether that
character is a child of the current node. If it is not, **stop immediately** — no word in the
entire dictionary continues this way, so the whole subtree of the grid search is pruned.

Say the grid path spells `q-u-a`, and the dictionary contains `quart` and `queen`. After `q-u`
the node has children `a` and `e`. Stepping onto `a` is fine. Stepping onto `z` fails
instantly, without checking a single word.

When the current node has `is_word` set, record the word. Then keep going, because a longer
word may extend it — which is why the flag exists rather than terminating the walk.

The cost changes shape entirely. Instead of `words × board_paths`, it is `board_paths` once,
with each path bounded by the trie's depth. And the pruning is what does the work: most grid
paths die within two or three characters, because no dictionary word starts that way.

The standard refinement is to delete words from the trie once found, so later paths stop
exploring branches that can no longer produce anything new.

## Classic problems

- **Implement Trie** — the template, and the one that checks whether you know why `is_word`
  exists.
- **Design Add and Search Words** — supports `.` as a wildcard, which turns lookup into a small
  DFS over children and is the natural step up.
- **Word Search II** — the example above, and the reason to learn the pattern.
- **Longest Common Prefix** — solvable by walking the trie until a node has more than one child
  or is a word, though sorting is simpler for the plain version.
- **Replace Words** — replace each word with the shortest dictionary root that prefixes it,
  which is a walk that stops at the first `is_word`.
- **Maximum XOR of Two Numbers** — a **binary** trie over the bits of each number, where you
  greedily walk toward the opposite bit at every level. The best demonstration that a trie is
  not only for letters.
- **Autocomplete / Search Suggestions System** — collect the subtree under a prefix, usually
  with the top few results cached at each node.
