---
type: razor
title: The inverted pyramid
sidebar_position: 4
family: Communication
defines: [inverted pyramid]
sources:
  - "Newspaper practice, from the American Civil War telegraph era onward"
  - "Jakob Nielsen, 'Inverted Pyramids in Cyberspace' (1996)"
---

## Statement

Write so an editor can cut from the bottom without losing anything essential.

## In plain terms

The **inverted pyramid** orders content by decreasing importance: the most essential material first,
then supporting detail, then background. The test is mechanical — an editor can delete any number of
paragraphs from the end and what remains is still complete and correct.

## Decides

How to order material within a document when you do not control how much of it gets read.

## Why it holds

It is a structure designed for a reader who stops at an unknown point. Since you cannot know where
that is, the only robust strategy is to make every prefix of the document a complete, shorter
version of it.

The newspaper origin is literal. Telegraph transmission could be cut off mid-story, and later,
column space was decided after writing — so a story that degraded gracefully from the bottom was an
operational requirement rather than a style.

The same constraint applies to almost all workplace writing, for different reasons. Readers skim,
get interrupted, read on a phone, or read only what fits above the fold — and every one of those is
a cut from the bottom.

It also composes with [[bottom line up front|BLUF]] and the [[pyramid principle]] rather than
competing with them. BLUF is about the first sentence, the pyramid is about logical structure, and
the inverted pyramid is about the ordering *within* each level — most important first, all the way
down.

The discipline it enforces is ranking. Ordering by importance requires deciding what is most
important, which is a decision writers frequently avoid by ordering chronologically instead.

## Example

An incident summary written both ways.

Chronologically: at 14:02 the deploy pipeline started; at 14:07 the new version reached the first
region; at 14:11 error rates in that region began climbing; at 14:19 an alert fired; at 14:24 the
on-call engineer acknowledged; at 14:31 the rollback began; at 14:38 error rates recovered.

A reader who stops after two sentences knows that a deploy happened. That is the least useful
possible summary of a 36-minute outage.

Inverted: "Checkout was unavailable for about 30% of users for 36 minutes on Tuesday afternoon,
caused by a config change that was rolled back. No data was lost. Full timeline and remediation
below."

A reader who stops after one sentence has the scope, the cause and the resolution. One who reads
two more has the impact assessment. One who reads to the end has the timeline, which is where the
chronological version put the least important material first.

The timeline still belongs in the document. It belongs at the bottom, where cutting it costs the
reader nothing they needed.

## Limits

It is wrong where the sequence is the content. A tutorial, a debugging narrative or a postmortem's
analysis section needs chronology, because the order is what the reader is learning.

It also produces repetitive prose at length. Each section restating context in decreasing detail
reads as circling, which is why the pattern suits short documents and news better than long
technical ones.

And it can strip nuance from complex arguments. A claim whose qualifications are essential is
misrepresented by its first sentence, and putting the caveat three paragraphs down means most
readers never see it.

## Source

The structure emerged in nineteenth-century American journalism, commonly attributed to the
unreliability of telegraph transmission during the Civil War, though historians debate how directly.
Its persistence owes more to editing economics: stories were cut to fit from the bottom.

Nielsen's 1996 work brought it into web writing, with eye-tracking evidence that online readers scan
rather than read and abandon early — which made the newspaper constraint apply to almost everything
published since.
