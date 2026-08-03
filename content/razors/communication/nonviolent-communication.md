---
type: razor
title: Nonviolent communication
sidebar_position: 11
family: Communication
defines: [nonviolent communication]
sources:
  - "Marshall Rosenberg, Nonviolent Communication: A Language of Life (1999)"
---

## Statement

Observation, feeling, need, request — separating what happened from what you made it mean.

## In plain terms

**Nonviolent communication** is Rosenberg's four-part structure — observation, feeling, need,
request. Say what happened without evaluation, say how you feel, say what you need, and ask for
something specific. The work is almost all in the first step, because most of what people call
observations are judgments.

## Decides

How to raise something that has affected you without producing a defence.

## Why it holds

The structure separates four things that ordinary speech merges, and the merging is what triggers
defensiveness.

**Observation** without evaluation is the hardest and most valuable. "You never document anything"
merges an observation with a quantifier and a judgment; "the last three services shipped without
READMEs" is checkable. Rosenberg's claim is that evaluation disguised as observation reliably
produces resistance, because the listener is defending against a characterisation.

**Feeling** is stated rather than attributed. "I felt cut out" is unarguable — it is a report about
your own state. "You cut me out" is a charge about their intent, which they will dispute and may
genuinely not recognise.

**Need** is what makes the feeling legible. Feelings without stated needs read as accusations by
implication; naming the need — to be consulted on decisions in my area — gives the other person
something to act on.

**Request** has to be specific and genuinely a request. "Please communicate better" is a sentiment;
"could you loop me in before the review next time" is actionable, and a request that cannot be
declined is a demand wearing better clothes.

The reason it transfers to engineering is that most workplace friction is exactly this failure —
impact attributed as intent, delivered as a characterisation, with no specific ask.

## Example

An engineer finds a decision was made in their area without them.

The ordinary version: "You went around me on the schema decision. That's not okay — if you're going
to make calls in my area you could at least tell me." Three sentences, two of which are charges
about intent.

The structured version separates them. Observation: "The schema decision was made in Tuesday's
meeting, and I found out from the notes on Thursday." No adjective, no inference about why.

Feeling: "I felt cut out." A report about internal state, which nothing can contradict.

Need: "I need to be part of decisions that change the data model, because I'm the one who'll be
asked why it's like that in six months."

Request: "Could you include me when something touches the schema — even just a message before the
meeting?"

The response to the first version is a defence of intent — "I wasn't going around you". The response
to the second is usually the actual explanation, which here is that the meeting was called at two
hours' notice and the invite list was copied from a previous one.

## Limits

It sounds artificial when applied literally, and in a workplace the full four-part form reads as
therapy-speak to many people. The transferable part is the separation — observation from
interpretation, feeling from accusation — rather than the script.

Rosenberg's framework also comes from conflict resolution and carries assumptions about mutual
willingness. Against someone acting in bad faith it is not a technique so much as a disadvantage.

And it is not a substitute for authority where authority is appropriate. A manager addressing
repeated poor performance is not having a needs conversation, and framing it as one is unclear
rather than kind.

## Source

Rosenberg developed the approach through mediation work in civil-rights-era school desegregation and
later international conflict resolution, and published the book version in 1999.

The engineering community mostly encounters it second-hand, through feedback frameworks like
[[SBI]] and through the observation/interpretation distinction, which is
the part that survives translation into a professional context.
