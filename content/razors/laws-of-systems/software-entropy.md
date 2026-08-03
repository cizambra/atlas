---
type: razor
title: Software entropy
sidebar_position: 19
family: Laws of systems
defines: [software entropy, the broken window]
sources:
  - "Andrew Hunt and David Thomas, The Pragmatic Programmer (1999)"
  - "James Q. Wilson and George L. Kelling, 'Broken Windows', The Atlantic (1982)"
---

## Statement

One broken window signals nobody is watching, and decay accelerates from there.

## In plain terms

**Software entropy** is the observation that mess is self-reinforcing. **The broken window** — one
commented-out block, one failing test everyone ignores, one function nobody will touch — is not
costly by itself. It is costly because it changes what the next person believes is acceptable, and
the second violation is much easier than the first.

## Decides

Whether to fix a small piece of mess that is not currently causing a problem.

## Why it holds

The mechanism is about norms rather than about code. Engineers read the surrounding code to infer
the standard, and a codebase with no broken windows makes a shortcut feel conspicuous. One that
already has several makes the same shortcut feel normal.

That produces acceleration rather than linear decay. Each violation lowers the threshold for the
next, so the rate of new mess increases with the amount of existing mess — which is why codebases
seem to be fine for a long time and then deteriorate quickly.

The specific case worth naming is the ignored failing test. Once one test is known to be flaky and
routinely ignored, the entire suite's signal value collapses: nobody can distinguish "the usual
failure" from a real one without checking, and checking is what nobody does under time pressure.

The counter is cheap and has to be continuous. Fixing a broken window the day it appears costs
minutes; the same fix after it has licensed twenty others is a project, and by then the project
competes with features.

## Example

A test starts failing intermittently. It is a known flake, the underlying cause is a timing issue
in a fixture, and fixing it properly is about half a day nobody has.

The team adds it to the list of tests you can ignore. Everyone knows which one it is.

Four months later there are six. Nobody knows all six by heart, so the practice becomes "if the
build is red, re-run it, and if it passes the second time, merge." That practice is now the team's
relationship with its entire test suite.

The real cost arrives when a genuine regression fails a test and is re-run, passes on a retry
because the flake pattern is intermittent in both directions, and ships. The suite did its job and
the process had already stopped listening.

Half a day, four months earlier, would have prevented all of it — and at the time it was
indistinguishable from a hundred other half-days that did not matter.

## Limits

It is not an argument for fixing everything you see. A codebase where every engineer stops to
improve every imperfection ships nothing, and [[the boy scout rule]]'s bounded version — leave it
better than you found it, in the area you are already changing — is the workable form.

The broken-windows theory it borrows from is also contested in its original criminological context,
where the empirical support is weaker than the popularity of the metaphor suggests. The software
version stands on its own observations rather than on that research.

And some mess is correctly left alone. A gnarly module that works, is never touched and has no
security exposure is not a broken window in any meaningful sense — the signal only propagates
through code people actually read.

## Source

Hunt and Thomas introduce the idea in *The Pragmatic Programmer*, explicitly borrowing Wilson and
Kelling's 1982 broken-windows metaphor and applying it to codebases: one piece of visible neglect
invites more, and the fix is to repair it immediately rather than to schedule it.

Their practical advice is the part that transfers — if you cannot fix it now, board it up: comment
out the offending code, display a "not implemented" message, or substitute dummy data, so the
damage is visibly contained rather than quietly accepted.
