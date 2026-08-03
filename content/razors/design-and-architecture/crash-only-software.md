---
type: razor
title: Crash-only software
sidebar_position: 20
family: Design and architecture
defines: [crash-only, recovery path]
sources:
  - "George Candea and Armando Fox, 'Crash-Only Software', HotOS IX (2003)"
  - "Erlang/OTP 'let it crash' philosophy (1990s)"
---

## Statement

If the only way to stop is to crash, recovery is exercised constantly instead of on the worst night
of the year.

## In plain terms

**Crash-only** software has no graceful shutdown path — stopping means killing the process, and
starting means recovering. The argument is about test coverage: a system with both a clean shutdown
and a crash recovery has two paths, and only one of them gets exercised. The one that does not is
the one you need at 3am.

## Decides

Whether to build a separate graceful-shutdown path, or to make crash recovery the only path.

## Why it holds

The **recovery path** is the least-tested code in most systems and the most important. It runs
after the rare event, under time pressure, in a state nobody anticipated — and it has typically
never been exercised in production.

Crash-only removes the alternative. If the only way to stop is `kill -9`, then every deploy, every
restart and every scale-down exercises recovery, which means it is tested continuously by ordinary
operations rather than by the incident.

It also simplifies the state space. Two shutdown paths mean two sets of possible states to recover
from, and the combinations are where the subtle bugs live. One path means one set.

The design requirements that follow are the actual content: state must be in a store that survives
the process, operations must be idempotent so partial work can be repeated, and startup must
reconcile whatever it finds rather than assuming a clean slate. Each is independently valuable.

Erlang's "let it crash" is the same idea at component granularity — do not write defensive error
handling for unexpected states, let the process die and let a supervisor restart it clean — and it
is where the philosophy has the longest production track record.

## Example

A job worker has a careful shutdown handler: on SIGTERM it stops accepting work, waits for
in-flight jobs, flushes an in-memory buffer to the database, and exits.

It works in testing and it has never run in production the way it was designed to, because in
production the process gets OOM-killed, the node is preempted, or the deploy times out and sends
SIGKILL. The buffer is lost, and jobs that were in flight are neither completed nor requeued.

Nobody discovers this until an incident, because the graceful path is the one that gets tested and
the crash path is the one that runs.

The crash-only version deletes the handler. Jobs are claimed with a lease rather than held in
memory, so an expired lease returns the job to the queue automatically. Nothing is buffered — each
result is written as it is produced. Startup scans for expired leases and resumes.

Stopping is now `kill -9`, used by every deploy. Recovery runs several times a day, so a bug in it
is found on a Tuesday afternoon rather than during an outage — and the OOM kill that used to lose
work is now indistinguishable from a normal stop.

## Limits

It requires external durable state, and that is not free. Writing every result immediately rather
than buffering costs I/O, and for high-throughput systems the batching that crash-only discourages
is a real performance technique.

Some shutdown work is genuinely necessary. Draining connections so a load balancer stops routing,
finishing an in-flight HTTP response, or releasing a distributed lock cleanly are all things a hard
kill does worse — and the pragmatic version is a short, simple drain rather than a full graceful
path.

And "let it crash" needs a supervisor. Without something that restarts reliably and backs off on
repeated failure, crash-only is just crashing.

## Source

Candea and Fox published the paper at HotOS in 2003, arguing that crash-only design produces
systems that recover faster and more predictably, because the recovery code is on the common path
rather than the exceptional one.

Erlang/OTP had been running the same philosophy in telecoms systems since the 1990s, with
supervision trees making component-level crash-and-restart the default error strategy — the longest
running evidence that the approach works at scale.
