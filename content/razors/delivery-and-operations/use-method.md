---
type: razor
title: The USE method
sidebar_position: 10
family: Delivery and operations
defines: [USE method, resource saturation]
sources:
  - "Brendan Gregg, 'The USE Method' (2012) and Systems Performance (2013)"
---

## Statement

For every resource: utilisation, saturation, errors — the checklist that finds the bottleneck rather
than describing the symptom.

## In plain terms

The **USE method** is a diagnostic procedure rather than a dashboard. Enumerate every resource —
CPU, memory, disk, network, and the software equivalents like connection pools and thread pools —
and for each check three things: [[utilisation]] (how busy), **resource saturation** (how much work
is queued), and errors. The bottleneck is usually obvious within minutes.

## Decides

Where to look when a system is slow and you do not know why.

## Why it holds

It is exhaustive by construction, which is what makes it fast. Rather than following intuition —
which goes to the resource you looked at last time — you walk a list, and a bottleneck cannot hide
in a resource you did not check because you checked all of them.

The three questions are chosen because they fail differently. High utilisation with no saturation
is efficiency, not a problem. Saturation is the one that hurts: queued work means waiting, and
waiting is what users experience.

That distinction is the method's most useful contribution. A CPU at 100% utilisation with an empty
run queue is working perfectly; a CPU at 70% with a deep run queue is a bottleneck. Utilisation
alone is routinely misread in both directions.

Errors are third because they are usually low-frequency and easy to miss in aggregate metrics —
a small rate of retried failures can dominate latency without moving any average.

Gregg's emphasis on the resource *list* is the part people skip. Writing down every resource,
including the software ones nobody instruments — connection pools, file descriptors, thread pools,
lock contention — is where the missing bottleneck usually turns out to be.

## Example

A service is slow. p99 has gone from 200ms to 3 seconds over a week, and the obvious suspects have
been checked: CPU is at 30%, memory is fine, and the database looks healthy.

Working the USE list finds it in about ten minutes. CPU: 30% utilisation, no run-queue saturation,
no errors. Memory: 60%, no swapping, no allocation failures. Network: 15% of link, no drops.

Disk: 40% utilisation, and a queue depth averaging 12. That is the saturation signal — the device
is not busy by utilisation and requests are waiting, which is what a slow device under moderate load
looks like.

The software resources complete the picture. The database connection pool is at 95% utilisation with
requests waiting to acquire — saturated — and the pool has 20 connections against a workload that
grew 40% over the same week.

Neither of those was on any dashboard, because both are resources nobody thought to instrument. The
checklist found them by being a checklist.

## Limits

It diagnoses resource bottlenecks and nothing else. A slow system caused by an algorithmic problem,
a bad query plan or a distributed coordination issue will show every resource healthy, and the
method will correctly report that nothing is saturated.

Enumerating resources is also harder than it sounds, particularly in cloud and container
environments where the relevant limits are cgroup quotas and provider throttles rather than
physical devices — and those are frequently invisible from inside.

And it is bottom-up, so it says nothing about user experience. A system with no saturated resource
can still be failing its users, which is what [[RED method|RED]] and the
[[golden signals]] measure from the other end.

## Source

Gregg published the method in 2012, drawing on performance work at Sun and Joyent, and expanded it
in *Systems Performance*. It is explicitly a methodology rather than a metric set — the checklist
and the order are the contribution.

His argument for it is diagnostic speed: most performance investigations are slow because they start
from a hypothesis, and the USE method starts from an enumeration, which cannot miss.
