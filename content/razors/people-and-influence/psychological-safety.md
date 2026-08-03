---
type: razor
title: Psychological safety
sidebar_position: 1
family: People, organization, influence
defines: [psychological safety]
sources:
  - "Amy Edmondson, 'Psychological Safety and Learning Behavior in Work Teams' (1999)"
  - "Amy Edmondson, The Fearless Organization (2018)"
  - "Google, Project Aristotle (2015)"
---

## Statement

The strongest predictor of team performance is whether people can admit mistakes without fear.

## In plain terms

**Psychological safety** is the shared belief that you can take an interpersonal risk — ask a
question, admit an error, disagree with a senior person — without being punished or humiliated. It
is not comfort or niceness; teams with it argue more, not less, because disagreeing is safe.

## Decides

What to work on when a team is underperforming and the obvious explanations do not fit.

## Why it holds

The mechanism is information. A team where admitting a mistake is costly does not stop making
mistakes — it stops reporting them, so the organisation loses the near misses, the early warnings
and the honest status, which are the cheapest inputs it has.

Edmondson's original finding was counterintuitive and is the reason the concept has weight. Studying
hospital teams, she found the *better* teams reported more errors — not because they made more, but
because reporting was safe, and the reporting was what let them improve.

Google's Project Aristotle looked for what distinguished effective teams across the company and found
that composition mattered far less than expected. Psychological safety was the strongest of the five
factors identified, ahead of dependability, structure, meaning and impact.

The failure it prevents is silence, and silence is invisible. Nobody reports that they did not ask a
question, did not flag a concern, or did not admit they were lost — so a team with low safety looks
like a team with no problems.

Its most common misreading is worth pre-empting: safety is not the absence of challenge. Edmondson's
own framing puts safety on one axis and accountability on the other, and high safety with low
standards is a comfort zone rather than a performing team.

## Example

Two teams run the same incident: a config change takes checkout down for two hours.

In the first, the postmortem identifies human error and adds a second approver. Nobody says that the
staging environment has had a different config shape for months, or that the deploy tool's success
message is misleading, or that three people have hit near misses on the same path — because
volunteering any of that means volunteering for scrutiny.

The team looks fine afterwards. Nothing was learned, the same class of failure recurs in two
quarters, and the near misses continue to go unreported.

In the second, the engineer who made the change says in the review that they had misread the deploy
tool's output, and two other people immediately say they have done the same thing. That turns one
incident into a known defect in the tooling.

Someone junior asks why staging differs from production, which nobody had questioned in a year. The
answer turns out to be a temporary workaround from 2024.

Same incident, and the second team came out with three fixes and a corrected mental model. The
difference was entirely in whether saying those things was safe.

## Limits

It is not comfort, and it is not the absence of accountability. Edmondson's two-by-two puts safety
against standards, and the quadrant she warns about is high safety with low standards — pleasant and
unproductive.

It is also not created by declaring it. Announcing that a team is a safe space, or running an
exercise, does approximately nothing; safety is inferred from what happens when someone actually
takes a risk, and the first response to a reported mistake sets it more than any statement.

And it is local rather than organisational. Safety varies sharply between teams in the same company,
which means it is largely a property of the immediate leader's behaviour — and that is both the good
news and the reason company-wide programmes rarely move it.

## Source

Edmondson introduced the construct in 1999, based on studies of hospital teams where she expected
better teams to report fewer errors and found the opposite — a result that only made sense once
reporting rate was understood as a measure of safety rather than of error rate.

Google's Project Aristotle brought it to general attention in 2015, having studied 180 teams looking
for the ingredients of effectiveness and found psychological safety to be the most significant of
the factors that emerged.
