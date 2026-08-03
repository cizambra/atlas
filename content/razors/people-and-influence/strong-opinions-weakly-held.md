---
type: razor
title: Strong opinions, weakly held
sidebar_position: 20
family: People, organization, influence
defines: [strong opinions weakly held]
sources:
  - "Paul Saffo, 'Strong Opinions, Weakly Held' (2008)"
  - "Michael Natkin, 'Strong Opinions Loosely Held Might Be the Worst Idea in Tech' (2019)"
---

## Statement

Intended as a forecasting discipline; in practice it licenses confident noise, because the strong
half is louder than the weak half.

## In plain terms

**Strong opinions weakly held** was Saffo's method for forecasting under uncertainty: commit to a
hypothesis so you can test it, then abandon it the moment evidence arrives. In practice the phrase
has become a licence for asserting things confidently and treating the retraction as optional.

## Decides

Whether to use the phrase, and what discipline it was supposed to name.

## Why it holds

Saffo's original argument is sound and is about forecasting mechanics. A weak hypothesis produces no
testable prediction, so you learn nothing; a strong one is falsifiable, and the point of holding it
strongly is that you can find out you are wrong quickly.

The discipline is entirely in the second half. It requires actively seeking disconfirmation, changing
your mind visibly when it arrives, and treating the abandonment as a success rather than an
embarrassment.

The failure is asymmetric in a way the phrase does not survive. Strong opinions are audible and
weakly-held is a private property — nobody can observe that you would have changed your mind, so in
a group the phrase reads as permission for the confident half.

It also interacts badly with power. A senior person's strongly-stated opinion shapes the discussion
regardless of how weakly they hold it, and the people who would supply the disconfirming evidence
are the ones least able to.

Natkin's critique is that it selects for the loud over the careful. The people who thrive under the
convention are those comfortable asserting without evidence, and the people it silences are those
who would have said "I think, though I'm not sure" — which is more honest and reads as weaker.

The version worth keeping is the calibration underneath: state a position, state your confidence in
it, and state what would change your mind. That is the discipline Saffo meant, and it does not have
the failure mode.

## Example

A design review where the phrase is the norm.

A senior engineer states that the queue-based approach will not scale, confidently, as an opinion
they are open to revising. Two junior engineers who have relevant experience with the alternative say
nothing, because contradicting a confident senior assertion is expensive and the invitation to do so
was implicit.

The discussion proceeds on the assertion. It is never tested, and it turns out to be wrong — which
nobody discovers for four months, because the opinion was weakly held in the speaker's head and
strongly held in the room.

The calibrated version says the same thing differently: "My instinct is the queue will not scale
past about 5,000 messages a second — I am maybe 60% on that, and what would change my mind is a
benchmark on our message sizes."

That is the same opinion with the confidence attached and the disconfirmation named. It invites the
benchmark rather than deference, it is checkable, and someone with contrary experience now has a
specific thing to contradict rather than a person.

## Limits

The critique can overcorrect. Excessive hedging is its own failure — a room where nobody will state
a position produces slow, unfalsifiable discussions, and Saffo's original point about the value of
committed hypotheses is correct.

The phrase also works in some settings, particularly among peers with equal standing and a strong
norm of changing their minds publicly. The failure is about power gradients rather than about the
idea.

And the alternative requires calibration people mostly do not have. Stating "60% confident" is only
useful if your 60% means something, and most people's do not — which is a reason to practise it
rather than to avoid it.

## Source

Saffo published the essay in 2008 describing his forecasting practice at the Institute for the
Future: form a strong opinion quickly to have something to test, then attack it and discard it as
evidence accumulates.

Natkin's 2019 critique is the most cited counter-argument, focusing on how the convention plays out
in engineering organisations with unequal standing — and the general drift since has been toward
stating confidence explicitly rather than performing conviction.
