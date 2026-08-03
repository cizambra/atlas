---
type: razor
title: Five whys, and why it flatters
sidebar_position: 12
family: Delivery and operations
defines: [five whys, linear causality]
sources:
  - "Taiichi Ohno, Toyota Production System (1978)"
  - "John Allspaw, 'The Infinite Hows' (2014)"
  - "Richard Cook, 'How Complex Systems Fail' (1998)"
---

## Statement

Asking why five times yields a single tidy cause for an event that had many — linear chains flatter
the investigator.

## In plain terms

**Five whys** asks why repeatedly until you reach a root cause. It works well on mechanical systems
with deterministic failures, and badly on socio-technical ones — because it assumes **linear
causality**, and complex system failures are combinations. The chain you produce is a function of
which why you asked first.

## Decides

How to structure an incident investigation, and how much to trust a single named root cause.

## Why it holds

Ohno's technique was designed for a manufacturing line: a machine stops, and there genuinely is a
chain — the fuse blew because the bearing seized because it was not lubricated because the pump
failed because the shaft was worn. Physical, deterministic, one path.

Software incidents are not shaped like that. Cook's observation is that complex systems run in a
degraded mode continuously, containing multiple latent failures at all times, and an incident is
several defences failing together rather than one cause propagating.

Which makes the chain arbitrary. Ask "why did the config deploy fail" and you get a validation
story; ask "why did nobody notice for forty minutes" and you get a monitoring story. Both are true,
both terminate in five steps, and the technique gives no reason to prefer one — the first question
determined the answer.

Allspaw's stronger objection is that the linear form is satisfying in a way that ends investigation
early. A tidy chain feels like understanding, so the four other contributing conditions never get
enumerated.

The correction is to change the question. "How" rather than "why" — how did this look correct at
the time, how did the alert come to be muted, how did staging come to differ — produces conditions
rather than a chain, and conditions are what you can actually change.

## Example

An outage: a background job overwhelmed the database and reads timed out for twenty minutes.

Five whys, starting from the database: reads timed out → because connections were exhausted →
because the batch job opened 200 → because it processes in parallel → because it was tuned for
throughput → *root cause: the batch job's parallelism setting.* Tidy, five steps, and the fix is a
config change.

Started one question to the left it produces something else entirely: reads timed out → because
nothing limited the batch job's share → because the job runs against the primary → because the
read replica was decommissioned in March → *root cause: the replica decommission.*

Both chains are correct. Both are five steps. Both feel like the answer, and the fixes are unrelated.

The conditions view finds all of them and does not have to choose: the job had no concurrency limit,
it ran against the primary, the replica was removed without reassessing dependents, the connection
pool had no per-caller bound, and the saturation alert threshold was above the level that caused
user impact. Five conditions, each independently fixable, and removing any one would have prevented
this incident.

## Limits

The critique is not that five whys is useless. On a genuinely mechanical, deterministic failure —
a build breaking because a dependency version pinned wrong — the chain is real and the technique is
fast.

It is also a reasonable prompt for people who would otherwise stop at the first answer. The
discipline of asking again is valuable even if the linear model is wrong, and it is much better than
"the deploy caused it".

And the alternative is more expensive. Enumerating contributing conditions takes longer, produces a
longer document, and resists the single-sentence summary that leadership frequently asks for — which
is a real cost, not a purity argument.

## Source

Ohno developed five whys at Toyota as part of the production system, for a domain where it fits
well, and it entered software through lean and agile practice.

Allspaw's "The Infinite Hows" is the sharpest critique, arguing that "why" invites a linear
counterfactual narrative and "how" invites description of the conditions that existed — and that
the second is what incident analysis actually needs.
