---
type: razor
title: Hanlon's razor
sidebar_position: 6
family: Decision and judgment
defines: [Hanlon's razor]
sources:
  - "Folk aphorism; commonly attributed to Robert J. Hanlon (1980), with earlier variants"
  - "Lee Ross, 'The Intuitive Psychologist and His Shortcomings' (1977) — the fundamental attribution error"
---

## Statement

Never attribute to malice what is adequately explained by missing context.

## In plain terms

**Hanlon's razor** says that when someone does something that looks deliberately unhelpful, the
likeliest explanation is that they did not know. They had not seen the document, were not in the
meeting, had a constraint you cannot see, or were solving a different problem. Assuming intent
where there was only ignorance produces conflicts that had no cause.

## Decides

How to interpret an action by a colleague or another team that appears hostile, obstructive or
careless.

## Why it holds

Actions are visible and reasons are not. You see what someone did and infer why, and the
inference is made from your own information rather than theirs — which is the fundamental
attribution error operating on a colleague.

The base rates favour it. Organisations run on incomplete information constantly: people miss
meetings, documents go unread, decisions are made in rooms others were not in. Deliberate
undermining is rare and expensive to sustain; being uninformed is free and universal.

The asymmetry in response cost is what makes it a razor rather than an observation. Assuming
missing context and being wrong costs one conversation. Assuming malice and being wrong costs a
working relationship, and it is very hard to undo.

## Example

A platform team ships a breaking change to a shared client library with no notice. Three teams
find out when their builds fail on Monday morning.

The immediate read is that platform does not care about downstream consumers, and there is
evidence: this is the second time this year. The natural response is an angry message and an
escalation.

What actually happened is that the announcement went to a channel two of the three teams had left
during a reorganisation, and the platform engineer believed it had been sent. The list of
consumers was maintained by hand and had not been updated in eight months.

The malice reading produces a fight and no fix. The missing-context reading produces the actual
correction — an automated consumer list and a build-time deprecation warning — and it is
available in one conversation rather than after a week of escalation.

## Limits

It is a first hypothesis, not a permanent stance. Repeated behaviour after the context has been
supplied is evidence of something other than ignorance, and continuing to assume good faith at
that point is how patterns get tolerated far too long.

It is also frequently misapplied to systems. When the same failure keeps happening, the useful
explanation is usually structural — no ownership, no notification path, wrong incentives — and
"nobody meant it" can become a way of never fixing the mechanism.

And it should not be used to dismiss impact. Intent and effect are different questions: an action
can be entirely innocent and still have cost three teams a morning, and both halves deserve
saying.

## Source

The phrasing is usually credited to Robert J. Hanlon, who submitted it to a 1980 joke collection,
though close variants appear earlier — including in Goethe and in a 1774 letter. The underlying
psychology is better documented: Lee Ross named the fundamental attribution error in 1977, and the
bias it describes is why the razor is needed at all.
