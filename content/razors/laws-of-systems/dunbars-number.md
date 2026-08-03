---
type: razor
title: Dunbar's number
sidebar_position: 23
family: Laws of systems
defines: [Dunbar's number]
sources:
  - "Robin Dunbar, 'Neocortex size as a constraint on group size in primates' (1992)"
  - "Robin Dunbar, How Many Friends Does One Person Need? (2010)"
  - "Patrik Lindenfors et al., replication critiques (2021)"
---

## Statement

Stable relationships cap out around 150, which is why organisations need structure at that size
rather than more goodwill.

## In plain terms

**Dunbar's number** is the claim that people can sustain roughly 150 meaningful relationships, with
tighter circles inside it — about 5 close, 15 trusted, 50 familiar. The engineering-relevant part
is what happens past those thresholds: coordination that ran on personal relationships stops
working, and something structural has to replace it.

## Decides

When informal coordination will stop working, and what to put in its place.

## Why it holds

Below the limit, coordination is cheap and invisible. Everyone knows who owns what, who to ask, and
what is happening — because they know each other, and the information moves without any mechanism.

Past it, that stops silently. The failure is not that people become uncooperative; it is that
nobody can hold the map any more, so the questions that used to be answered in a corridor now have
no answer at all.

The smaller thresholds bite first and are more actionable. Around 5 is the size of a group that can
work with no process at all. Around 15 is where a team starts needing explicit roles. Around 50 is
where an organisation needs written ownership rather than "ask Sam".

Which gives the practical form of the razor: crossing a threshold requires new structure, and the
usual mistake is treating the symptoms — things falling between teams, duplicated work, decisions
nobody knew about — as a culture problem to be solved with more communication.

## Example

An engineering organisation grows from 40 to 120 over eighteen months, and coordination visibly
deteriorates.

The symptoms are the classic ones:

- two teams build the same internal tool
- a breaking change ships with no notice, because the author did not know who consumed it
- three services have no owner after a reorganisation
- decisions get made twice, because nobody knew the first one happened

The diagnosis offered internally is cultural: people are not communicating, so the response is more
all-hands meetings, a wider Slack channel and a request that everyone be more collaborative.

None of it works, because none of it is a substitute for what was lost. At 40, everyone knew who
owned what; at 120 nobody can, and the fix is structural — a service catalogue with named owners, a
written interface-change process, a decision record, and explicit team boundaries.

The organisation did not become less collaborative. It crossed a threshold where collaboration
alone stops being sufficient.

## Limits

The number itself is contested. Dunbar derived it from a correlation between neocortex size and
group size across primates, and later replication attempts — notably Lindenfors and colleagues in
2021 — argue the confidence intervals are far too wide to support a specific figure.

Which means it should be used as an order of magnitude rather than a threshold. "Around a hundred
and something" is defensible; treating 150 as a precise limit is not supported by the evidence.

It also describes personal relationship capacity rather than organisational capability.
Organisations of many thousands function, precisely because they replace relationships with
structure — the law says structure becomes necessary, not that scale becomes impossible.

## Source

Dunbar published the neocortex correlation in 1992 and has developed the layered model — 5, 15, 50,
150, 500, 1500 — in subsequent work, with supporting data from hunter-gatherer group sizes, military
company sizes and Christmas card lists.

The critique is worth knowing alongside it: the primate regression has very wide error bars, and
several replications find no clear support for a single cognitive limit. The layered *shape* has
held up better than the specific numbers.
