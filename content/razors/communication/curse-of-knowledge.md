---
type: razor
title: The curse of knowledge
sidebar_position: 5
family: Communication
defines: [curse of knowledge]
sources:
  - "Colin Camerer, George Loewenstein and Martin Weber, 'The Curse of Knowledge in Economic Settings' (1989)"
  - "Elizabeth Newton, tappers-and-listeners study (1990)"
  - "Chip and Dan Heath, Made to Stick (2007)"
---

## Statement

Once you know something you cannot model not knowing it, which is why your context reads as
throat-clearing.

## In plain terms

The **curse of knowledge** is the inability to reconstruct what it was like before you understood
something. It makes you systematically overestimate what is obvious — so your jargon reads as
normal vocabulary, your assumed steps read as gaps, and the context you found essential reads to
you as tedious background.

## Decides

How much to trust your own judgment about whether something you wrote is clear.

## Why it holds

The knowledge is not available for inspection. You cannot introspect your way back to not knowing,
which is what makes it a curse rather than an oversight — re-reading your own draft feels fine no
matter how much is missing, because you supply the missing parts without noticing.

Newton's tappers-and-listeners experiment is the cleanest demonstration. Participants tapped the
rhythm of a well-known song and predicted that listeners would identify it about half the time.
Listeners identified 3 in 120 — about 2.5%. The tappers heard the melody in their heads and could
not imagine hearing only taps.

The engineering version is exact. You hear the whole system while writing about one part of it, and
the reader gets the taps.

It also runs in the other direction and produces a second, subtler failure. Material you have
explained many times feels tedious *to you*, so you compress or skip it — which is why experts
routinely omit precisely the context a newcomer most needs, experiencing it as throat-clearing.

The only reliable defences are external. Have someone from the audience read it and mark where they
stopped. Watch someone use the document rather than asking whether it was clear. Read it aloud to a
stranger and notice where you add an explanation — that explanation belongs in the text.

## Example

An engineer writes onboarding documentation for their service. It is careful, thorough, and takes
two afternoons.

A new joiner is given it and observed using it. They stop on line four, at an acronym that is the
internal name for a component. They stop again at "deploy it the usual way", which assumes a
pipeline they have not been granted access to. They stop a third time at a step that begins "once
the migration has run", with no indication of how to run it.

None of the three was visible to the author on re-reading, and all three were visible in the first
four minutes of watching someone try.

The revealing part is what the author *did* include. Three paragraphs on the caching strategy —
interesting, hard-won, and irrelevant to a first deploy — because that was the part they remembered
finding difficult, which is a memory of their own learning rather than a model of the reader's.

Asking the new joiner afterwards whether it was clear produced "yes, mostly". Watching them produced
three defects and one deletion.

## Limits

The defences are cheap and are not free. Watching someone use a document costs an hour of two
people's time, and it is not proportionate for every internal note.

Over-correcting has its own cost. Writing for a complete novice when the audience is expert is
condescending, wastes their attention, and buries the content — the curse argues for calibrating the
audience model, not for assuming the least knowledge possible.

And it is not fully fixable. You can reduce it with structure — listing assumed knowledge,
introducing terms at first use, testing with a reader — and you cannot introspect it away, which is
why the razor points at process rather than at effort.

## Source

Camerer, Loewenstein and Weber named the effect in 1989 in an economics context, studying how
better-informed agents fail to ignore their private information when predicting others' judgments.

Newton's 1990 Stanford dissertation supplied the demonstration everyone remembers, and the Heaths
popularised both in *Made to Stick*, where the curse is presented as the central obstacle to making
an idea comprehensible to anyone who does not already hold it.
