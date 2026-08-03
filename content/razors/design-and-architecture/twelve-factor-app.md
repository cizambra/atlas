---
type: razor
title: The twelve-factor app
sidebar_position: 13
family: Design and architecture
defines: [twelve-factor, config in the environment, disposability, dev-prod parity]
sources:
  - "Adam Wiggins, 'The Twelve-Factor App', Heroku (2011)"
  - "Kelsey Hightower and others, twelve-factor critiques in the container era (2017–)"
---

## Statement

Config in the environment, processes stateless and disposable, dev and prod as alike as you can
make them.

## In plain terms

**Twelve-factor** is a set of conventions for services that need to be deployed repeatedly and
scaled horizontally. Most of it has become invisible default practice — nobody argues about
environment variables any more — and the three that still carry weight are configuration, statelessness
and environment parity.

## Decides

How to structure a service so it can be deployed, scaled and rolled back without ceremony.

## Why it holds

Three of the twelve are doing most of the work.

**Config in the environment** separates what varies by deployment from what is in the artifact. The
same build runs in staging and production with different environment variables, which means the
thing you tested is literally the thing you shipped — and secrets are not in the repository.

**Disposability** — processes start fast and shut down gracefully on SIGTERM — is what makes
autoscaling, rolling deploys and instance replacement work at all. A process that takes ninety
seconds to become ready cannot be part of a fast rollback.

**Dev-prod parity** attacks the class of bug that only appears in production. Different databases,
different queue implementations or different operating systems between environments guarantee a
category of failure that no amount of testing catches, because the tests do not run against what
production runs.

The rest are mostly settled. Explicit dependencies, treating backing services as attached
resources, separating build from run, stateless processes, logs as event streams to stdout — all
now default in any container-based deployment, largely because twelve-factor argued for them.

## Example

A service is deployed by copying files to a server and restarting it. Configuration lives in
`config/production.yml`, checked into the repository. State — uploaded files and session data —
lives on local disk. Startup takes about two minutes because of a cache warm.

Every twelve-factor violation has a specific operational consequence. The committed config means
staging and production differ by a file, so the artifact tested is not the artifact shipped, and
the database password is in git history forever.

Local state means the instance cannot be replaced. A deploy is an in-place upgrade with downtime,
scaling horizontally breaks sessions, and a lost instance loses uploads.

The two-minute startup means rollback is a two-minute outage, so nobody rolls back — they fix
forward under pressure, which is how a small incident becomes a long one.

The twelve-factor version changes all three: config from environment variables, uploads to object
storage and sessions to a shared store, and the cache warmed lazily after the process reports
ready. The deployment machinery that was custom is now the platform's default.

## Limits

It is specifically for stateless network services, and the twelve factors do not describe
everything. Databases, stateful stream processors, batch systems and anything with genuine local
state are outside its scope, and applying it there produces contortions.

Some factors have aged. "Logs to stdout" is right and incomplete now that structured logging and
tracing carry most of the diagnostic weight; "one codebase, one app" sits awkwardly with monorepos;
and environment variables are a poor fit for large configuration and for secrets, which now have
dedicated systems.

And it encodes assumptions from a specific platform-as-a-service. The methodology was written to
describe what Heroku required, and some factors are more about that platform than about services in
general.

## Source

Adam Wiggins published the methodology in 2011 based on Heroku's experience running large numbers
of applications, and it became the de facto description of a cloud-native service years before that
term existed.

The container era has both validated and dated it. Most of the twelve are now enforced by the
platform rather than by discipline, which is the strongest possible endorsement — and the
critiques, largely from the Kubernetes community, are mostly about the factors that assumed a single
specific runtime.
