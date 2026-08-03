---
type: razor
title: Working backwards
sidebar_position: 13
family: People, organization, influence
defines: [PR-FAQ, working backwards]
sources:
  - "Amazon PR-FAQ practice (2004–)"
  - "Colin Bryar and Bill Carr, Working Backwards (2021)"
---

## Statement

Write the press release and the FAQ first; if you cannot make it sound compelling, do not build it.

## In plain terms

**Working backwards** starts from the finished thing rather than from the capability. Write the
press release announcing it — what it is, who it is for, why they care — and the FAQ answering the
hard questions. The **PR-FAQ** is a forcing function: if the announcement is not compelling, the
product is not either, and you found out for the cost of a document.

## Decides

Whether to build something, before any of it is built.

## Why it holds

The press release forces customer language. Describing a feature in terms of what the customer gets
is a different exercise from describing what it does, and things that are exciting internally
frequently produce a press release nobody would read — which is the finding.

It also forces the value proposition to exist. "We are building an internal service catalogue" is a
project; "engineers can find who owns any service in ten seconds instead of asking in three
channels" is a claim, and one of those can be evaluated before any work happens.

The FAQ is where the hard part is. Writing out the questions a sceptical customer and a sceptical
executive would ask — how is this different from what exists, what does it cost, why us, what
happens to the current thing — surfaces the gaps that a slide deck lets you skip.

The economics are the argument. A PR-FAQ is a few days of writing against months of building, and
its purpose is to kill things cheaply. A document that cannot be made compelling has done its job by
existing.

It pairs with the [[narrative memo]] format rather than being separate from it: prose, read in
silence, discussed afterwards — because the same property that exposes gaps in an argument exposes
them in a product idea.

## Example

A team proposes an internal metrics platform. The pitch is that current dashboards are fragmented
and a unified platform would help.

Writing the press release is where it stops. The announcement is "engineers can now see all their
service metrics in one place", and the supporting answers are thin — it is for engineers debugging
incidents, who today open three tools, at a cost nobody has measured.

The FAQ is worse:

- why not use the existing tool with better defaults? Because it does not support one query pattern.
- which teams asked for this? None specifically; it came from a retrospective comment.
- what happens to the three existing dashboards? Unclear.

Four days of writing killed a two-quarter project, and the killing was the value.

The version that survives looks different. A press release naming a specific pain — on-call
engineers spend the first ten minutes of every incident finding which dashboard has the answer — and
an FAQ with a measured number behind it, a named group who asked, and a clear answer about what
gets retired.

Same team, same instinct, and one of the two ideas was worth two quarters.

## Limits

It suits products and customer-facing features, and transfers awkwardly to infrastructure whose
value is genuinely indirect. A press release for a database migration is a contrivance, and forcing
one produces theatre.

It is also gameable. A skilled writer can make almost anything sound compelling, so the document is
only a filter if the reviewers are willing to say the announcement is unconvincing — which is a
cultural property rather than a property of the format.

And it front-loads certainty that may not exist. For genuinely exploratory work, demanding a
compelling narrative before building anything selects for ideas that are easy to describe rather
than ideas that are worth trying.

## Source

Amazon adopted the practice in the early 2000s, and Bryar and Carr's *Working Backwards* is the most
detailed public account — including the observation that most PR-FAQs are rejected, and that this is
the point rather than a failure of the process.

The mechanism they emphasise is that the document is iterated many times before it is presented, and
that the iteration is where most of the product thinking happens.
