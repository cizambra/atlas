---
type: razor
title: The wrong abstraction
sidebar_position: 1
family: Design and architecture
defines: [the wrong abstraction, AHA]
sources:
  - "Sandi Metz, 'The Wrong Abstraction' (2016)"
  - "Kent C. Dodds, 'AHA Programming' (2020) — avoid hasty abstractions"
  - "Hunt & Thomas, The Pragmatic Programmer (1999) — DRY, the principle being qualified"
---

## Statement

Duplication is far cheaper than the wrong abstraction.

## In plain terms

Two copies of similar code are annoying, and you can delete one the moment you understand the
pattern. A shared helper that does not quite fit either caller is worse: every new case bends
it further, and by then everything depends on it. Wait until you have seen the pattern enough
times to be sure.

## Decides

Whether to extract shared code now, or copy it again and wait until you can see what
actually varies.

## Why it holds

An abstraction is a claim about what changes and what stays fixed. Made early, from two
examples, that claim is a guess — and two points fit any number of lines.

What makes a wrong guess expensive is the repair path, not the mistake. When a third
caller does not fit, nobody deletes the abstraction; they add a parameter, because the
abstraction is already used and removing it looks like a bigger change. The fourth adds
another. The function accretes flags until its body is a switch over its callers.

Now it is worse than duplication in the specific way that matters: the duplicated
version had four independent things you could change without fear, and the abstracted
version has one thing nobody dares touch.

## Example

Two report generators share about twenty similar lines. Someone extracts
`generateReport(data, options)` and both call it. This looks like progress.

A third report needs the header suppressed, so `options.skipHeader` appears. A fourth
needs a different date format: `options.dateFormat`. A fifth needs the totals row
computed differently, which arrives as a callback.

Two years later the function takes an options object with eleven keys, every caller
passes a different subset, and changing anything requires reading all five call sites
anyway. The shared code saved twenty lines and cost the ability to change any report
independently.

## Limits

This is not a licence for unbounded copying. The rule of three is the counterweight —
duplicate twice, and by the third occurrence you can usually see the real seam. Metz's
point is about *premature* extraction, not about abstraction as such.

It applies to behavioural abstraction, not to genuinely identical facts. A tax rate used
in four places is one fact copied four times, and it should be one constant — the risk
there is inconsistency, not a wrong guess about variation.

The hardest part is the reverse move. Metz's actual advice when you find a wrong
abstraction is to inline it back into its callers and re-extract from there, and teams
resist that because undoing looks like going backwards.

## Source

Sandi Metz's 2016 post 'The Wrong Abstraction' is the source of the phrasing, written
against the tendency to treat DRY as unconditional. Kent C. Dodds later coined
**AHA** — avoid hasty abstractions — for the same idea, and Hunt & Thomas's original
DRY was about knowledge duplication rather than the code-shape duplication it is usually
quoted to forbid.
