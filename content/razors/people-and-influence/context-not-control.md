---
type: razor
title: Context, not control
sidebar_position: 9
family: People, organization, influence
defines: [context not control]
sources:
  - "Reed Hastings, Netflix culture deck (2009)"
  - "Reed Hastings and Erin Meyer, No Rules Rules (2020)"
---

## Statement

If someone makes a bad call, ask what context they were missing before reaching for a process.

## In plain terms

**Context not control** is the response to a bad decision. The instinct is to add an approval, a
checklist or a rule — a control. The alternative is to ask what the person did not know that you
did, and supply it — because a rule prevents that one mistake and a shared model prevents the class.

## Decides

What to do after someone makes a decision you would not have made.

## Why it holds

Controls scale badly and context scales well. Each new approval gate adds latency to every future
decision including the correct ones, and gates accumulate — an organisation that responds to every
bad call with a control ends up unable to move.

Controls also transfer judgment upward rather than building it. The person who made the call learns
that this decision now requires approval; they do not learn what made it wrong, so their next
unsupervised decision in an adjacent area is no better.

Context compounds in the other direction. An engineer who understands why the company weights
reliability over feature velocity this year makes better decisions in a hundred situations nobody
anticipated, and none of them requires a rule.

The diagnostic question is what they were missing. Usually it is one of a small set: the business
constraint nobody told them, the history of a previous attempt, the customer commitment, or the
weighting between two things they had no reason to know.

Hastings' framing pairs it with talent density, and the pairing is load-bearing. Context works with
people capable of using it; with people who are not, the honest response is a different conversation
rather than a rule that constrains everyone.

## Example

An engineer ships a change that degrades a report finance depends on, unannounced. The report was
wrong for two days.

The control response writes a rule: all changes touching reporting tables require sign-off from the
data team. It prevents this specific failure and adds two days to every reporting change forever,
including the hundreds that were fine.

It also teaches nothing. The engineer now knows that reporting changes need approval; they do not
know why finance cares, which report is load-bearing, or what the month-end cycle is.

The context response asks what they were missing, and the answer is specific: nobody told them that
this report feeds the monthly close, that finance runs it on the third working day, and that a wrong
number there propagates into a filed statement.

Supplying that changes more than the rule would. They now notice the other three reports with the
same property, they ask before touching them, and they tell two colleagues — and none of it requires
a gate.

The rule would have caught this one case. The context catches the class, including the cases nobody
has thought of.

## Limits

It does not apply where the failure is unrecoverable. Irreversible data operations, production
access and anything with a regulatory consequence deserve a control, because "they will understand
next time" is not an acceptable plan for something that cannot be undone.

It also assumes capability. Context given to someone who cannot use it produces the same bad
decision with more information, and Netflix's version is explicit that the model depends on talent
density — which is a real precondition rather than a caveat.

And repeated failures after context has been supplied are a different problem. Continuing to supply
context to someone who is not acting on it is avoidance, and the honest response is the
conversation rather than a fourth explanation.

## Source

The phrase comes from the 2009 Netflix culture deck, in the section arguing that as a company grows,
the usual response to errors is process, and that process drives out the people who are good at
ambiguity.

*No Rules Rules* develops the reasoning: high talent density permits low process, and the two are a
system rather than independent choices — which is the part most adopters of the slogan leave out.
