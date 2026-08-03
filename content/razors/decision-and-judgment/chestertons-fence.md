---
type: razor
title: Chesterton's fence
sidebar_position: 4
family: Decision and judgment
defines: [Chesterton's fence]
sources:
  - "G. K. Chesterton, The Thing (1929)"
---

## Statement

Do not remove a fence until you know why it was put there.

## In plain terms

**Chesterton's fence** says that finding something pointless is not the same as it being
pointless. The odd check, the redundant field, the step everyone works around — each was put
there by someone solving a problem. Find out which problem before deleting it, because the
problem probably did not go away.

## Decides

Whether to remove something you did not build and do not understand — a check, a constraint,
a process step, a service nobody can explain.

## Why it holds

Code and process both accumulate responses to specific incidents, and the incident is rarely
recorded next to the response. What survives is a rule that looks arbitrary, because the thing
it prevents has not happened since — precisely because the rule is there.

That produces a systematic bias. Anything working correctly is invisible, so the fences you
notice are disproportionately the ones you cannot see a reason for, and the absence of a visible
reason is weak evidence that there is none.

The asymmetry in cost seals it. Investigating takes an hour: read the blame, find the ticket, ask
the person who has been there longest. Removing something load-bearing costs an incident, and you
will not know it was load-bearing until it fails.

## Example

A service has a check rejecting orders over £10,000. Nothing in the code explains it, the
threshold is a magic number, and it fires about twice a month — always on legitimate orders that
support then processes manually.

The obvious read is that someone added a cautious limit years ago and never removed it. Deleting
it removes a manual step and unblocks two enterprise customers.

Twenty minutes of investigation finds the ticket. In 2021 a pricing bug produced orders in the
wrong currency, and a £900 order arrived as £90,000 and was fulfilled. The check was the
containment, and the pricing bug was fixed the following month.

So the fence is genuinely obsolete — and that is the conclusion you reach *after* looking, not
instead of looking. The version where you delete it first is indistinguishable right up until the
month it was still needed.

## Limits

It is not an argument for keeping everything. The razor says find out why, not leave it alone, and
using it to block all removal is how systems accumulate rules nobody understands.

The investigation has to be bounded. Where the history is genuinely unrecoverable — the people
have gone, the tickets are in a dead system — the honest move is a bounded experiment rather than
an indefinite search: remove it behind a flag, watch, and be able to put it back.

It also inverts under a different asymmetry. If keeping the fence is expensive and removing it
fails loudly and reversibly, testing the removal is cheaper than the archaeology.

## Source

Chesterton's 1929 essay collection *The Thing* gives the parable directly: a reformer finds a
fence across a road and proposes clearing it away. The more intelligent reformer replies that if
you cannot see the use of it, he certainly will not let you clear it away — go and think, and when
you can tell him you do see the use of it, he may allow you to destroy it.

His subject was social reform rather than software, and the transfer is exact: the argument is
about the epistemic position of the person proposing the removal, not about the fence.
