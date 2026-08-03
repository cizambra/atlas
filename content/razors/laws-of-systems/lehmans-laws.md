---
type: razor
title: Lehman's laws of software evolution
sidebar_position: 18
family: Laws of systems
defines: [Lehman's laws, continuing change, increasing complexity, declining quality]
sources:
  - "Meir M. Lehman, 'Programs, Life Cycles, and Laws of Software Evolution' (1980)"
  - "Lehman and Belady, Program Evolution (1985)"
---

## Statement

A used system must keep changing or become less useful, and each change raises its complexity
unless work is spent reducing it.

## In plain terms

**Lehman's laws** describe what happens to software that people actually use. It cannot be
finished: the world it models keeps moving, so a system that stops changing becomes progressively
less useful without anyone touching it. And every change makes it more complex unless someone
deliberately spends effort the other way.

## Decides

How to budget for a system's whole life rather than only its construction.

## Why it holds

The three that matter most in practice are the first, second and seventh.

**Continuing change**: a program used in a real environment must be continually adapted or it
becomes progressively less satisfactory. The system does not degrade — the environment moves, and
the fit degrades. This is why a service nobody has touched in three years is not stable, it is
drifting.

**Increasing complexity**: as a system evolves, its complexity increases unless work is done to
maintain or reduce it. Each change is made under local pressure, and local decisions accumulate
into global disorder. The complexity is not a failure of discipline, it is the default.

**Declining quality**: a system will be perceived as declining in quality unless rigorously
maintained and adapted, for the same reason as the first — the standard it is judged against keeps
rising.

The practical consequence is that maintenance is not the cost of having built it badly. It is the
cost of it continuing to be used, and a plan that treats it as a temporary phase after launch has
mis-budgeted the whole life of the system.

## Example

A reporting service ships and works. It is well built, well tested, and needs no changes, so the
team moves on.

Nothing happens to it for three years and it gets worse the entire time:

- the company adds two product lines it has no concept of
- a new tax jurisdiction appears
- the database it queries gains three columns it ignores
- the library versions it pins accumulate CVEs
- users who joined last year compare it to tools built since, and find it clumsy

No line of its code changed and every one of those is a real reduction in fitness. The system is
now described as legacy, which people read as a comment on how it was built and is actually a
description of how long it has been still.

The rewrite that eventually replaces it will begin the same cycle, and the only thing that changes
the outcome is a standing budget for adaptation rather than a plan that ends at launch.

## Limits

The laws were derived from large, long-lived systems in commercial use — OS/360 and similar — and
they do not describe everything. A small utility with a fixed scope and no external dependencies
can genuinely be finished.

They are also empirical generalisations rather than mechanisms. They tell you what tends to happen,
not why a particular system is degrading, and treating them as an explanation stops the
investigation early.

And "increasing complexity" is not inevitable in the strong sense. The law says complexity rises
*unless work is done to reduce it*, which is the actionable half — deletion, consolidation and
[[the boy scout rule]] are what the clause is pointing at.

## Source

Lehman began the work at IBM in the late 1960s, studying the release history of OS/360, and
developed the laws with Belady over the following two decades. The list grew from three to eight as
the empirical base widened.

The framing that has aged best is the classification underneath them: S-programs solve a formally
specified problem and can be finished; P-programs approximate one; E-programs operate in the real
world and change it by existing — and only E-programs are subject to the laws.
