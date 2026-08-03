---
type: concept
title: Giving feedback
sidebar_position: 1
group: Difficult conversations
summary: Useful feedback is specific, prompt and about behaviour rather than character, and it is withheld for the giver's comfort.
defines: [SBI, ruinous empathy, feedback latency, behaviour not character]
razors: []
prereq: []
sources:
  - "Kim Scott, Radical Candor (2017)"
  - "Center for Creative Leadership, the Situation-Behavior-Impact model (2000s)"
  - "Douglas Stone, Bruce Patton, Sheila Heen, Difficult Conversations (1999)"
  - "Marshall Rosenberg, Nonviolent Communication (1999)"
  - "Lara Hogan, Resilient Management (2019)"
---

## The model

Most feedback that is not given would have been welcome. The reason it is withheld is almost never
the recipient — it is the giver avoiding an uncomfortable five minutes, and calling that kindness.

Scott's term for it is **ruinous empathy**: caring about someone and not telling them the thing they
need to know, which reliably produces a worse outcome for them than the discomfort would have. The
correction is not bluntness. It is being specific about behaviour, being prompt, and being willing to
be uncomfortable on their behalf rather than your own.

## When to use it

You noticed something worth saying and are deciding whether to say it.

1. **Would they want to know?** Almost always yes, and almost always more than you assume.
2. **Is it about behaviour or about character?** "This design doc had no alternatives section" is
   actionable. "You are careless" is a verdict.
3. **Am I avoiding this for their sake or mine?** The honest answer is usually the second, and
   naming that is what unblocks it.

## Speedrun

**What** — a short, specific, timely observation about something someone did and what it caused.

**How to give it**

1. **Use [[SBI]]** — situation, behaviour, impact. "In yesterday's review, you cut Priya off twice.
   She stopped contributing." Three factual clauses, no adjectives about the person.
2. **Be prompt.** **Feedback latency** destroys usefulness: within a day or two, while the specifics
   are recoverable by both of you.
3. **Separate observation from interpretation.** "I noticed X" and "which made me think Y" are
   different claims, and conflating them is what triggers defence.
4. **Ask before concluding.** "What was going on there?" frequently produces a reason you did not
   have, and occasionally reverses the feedback entirely.
5. **Say what good would look like.** Feedback that identifies a problem and no alternative leaves
   the person stuck.
6. **Give the positive kind with the same specificity.** "Good job" is noise; "the way you handled
   the rollback decision under pressure was the right call, and here is why" is information.

**Why it works** — specific, prompt, behavioural observations can be acted on. Vague, delayed
character judgments can only be defended against, which is what most feedback produces.

**The reframe that makes it possible** — you are not being critical, you are giving someone
information they cannot get any other way. Nobody can see how they land in a room.

## Going deeper

### Ruinous empathy

Scott's two-by-two is care personally against challenge directly, and the quadrant most engineers
live in is caring and not challenging.

**Ruinous empathy** looks like kindness and it is a failure of nerve. The person does not find out
what is holding them back, the behaviour continues, and eventually someone tells them in a
performance review — which is far more painful and much later than the five-minute conversation
would have been.

The other failure quadrants are worth naming for contrast. Obnoxious aggression is challenging
without caring, which is what people fear becoming and is much rarer. Manipulative insincerity is
neither, and it is what withholding turns into when it persists.

The test for whether you are avoiding for their sake or yours is simple and uncomfortable: if you
knew they would take it well, would you say it? If yes, you were managing your own discomfort.

Hogan's addition is worth carrying: feedback is much easier to give and receive when there is an
existing relationship and a habit of small, frequent exchanges. The first piece of feedback in a
relationship is always the hardest, which is an argument for starting with the small positive kind
rather than saving the channel for something serious.

### SBI, and why it works

**SBI** — situation, behaviour, impact — is the most reliable structure available, and each part
does a specific job.

**Situation** anchors it in time and place. "In yesterday's design review" makes the feedback
about one recoverable event rather than a general pattern the person will dispute.

**Behaviour** is what was observably done, stated without adjectives. "You interrupted Priya twice"
is observable; "you were dismissive" is an interpretation, and interpretations are what people argue
with.

**Impact** is what followed, ideally including the effect on you. "She stopped contributing for the
rest of the meeting" is the part that makes it matter — behaviour without impact reads as a
preference.

The reason the structure works is that it is hard to dispute. A person can disagree about being
dismissive; they cannot easily disagree that they interrupted twice, and once the fact is agreed the
conversation is about what to do rather than about whether it happened.

Adding a question at the end is what turns it from a verdict into a conversation. "What was going on
there?" occasionally produces information that changes the feedback — they had been asked to keep
the meeting short, they had already heard the point offline — and it costs nothing to ask.

### Behaviour, not character

**Behaviour not character** is the distinction that determines whether feedback can be acted on.

Character feedback — "you are careless", "you are not strategic", "you lack attention to detail" —
is a verdict about who someone is. It cannot be acted on, it can only be defended against, and it is
remembered for years.

