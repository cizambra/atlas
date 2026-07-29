---
type: concept
title: Senior to staff — what to stop doing
section: staff
group: The first 90 days
summary: Staff engineering is accountable for outcomes larger than one person can build, which changes what your own hands should be doing.
razors: []
next: []
sources:
  - "Will Larson, Staff Engineer: Leadership Beyond the Management Track (2021)"
  - "Tanya Reilly, The Staff Engineer's Path (2022)"
  - "Tanya Reilly, 'Being Glue' (2019)"
  - "Michael Watkins, The First 90 Days (2003)"
---

## The model

Staff engineer is the first level where the job is defined by scope rather than output.
A senior engineer is accountable for their own work landing; a staff engineer is
accountable for outcomes spanning more work than one person can do.

That is an arithmetic constraint, not a philosophy. Once what you are accountable for
exceeds what you can personally build, time spent building is time not spent on the
part only you can do.

## Decide it

1. **Would this still get done, roughly as well, if I did not do it?** If yes, it is
   probably not yours.
2. **Does doing it myself build anyone else's capability?** Work that grows another
   person is worth your time even when you are slower at it.
3. **Is this the highest-leverage use of the one thing I have that nobody else does —
   context across teams?**

## Why it's true

The shorthand is that the transition is subtractive before it is additive. You do not
begin by adding staff behaviours; you begin by removing the senior ones that no longer
fit, and the gap that opens is what the new work fills. Nobody tells you to stop,
because from the outside it still looks like your best work.

### The archetypes all point away from the keyboard

Larson's four staff archetypes — tech lead, architect, solver, right hand — differ in
almost everything, but they share one property. The bottleneck on their work is never
typing speed; it is deciding what should be built and getting other people to agree.

### But not all invisible work is waste

Reilly's "glue work" is the necessary counterweight. Some of the least glamorous
coordination — noticing the gap between two teams, writing the document nobody owns —
is precisely the job rather than a distraction from it.

So the razor is not "stop doing unglamorous work." It is narrower, and harder: stop
doing work whose only justification is that you happen to be fast at it.

### Why the pull is so strong

The failure reinforces itself. Implementing is legible and immediately rewarding — a
merged PR, a green build, something visible today. Direction-setting pays off on a lag
of months, and often the payoff is a bad thing that quietly did not happen.

That asymmetry means the feedback loop actively pulls you toward the wrong behaviour.
Left alone you drift back to the keyboard, and the drift feels like productivity the
entire time it is happening.

## Worked example

A newly promoted staff engineer is three weeks into a migration spanning four teams.
The riskiest piece — rewriting the dual-write path — is unassigned, so they take it,
because they are the fastest implementer available and the deadline is real.

That is the wrong call, and it is wrong in a specific way. For three weeks they are
unavailable to the four teams whose sequencing nobody is holding, and the one engineer
who could have learned the dual-write path does not learn it.

The alternative is not "delegate and walk away." It is to move the work while staying
on the hook for the outcome: "I will pair with you on the first dual-write, then you
own it and I review. I will be in the room for the cutover. If it slips, that is on me,
not you."

The last sentence is the one to notice. Taking the ticket keeps you accountable by
doing; saying "if it slips, that is on me" keeps you accountable without doing, and
that is the whole transition compressed into one line.

## Next

Days 1–30, picking the wedge, and the traps are the pages that follow — this one is
what to stop, and those are what to start.
