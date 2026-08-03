---
type: razor
title: Immutable infrastructure
sidebar_position: 22
family: Design and architecture
defines: [immutable infrastructure, configuration drift, snowflake server]
sources:
  - "Chad Fowler, 'Trash Your Servers and Burn Your Code' (2013)"
  - "Martin Fowler, 'PhoenixServer' (2012) and 'SnowflakeServer' (2012)"
---

## Statement

Replace servers rather than patching them, so what is running always matches what was described.

## In plain terms

**Immutable infrastructure** means a running instance is never modified. Need a change? Build a new
image and replace the instance. The alternative accumulates **configuration drift** — every manual
fix, hotfix and one-off package makes the machine diverge from its description, until nobody can
recreate it.

## Decides

Whether to change a running server or replace it.

## Why it holds

Drift is inevitable under mutation and invisible while it accumulates. Each individual change is
small and justified — a package installed during an incident, a config edited to unblock someone, a
permission adjusted — and none is recorded anywhere the description lives.

The **snowflake server** is where it ends: a machine that works, that nobody fully understands, and
that cannot be rebuilt. Its state is the accumulated history of everything anyone did to it, and
that history exists nowhere.

Immutability makes the description authoritative by construction. If the only way to change a
machine is to build a new image from a definition, then the definition is complete — not because
anyone is disciplined, but because there is no other path.

The operational consequences follow:

- rollback is deploying the previous image rather than reversing a change
- scaling out produces identical instances rather than nearly-identical ones
- environments match, because they are built from the same artifact
- "it works on that server" stops being a category of bug

The requirement it imposes is that state must live elsewhere — in a database, an object store or a
config service — which is the same constraint [[twelve-factor]] and [[crash-only|crash-only design]]
impose, from different directions.

## Example

A service runs on three long-lived VMs, provisioned two years ago by a script that mostly still
exists.

Over two years each has diverged:

- one had a memory-limit fix applied during an incident
- one has an extra package installed to debug something, still present
- one has a config file edited by hand and never reflected in the script

Nobody knows which is which.

The consequences are ordinary and expensive. A new instance built from the script does not work,
because the script no longer describes any of the running machines. Debugging a discrepancy means
comparing three machines by hand. Scaling out means cloning a VM rather than provisioning one,
which propagates the drift.

The immutable version bakes an image from a definition and deploys instances from it. Nobody
connects to a running instance to change anything; a fix is a new image and a rolling replacement.

The three machines are now identical by construction, a new one is identical to them, and the
memory-limit fix from the incident is in the definition — because there was nowhere else to put it.

## Limits

It requires the surrounding machinery. Image building, artifact storage, a deployment system that
can roll instances, and externalised state — without those, "immutable" means manual rebuilds and
nobody sustains it.

Build times also become part of the change cycle. A one-line config fix that used to take thirty
seconds now requires an image build and a rolling deploy, which is why configuration is usually
externalised even in otherwise immutable setups.

Debugging is genuinely harder, and it is the trade people underestimate. A machine that cannot be
modified cannot be poked at during an incident, so observability has to be good enough to diagnose
from outside — and where it is not, the discipline gets broken at exactly the worst moment.

And some things are legitimately stateful. Databases, message brokers and anything with local
durable state need a different pattern, and treating them as replaceable cattle loses data.

## Source

Chad Fowler's 2013 essay is the canonical statement, arguing that the ability to destroy and rebuild
any server is what makes infrastructure understandable — and that the reluctance to do so is a
symptom of not actually knowing what is on it.

Martin Fowler's Phoenix Server and Snowflake Server entries name the two ends of the same axis, and
his suggested test is the useful one: how confident are you that you could rebuild this machine from
scratch, and when did you last try?
