---
type: razor
title: Goodhart's Law
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

You rarely get to measure the thing you actually want. Nobody can count "customers got
helped," so you count something you can — how fast tickets close — and check that the two
move together. They do. The number goes up on a dashboard.

But that check was run while nobody was trying to move the number. It tells you how things
worked when the number was still a readout, not a target.

Put a bonus on it and people start looking for the shortest path to it. Those routes are
new. Nothing you saw when you picked the number tells you the link holds along them,
because nobody was taking them yet.

So the number climbs and the thing it stood for does not. Nobody had to cheat for that to
happen. The measure was not corrupted — it just stopped being about the thing.

## Example

Take a support team measured on time-to-close. Close time drops 40% in a quarter.

Here is the shortest path they found. Closing a ticket that is not actually resolved ends
the clock, and when the customer comes back it starts a fresh one. Customers now file
three tickets where they used to file one. Satisfaction falls while the dashboard improves.

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
