---
type: razor
title: Goodhart's Law
section: razors
family: Decision and judgment
defines: [Goodhart's Law]
illustration: img/goodhart-divergence.svg
illustration_alt: "A chart over time. Before the team is measured on time-to-close, the measure and the goal move together, both flat. After, time-to-close improves sharply while customers actually helped gets worse."
illustration_caption: "The support-team example. While nobody is judged on it, time-to-close is a fair read on whether customers get helped. Once it becomes the target, agents close unresolved tickets — the measure improves and the thing it stood for gets worse."
illustration_credit: "Authored for this atlas"
sources:
  - "Charles Goodhart, 'Problems of Monetary Management: The U.K. Experience' (1975)"
  - "Marilyn Strathern, 'Improving Ratings: Audit in the British University System' (1997) — the standard phrasing"
  - "Donald T. Campbell (1976) — the same effect, independently, as Campbell's Law"
---

## Statement

When a measure becomes a target, it stops being a good measure.

## Decides

Whether to attach a goal, an incentive, or a performance review to a particular number —
and what to hold back if you do.

## Why it holds

A metric is almost never the thing you actually care about. It is a proxy that happened
to move together with the real goal, across the behaviours people were exhibiting at the
moment somebody picked it.

Applying pressure changes which behaviours people exhibit. The new ones sit outside the
range where that correlation was ever observed, so the proxy and the goal come apart
precisely where the pressure was applied.

The decay is therefore not evidence of bad faith. Nobody has to be gaming anything — the
measure simply stops carrying the information it used to carry.

## Example

A support team is measured on time-to-close. Close time drops 40% in a quarter.

What happened is that agents learned to close tickets that were not resolved, because a
reopened ticket starts a fresh clock. Customers now file three tickets where they used
to file one. Satisfaction falls while the dashboard improves.

Nobody cheated. Time-to-close was a decent proxy for "customers get helped quickly"
right up until it became the thing people were judged on.

## Limits

It does not apply to measures that *are* the goal rather than a proxy for it. Revenue is
not a proxy for revenue, and a rocket's altitude is not a proxy for altitude.

It also does not say stop measuring, which is how it is most often misused. It says do
not let one measure be both the target and the only evidence: pair it with a guardrail
metric that moves the wrong way when the proxy is being exploited, or with a sample
nobody is allowed to optimise against.

## Source

Charles Goodhart, 1975, writing about monetary policy: "Any observed statistical
regularity will tend to collapse once pressure is placed upon it for control purposes."
The compressed phrasing everyone quotes is Marilyn Strathern's, from 1997. Donald
Campbell described the same effect independently in 1976, which is why the
social-science version travels under the name Campbell's Law.
