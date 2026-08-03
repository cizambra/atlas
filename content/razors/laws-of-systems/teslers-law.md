---
type: razor
title: Tesler's Law
sidebar_position: 15
family: Laws of systems
defines: [Tesler's Law, conservation of complexity]
sources:
  - "Larry Tesler, Xerox PARC and Apple (1980s)"
  - "Dan Saffer, Designing for Interaction (2006) — the widely quoted formulation"
---

## Statement

Complexity is conserved: whatever you refuse to handle in the system gets handled by the user.

## In plain terms

**Tesler's Law** — the law of **conservation of complexity** — says every process has an
irreducible amount of complexity that has to live somewhere. Simplifying an interface does not
remove it; it moves it to the person using the interface. The design question is not how much
complexity there is but who absorbs it.

## Decides

Where to put unavoidable complexity — in the system, or in the people who use it.

## Why it holds

The complexity is a property of the task, not of the implementation. Filing tax, routing a payment,
scheduling a job with dependencies — each has a set of cases that genuinely exist, and no interface
makes those cases stop existing.

So removing a field, a setting or a step does not delete the decision it represented. Somebody
still makes that decision; the question is whether they make it with the system's help or by
working it out themselves and entering the result.

The asymmetry is what makes it a razor. The system absorbs complexity once, at build time, with a
developer who understands the domain. The user absorbs it every time, without that understanding,
usually under time pressure — so moving it to the system is almost always the better trade.

Tesler's own conclusion was stronger: engineers should spend an extra week reducing an
application's complexity rather than making millions of users spend an extra minute each.

## Example

An internal deploy tool is criticised for being complicated: eleven configuration options, three
of which are almost always the same values.

The simplification removes eight options and picks defaults. The interface is now clean, and the
team is pleased.

What actually happened is that the complexity moved. The eight decisions still exist — they were
real, they varied by service — so teams now maintain a wiki page of "what to change after
generating a deploy config", and every new service copies a config from a sibling and edits it by
hand.

The tool is simpler and the work is not. Eleven visible options that the tool explained have become
eight invisible ones that the wiki explains badly, and the failure mode has changed from "confusing
form" to "silently wrong config that nobody reviews".

The version that reduces total complexity is different: keep the decisions, give them sensible
defaults derived from the service type, and explain each one at the point of use.

## Limits

It does not say complexity cannot be reduced at all. Genuine simplification exists — removing a
capability nobody needs, or restructuring so a whole class of decision disappears — and those
change the essential complexity rather than relocating it.

Distinguishing the two is the actual skill. Removing an option that had no real variation is a
reduction; removing one that varied is a relocation, and they look identical in the interface.

And some complexity belongs with the user. An expert tool that hides a decision the expert needs to
make is worse, not better — the law argues for putting complexity where it is best handled, which is
not always the system.

## Source

Tesler formulated it at Xerox PARC and later Apple, where his work included the cut-copy-paste model
and the argument against modes in user interfaces. The widely quoted phrasing comes through Dan
Saffer's *Designing for Interaction*.

His framing was explicitly about the arithmetic of who pays: a developer's week against a minute
each for millions of users, which is a comparison that almost always resolves the same way.
