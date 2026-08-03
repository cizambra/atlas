---
type: razor
title: Bus factor
sidebar_position: 8
family: People, organization, influence
defines: [bus factor, knowledge concentration]
sources:
  - "Folk term from open-source practice; earliest uses 1990s"
  - "Michael Nygard, Release It! (2007) — the operational framing"
---

## Statement

Count how many people can be lost before the project stops — if the answer is one, that is the top
risk.

## In plain terms

The **bus factor** is the number of people who would have to be unavailable before a project could
not continue. One is very common and rarely written down anywhere. It is the single most
under-managed risk in most engineering organisations, because **knowledge concentration** is
invisible while the person is present.

## Decides

Where the real risk in a system is, as distinct from where the technical risk is.

## Why it holds

The failure is invisible until it fires. A bus factor of one produces no symptom at all while the
person is there — in fact it produces good symptoms, because that person is fast and reliable in
their area.

The realistic triggers are mundane and frequent. Not buses: holidays, illness, parental leave, a
better offer, a reorganisation, or simply being on another project for a quarter. Any of them turns
a bus factor of one into a stall.

Concentration also compounds. The person who knows the system is the fastest person to work on it,
so work routes to them, so they learn more and nobody else learns any — which is the
[[the hero trap|hero pattern]] operating on knowledge rather than on incidents.

And it is worse for the person than it looks. Being the only one who can do something removes your
ability to take a holiday, be ill, change teams or be promoted — it feels like job security and
functions as a trap.

The measurement is cheap and almost never done: for each critical system, name the people who could
handle a serious incident in it unaided. Where the list has one name, that is a risk with a name on
it, and it can be scheduled against.

## Example

A payments reconciliation system has run reliably for four years. One engineer built it and has
handled every issue since.

Nothing about this is alarming from outside. Incidents are rare, resolution is fast, and the system
does not appear on any risk register.

They take four weeks of leave, and in week two the reconciliation breaks in a way nobody
recognises. There is no runbook, because one was never needed, and the code is competent and
undocumented in exactly the places where the domain logic is non-obvious. Two engineers spend three
days and escalate.

The trigger was a holiday, which is the most predictable event in the list.

The mitigations are all ordinary and all require someone to have decided to do them: a second person
in the code monthly rather than never, a runbook written by someone who did not build it, a
documented walkthrough of the domain rules, and rotating the next three changes to someone else.

Each costs a little and each is slower than letting the expert do it — which is exactly why none of
them happens by default.

## Limits

Raising it costs efficiency, and the cost is real. Two people doing what one could is slower, and
the person who knows the system will be frustrated by watching someone else be slow at it.

Not everything deserves the investment either. A bus factor of one on a peripheral internal tool is
an acceptable risk; on a system that processes payments it is not, and the razor is about knowing
which is which rather than raising all of them.

And it is not solved by documentation alone. Written knowledge decays and is not the same as
practised capability — the reliable mitigation is someone else actually doing the work, which is
[[delegation]] rather than writing.

## Source

The term is folk vocabulary from open-source communities, where the risk is acute — many widely-used
projects have a single maintainer, and the concentration is visible in a way it is not inside
companies.

Nygard's framing in *Release It!* connects it to operational risk rather than only to project risk:
a system whose failure modes are understood by one person is a system whose recovery time depends on
that person's availability.
