---
type: pattern
title: Intervals
sidebar_position: 8
group: Algorithms
summary: Sort by start, then sweep — almost every interval problem is that, plus one decision about what to do on overlap.
defines: [interval, overlap condition, merge intervals, sweep line, meeting rooms]
razors: []
prereq: [complexity]
---

## The model

An **interval** is a start and an end. Problems ask you to merge them, count overlaps, insert
one, or find a gap.

Nearly all of them dissolve the same way: sort by start, then walk through once, comparing each
interval to what you are currently holding. The sort is what makes a single pass sufficient,
because it guarantees that anything overlapping the current interval must come next rather
than arbitrarily later.

## Recognise it

Reach for this when the input is a list of ranges — times, segments, bookings, versions — and:

- You must **merge** overlapping ranges into consolidated ones.
- You need to know whether ranges **conflict** — can one person attend all meetings?
- You need the **maximum concurrent** count — how many rooms are needed at once.
- You must **insert** a range into a sorted set of them, or **remove** an intersection.
- The problem mentions start and end times of anything.

The two facts to have at hand before writing anything:

- **Overlap condition:** intervals `a` and `b` overlap when `a.start <= b.end and b.start <=
  a.end`. Getting this backwards is the most common bug in the whole pattern.
- **Sorting key:** by **start** for merging, by **end** for scheduling the most non-overlapping
  intervals. That difference decides several problems on its own.

## The template

```python
# Merge overlapping intervals — sort by START
def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    out = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= out[-1][1]:              # overlaps the one we are holding
            out[-1][1] = max(out[-1][1], end)   # max — the current may be nested
        else:
            out.append([start, end])
    return out

# Maximum concurrent — the sweep line
def max_concurrent(intervals):
    events = []
    for start, end in intervals:
        events.append((start, 1))            # +1 on start
        events.append((end, -1))             # -1 on end
    events.sort()                            # ends sort before starts at equal time
    best = running = 0
    for _, delta in events:
        running += delta
        best = max(best, running)
    return best

# Most non-overlapping intervals — sort by END
def max_non_overlapping(intervals):
    intervals.sort(key=lambda x: x[1])
    count, last_end = 0, float('-inf')
    for start, end in intervals:
        if start >= last_end:
            count, last_end = count + 1, end
    return count
```

The `max(out[-1][1], end)` matters: an interval can be entirely inside the one you are
holding, and taking the new end unconditionally would shrink the merged range.

## Why it works

Sorting costs `O(n log n)` and the sweep is `O(n)`, so the sort dominates and every problem in
this family is `O(n log n)` time and `O(n)` space for the output. Saying "the sort dominates"
is the whole complexity answer, and it is worth stating rather than deriving each time.

The reason one pass suffices after sorting is an ordering argument. Once intervals are sorted
by start, every interval that could overlap the one you are holding must appear next — nothing
later can start earlier. So you never need to look backwards, and each interval is examined
once.

The **sweep line** generalises this. Rather than thinking about intervals, think about events
on a timeline: a start adds one to a running count and an end subtracts one. The maximum of
that running count over time is the maximum concurrency, and the whole problem becomes sorting
events and adding numbers.

One detail in the sweep decides correctness at boundaries. When an interval ends exactly as
another begins, do they conflict?

For meeting rooms they do not — one ends at 10:00 and the next starts at 10:00, needing one
room. Sorting so that end events come before start events at equal timestamps encodes that,
and the opposite convention is right where touching counts as overlapping. Asking which
applies is a legitimate clarifying question.

## Worked example

"How many meeting rooms are needed?" for meetings `[0,30]`, `[5,10]`, `[15,20]`.

The instinct is to merge and count, which gives the wrong answer — merging yields one range
`[0,30]`, suggesting one room, when the true answer is two.

The sweep line gets it right by ignoring intervals and looking at events. Six events:
`(0,+1)`, `(30,−1)`, `(5,+1)`, `(10,−1)`, `(15,+1)`, `(20,−1)`.

Sorted by time: `(0,+1)`, `(5,+1)`, `(10,−1)`, `(15,+1)`, `(20,−1)`, `(30,−1)`.

Now sweep. At 0 the count is 1, and at 5 it is 2 — the new peak.

At 10 it drops to 1. At 15 it rises to 2 again, matching the peak. At 20 it is 1, and at 30
it is 0.

The maximum is 2, so two rooms. The `[0,30]` meeting overlaps both of the others, but the
others never overlap each other, so two rooms serve all three.

That is the insight the problem is testing. Merging asks "which ranges are connected"; the
sweep asks "how many are active at once", and those are different questions that look
identical until you find an example separating them. Cost is `O(n log n)` for the sort of `2n`
events and `O(n)` space.

## Classic problems

- **Merge Intervals** — the base case, sorted by start.
- **Insert Interval** — the same merge with a single new element, doable in `O(n)` without
  re-sorting, which is the follow-up.
- **Non-overlapping Intervals** — minimum removals to eliminate conflicts, and the problem
  where sorting by **end** is what makes the greedy choice correct.
- **Meeting Rooms** — do any two conflict? One pass after sorting.
- **Meeting Rooms II** — the sweep above, or equivalently a min-heap of end times.
- **Interval List Intersections** — two sorted lists walked with [[two pointers]], where the
  intersection is `max(starts)` to `min(ends)`.
- **Employee Free Time** — merge everything, then report the gaps, which is the pattern read
  inside-out.
- **My Calendar I/II/III** — the online version, where intervals arrive one at a time and a
  sorted structure replaces the up-front sort.