Behavioural feedback is about something that happened and could happen differently. "This design doc
had no alternatives section, so the review spent twenty minutes reconstructing them" points at a
change someone can make tomorrow.

The translation is usually available. "Not strategic" is doing some work — find out what it is.
Usually it means something like "your proposals do not say what they unblock" or "you have not been
in the planning conversations", both of which are actionable and neither of which is a personality
assessment.

Rosenberg's observation on the same distinction is that evaluations disguised as observations
produce defence rather than change. "You never document anything" is an evaluation with a
quantifier attached; "the last three services shipped without READMEs" is an observation.

The one place character-level language belongs is positive feedback, where it is usually welcome and
occasionally very valuable — but even there, specificity beats it. "You are great" is worth less than
"you are the person who consistently asks what happens when this fails, and it has caught three real
problems this year."

### Latency, setting and frequency

**Feedback latency** is the most underrated variable. Within a day or two, both of you remember the
specifics; after a month, you are discussing a general impression, which is much harder to accept and
much harder to act on.

The most common cause of delay is waiting for the right moment, and there usually is not one. A
short conversation the same week, in a one-on-one or a private message, is better than a considered
one three weeks later.

Setting matters and is easy to get right: private for anything corrective, prompt, and not in front
of an audience. Public correction is remembered as humiliation regardless of how it was intended,
and it makes the next piece of feedback much harder to deliver.

Frequency changes everything about how it lands. In a relationship where small feedback flows
regularly in both directions, a piece of corrective feedback is a normal event. Where it is rare, the
same words are read as a serious escalation, because the channel opening is itself a signal.

The specific practice worth building is asking for feedback yourself, first and often. It makes the
exchange reciprocal, it demonstrates that you can receive it, and it is the single most effective way
to make giving it easier later.

## See it work

The same observation, delivered three ways.

```mermaid
flowchart TD
  O(["Observed: in yesterday's design review,<br/>a senior engineer cut Priya off twice.<br/>She stopped contributing."]) --> V1["1 · RUINOUS EMPATHY"]
  O --> V2["2 · CHARACTER FEEDBACK"]
  O --> V3["3 · SBI"]
  V1 --> A1["Say nothing. 'He didn't mean it,<br/>and it would be awkward.'"]
  A1 --> A2["It happens again in three more reviews.<br/>Priya stops proposing things.<br/>Nobody tells him for 9 months."]
  A2 --> A3["Then it appears in a performance review<br/>as 'struggles to collaborate.'<br/>◀ far more painful, far later,<br/>and now unfixable in the moment"]
  V2 --> B1["'You were pretty dismissive in that<br/>review — you can come across as<br/>arrogant.'<br/>◀ a verdict about who he is"]
  B1 --> B2["He disputes it — accurately, from his<br/>point of view, since he did not feel<br/>dismissive.<br/>◀ interpretations are what people argue with"]
  B2 --> B3["Remembered for years. Behaviour unchanged."]
  V3 --> C1["SITUATION: 'In yesterday's review…'<br/>◀ one recoverable event, not a pattern"]
  C1 --> C2["BEHAVIOUR: '…you cut Priya off twice<br/>while she was making the reporting point.'<br/>◀ observable. Hard to dispute."]
  C2 --> C3["IMPACT: 'She didn't say anything else<br/>for the rest of the meeting, and the<br/>reporting risk never got discussed.'<br/>◀ this is what makes it matter"]
  C3 --> C4["THEN ASK: 'What was going on there?'<br/>→ 'I'd been asked to keep it to 30<br/>minutes and I was watching the clock.'<br/>◀ real information, and it changes<br/>the fix"]
  C4 --> C5["'That makes sense. Could you say that<br/>out loud next time — "we're short on<br/>time, can we take this after"?'<br/>◀ says what good looks like"]
  C5 --> OUT["Delivered within a day, privately,<br/>in a relationship where small feedback<br/>already flows both ways.<br/>◀ a normal event rather than an escalation"]
```

Option one is the one that gets chosen most often, and it is chosen for the giver's comfort while
being described as consideration for the recipient. The nine-month delay converts a five-minute
conversation into a line in a performance review, which is the worst available version for everyone.

Option two fails on the word "dismissive". It is an interpretation, he did not experience himself
that way, and the conversation immediately becomes about whether the characterisation is fair rather
than about what happened.

The SBI version is hard to dispute because each clause is a fact. He did interrupt twice, she did
stop contributing, and the reporting risk did go undiscussed — so the conversation starts from
agreement and moves straight to what to do differently.

The question at the end is what makes it a conversation, and here it produces information that
changes the fix. He was managing a time constraint nobody else knew about, which means "be less
dismissive" was never the right correction — "say the constraint out loud" is.

And the last line is the precondition for all of it. In a relationship where small feedback already
moves in both directions, this exchange is unremarkable. Where the channel has never been used, the
same words read as a formal escalation, because opening the channel is itself the signal.

## Next

Receiving feedback is the other half, and the one that determines whether anyone gives you the next
piece.
