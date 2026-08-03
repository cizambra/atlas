---
type: razor
title: The boy scout rule
sidebar_position: 20
family: Laws of systems
defines: [the boy scout rule, opportunistic refactoring]
sources:
  - "Robert C. Martin, Clean Code (2008)"
  - "Kent Beck, Extreme Programming Explained (1999) — refactor as you go"
  - "Martin Fowler, 'OpportunisticRefactoring' (2011)"
---

## Statement

Leave the code cleaner than you found it, in small increments nobody has to schedule.

## In plain terms

**The boy scout rule** is the practical answer to [[software entropy]]. Rather than proposing a
cleanup project that will never be funded, improve slightly whatever you are already touching — a
name, a comment that is now wrong, a function that has grown two responsibilities. Small, bounded,
and invisible in planning.

## Decides

What to do about mess you encounter while working on something else.

## Why it holds

Cleanup projects fail for a structural reason: a project whose output is "the same behaviour,
better code" loses every prioritisation conversation to one that adds something. So the improvement
has to happen inside work that is already funded.

**Opportunistic refactoring** also targets correctly. The code you are touching is, by definition,
code that is being changed — which is where the [[technical debt|interest]] is actually being paid.
Cleaning the ugliest module in the system is worth nothing if nobody goes there.

The increments compound in a way scheduled cleanups do not. A team where every change leaves its
area slightly better applies thousands of small improvements a year, continuously, weighted toward
the active parts of the codebase.

And it directly counters the norm effect. Each small repair is a signal that someone is watching,
which is precisely the mechanism the broken window depends on.

## Example

An engineer is adding a field to an order-summary endpoint — a two-hour change in a file that has
grown badly.

The rule does not mean rewriting the file. It means noticing that the function they are editing has
a parameter named `flag`, and renaming it to `include_cancelled`. That the comment above it
describes behaviour that changed a year ago, and deleting it. That the four-line block they are
copying already exists two functions up, and calling it instead.

Fifteen minutes, inside a two-hour change, with no separate ticket and no planning conversation.

Across a team of six, that is a few hundred small repairs a year, concentrated exactly on the files
that get changed most. The comparison is not against a cleanup project that would have done more —
it is against the cleanup project that was proposed twice and never funded.

## Limits

It has to stay bounded, and the failure mode is scope creep. A two-hour change that becomes a
two-day refactor is no longer opportunistic — it is an unplanned project, and it makes the review
harder and the change riskier.

Fowler's guidance is the useful boundary: refactor to make the change you are making easier, and
stop. Separate large refactorings into their own commits, and their own conversation.

It also does not substitute for structural work. Debt too large to fix incrementally needs to ride
along with a funded project, and treating the boy scout rule as the whole strategy leaves the
biggest problems permanently untouched.

And it needs a team norm to work. One person doing it while others do not produces a codebase with
one tidy corner and a reviewer who thinks unrelated changes are noise — the rule is a shared
practice or it is friction.

## Source

Martin states it in *Clean Code*, adapting the scouting rule about campsites, and it has become the
most quoted single line from the book.

The practice predates the phrase: Beck's Extreme Programming had continuous refactoring as a core
discipline, and Fowler's later writing on opportunistic refactoring supplies the boundary condition
that keeps it from becoming unbounded rework.
