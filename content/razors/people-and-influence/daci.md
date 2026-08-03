---
type: razor
title: DACI
sidebar_position: 15
family: People, organization, influence
defines: [DACI, driver, approver]
sources:
  - "Intuit, DACI framework (1980s)"
  - "Atlassian, decision-making playbook (2015–)"
  - "RACI, the older and more common variant"
---

## Statement

Driver, approver, contributors, informed — naming the approver is what stops a decision drifting.

## In plain terms

**DACI** assigns four roles to a decision: the **driver** moves it forward, the **approver** decides
— singular, deliberately — contributors supply input, and the informed are told the outcome. The
whole value is in the second role, because a decision with no named approver does not get made, it
fades.

## Decides

Who does what on a decision that involves several people.

## Why it holds

Decisions without a named decider do not close. Discussion continues, positions are restated, and
eventually attention moves elsewhere — leaving everyone acting on their own reading, which is worse
than either outcome.

The singular approver is the load-bearing constraint. Two approvers is a negotiation with no
tiebreak, and a group approver means nobody in particular — so the discipline is naming one person
who can end it.

Separating driver from approver is the second useful distinction. The person doing the work of
gathering input and writing it up is frequently not the person who should decide, and conflating
them either overloads a senior person or gives a junior one a call they should not make.

Contributors are consulted rather than deciding, and being explicit prevents the most common
friction: someone who believed they were an approver discovering they were a contributor, after the
fact.

The informed list is the cheapest of the four and the most often skipped. Most complaints about
decisions being made without people are complaints about not being told, and naming who gets
notified resolves them without expanding the decision.

## Example

A decision about which message broker to standardise on has been discussed for six weeks across
three meetings.

Every meeting produces good discussion and no decision. Two people believe they are deciding, four
believe they are being consulted, and one senior engineer believes they have a veto they have never
been given.

The discussion is not the problem — the positions are well understood and the tradeoffs are clear.
What is missing is anyone with the standing to say it is settled.

DACI takes ten minutes to assign:

- **Driver** — the platform engineer who has been running the meetings
- **Approver** — the platform director, singular
- **Contributors** — the four teams with strong preferences, and the senior engineer with the veto
  he did not have
- **Informed** — everyone else, afterwards

The decision closes in four days. The driver writes up the options and a recommendation, the
contributors comment in writing, and the approver decides — which takes twenty minutes because the
analysis was already done six weeks ago.

The six weeks were not spent deciding. They were spent in a room where nobody could end it.

## Limits

It is bureaucratic for small decisions and applying it universally is worse than not having it. Most
decisions have an obvious owner and need no framework.

The frameworks also proliferate confusingly. RACI, RAPID, DACI and their variants differ in ways
that matter less than picking one and using it consistently — and arguing about which is a
displacement activity.

And assigning an approver does not create authority. Naming someone who cannot actually make the
call, or who will be overruled, produces a decision that reopens — so the assignment has to reflect
where the authority genuinely sits.

## Source

DACI originated at Intuit in the 1980s and was popularised more recently through Atlassian's
published playbooks, which is where most engineering teams encounter it.

The older and more widespread variant is RACI — responsible, accountable, consulted, informed — and
the practical difference is emphasis: RACI is oriented toward task ownership, DACI toward closing a
decision, which is why the approver role is more prominent.
