---
type: razor
title: Worse is better
sidebar_position: 8
family: Design and architecture
defines: [worse is better, the right thing]
sources:
  - "Richard P. Gabriel, 'Lisp: Good News, Bad News, How to Win Big' (1991)"
  - "Richard P. Gabriel, 'Worse Is Better' retrospectives (1992–2000)"
---

## Statement

A simpler, less complete design often wins, because it ships, spreads, and gets fixed in the field.

## In plain terms

**Worse is better** compares two design philosophies. **The right thing** prioritises correctness,
completeness and consistency, and takes longer. The New Jersey style prioritises implementation
simplicity, ships earlier, and handles fewer cases correctly — and Gabriel's uncomfortable
observation is that the second one usually wins.

## Decides

Whether to ship the simpler design that handles 90% of cases or wait for the complete one.

## Why it holds

Gabriel's argument is about propagation rather than quality. A simple implementation is easier to
port, easier to understand, and easier to build on — so it spreads to more places, acquires more
users, and gets improved by more people.

The 90% solution shipping now beats the 100% solution shipping in a year, because the 90% version
accumulates users who then fix the remaining 10% for their own reasons. The complete version arrives
into a market that has already standardised.

Simplicity of implementation also compounds differently from simplicity of interface. The right
thing keeps the interface clean by pushing complexity into the implementation; the New Jersey style
lets the interface be slightly worse so the implementation stays simple — and it is the
implementation that determines who can port, extend and debug it.

The canonical illustration in the paper is a system call interrupted by a signal. The right thing
completes or backs out atomically, which is correct and requires complex kernel work. The New
Jersey answer returns an error and makes the *caller* handle the retry — worse for every user,
simpler in the kernel, and it is what Unix did.

## Example

Two teams build an internal job scheduler.

The first designs it properly: exactly-once semantics, distributed coordination, dependency graphs,
backfills and a full consistency model. Nine months, and it is genuinely better along every
dimension anyone can name.

The second ships in three weeks, handling about 85% of what teams need. At-least-once delivery, so
jobs must be idempotent; no dependency graph, so chain them yourself; a single coordinator, so it
has a real failure mode.

Six months later, eleven teams use the simple one. They wrote idempotent jobs because they had to,
several contributed fixes, and someone added a dependency feature because they needed it. It is now
the de facto standard, and its rough edges have been sanded by people who hit them.

The complete scheduler arrives into that. It is better, and switching now means migrating eleven
teams away from something that works, which is a cost nobody will pay for the improvement.

## Limits

It is a description of what tends to happen, not a recommendation to build badly. Gabriel himself
has argued both sides across several essays and has never settled on which philosophy he endorses.

The dynamic also depends on the domain. Where the missing 10% is a security property, a correctness
guarantee in a financial system, or a safety requirement, "get fixed in the field" is not an
acceptable plan and the right thing is the only thing.

And it is frequently used to excuse work that is simply unfinished. The New Jersey style is
deliberate simplicity with the compromises named — not a project that shipped early and hoped.

## Source

Gabriel introduced the framing in a 1991 essay about why Lisp — designed as the right thing — was
losing to C and Unix, designed the other way. He wrote it partly as a provocation, publishing a
rebuttal under a pseudonym and returning to the question repeatedly over the following decade
without resolving it.

The essay is most useful read as an explanation of how adoption actually works rather than as
design advice, which is closer to how Gabriel eventually described it himself.
