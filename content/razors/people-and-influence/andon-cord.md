---
type: razor
title: The andon cord
sidebar_position: 10
family: People, organization, influence
defines: [andon cord, stop the line]
sources:
  - "Toyota Production System; Taiichi Ohno (1978)"
  - "Gene Kim, Kevin Behr and George Spafford, The Phoenix Project (2013)"
  - "Mike Rother, Toyota Kata (2009)"
---

## Statement

Anyone can stop the line — and it only works if pulling it is celebrated rather than investigated.

## In plain terms

The **andon cord** is Toyota's mechanism for letting any worker halt production when they see a
defect. The engineering version is anyone being able to stop a deploy, block a release or escalate.
The mechanism is trivial to build and worthless without the second half: **stop the line** has to be
safe to do.

## Decides

Whether to build a mechanism for anyone to halt work, and what determines whether it gets used.

## Why it holds

The economic argument is about when defects are cheapest to fix. Stopping the line costs minutes of
production; letting a defect propagate costs rework on everything built after it, and the ratio is
enormous.

The counterintuitive part is that Toyota's lines stopped constantly and their quality was higher
than competitors who ran continuously. Frequent small stops replaced infrequent large failures,
which is the same trade as small releases against batched ones.

The half that fails is social rather than mechanical. Building a button is easy; making it safe to
press is the entire problem, and it is decided by what happens the first few times someone uses it.

If pulling the cord produces an investigation into whether it was justified, it stops being pulled —
and the mechanism now provides false assurance, because leadership believes there is a stop
mechanism and there is not.

Toyota's inversion is the design insight: the response to a pull is help arriving, immediately, from
a supervisor whose job is to resolve it. The pull is a request for assistance rather than an
accusation, and that framing is what makes it usable.

## Example

An organisation gives every engineer the ability to block a release.

The first person to use it blocks a launch three days before a committed date, over a data-migration
concern. The response is a meeting with two directors asking them to justify the decision, and a
suggestion that they should have raised it earlier.

The concern turns out to be valid and the release ships a week late. The engineer is thanked, and
everyone in the organisation has learned what pulling the cord costs.

Nobody blocks a release for the next eleven months. Leadership continues to describe the mechanism
as one of the ways quality is protected, and it has not existed since the first use.

The version that works responds differently. The block triggers help rather than scrutiny: a senior
engineer and the release manager join within the hour, the concern is assessed on its merits, and if
it turns out to be unfounded the response is "good catch, this is exactly when to pull it" rather
than a note about the cost.

The measure of whether it is working is the pull rate. A mechanism used twice a year is not a safety
mechanism; one used weekly, mostly for things that turn out to be minor, is functioning as designed.

## Limits

It requires a real response capability. A cord that can be pulled and produces no help is worse than
none, because the puller has now stopped the line and owns the problem alone.

Volume can also become a problem in the other direction, and the response is not to raise the bar
for pulling. A high pull rate on the same cause is a signal about the underlying process, and
treating it as over-use is how the mechanism gets quietly disabled.

And it does not transfer cleanly to every kind of work. Manufacturing has a literal line with a
clear defect definition; knowledge work frequently does not, and "stop the line" has to be defined
per context to mean anything.

## Source

The andon system is part of the Toyota Production System's jidoka pillar — automation with a human
touch — where the principle is that quality is built in by stopping to fix rather than inspected in
afterwards.

*The Phoenix Project* is where most engineering audiences met it, and the transfer that has aged best
is not the mechanism but the observation about the social conditions: the cord's value is entirely
determined by what happens to the person who pulls it.
