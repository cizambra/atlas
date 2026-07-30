---
type: razor
title: Little's Law
family: Laws of systems
defines: [Little's Law, work in progress]
sources:
  - "John D. C. Little, 'A Proof for the Queuing Formula L = λW' (1961)"
  - "Donald Reinertsen, Principles of Product Development Flow (2009) — applied to teams"
---

## Statement

The average number of items in a system equals the arrival rate times the average time
each one spends there: $L = \lambda W$.

## Decides

Which of the three levers to pull when something is too slow — reduce arrivals, add
capacity, or shorten service time — and what a queue's depth is actually telling you.

## Why it holds

It is an identity, not a model. Little proved it holds for any stable system regardless
of arrival distribution, service distribution, or queueing discipline, which is unusual
and is what makes it safe to use without measuring anything else.

Rearranged, it becomes the sentence that matters: $W = L / \lambda$. Time in the system
is work in progress divided by throughput. If throughput is fixed — and it usually is,
because it is a property of your capacity — then **the only way to cut latency is to cut
work in progress**.

That is why adding queue depth never fixes latency. A deeper queue raises $L$ while
$\lambda$ stays put, so $W$ goes up. The requests do not fail any more, they just wait
longer, and you have converted a visible rejection into an invisible delay.

## Example

A service handles 200 requests per second and holds 400 in flight at any moment.
$W = 400 / 200 = 2$ seconds per request, and you did not need a tracing system to
learn it.

Someone proposes raising the connection pool from 400 to 800 to stop the rejections.
Little's Law says the outcome: throughput is unchanged at 200/s, so the average request
now takes 4 seconds. The errors disappear and every user waits twice as long.

The same arithmetic runs on teams. Twenty tickets in progress across a team finishing
five a week is a four-week cycle time, and no amount of urgency changes it until
someone starts fewer things.

## Limits

It requires a **stable** system — arrivals must roughly equal departures over the window
you measure. During a transient, a cold start or a traffic spike, the averages are
meaningless and the law tells you nothing.

It is also silent on variance. $L = \lambda W$ describes averages only, so a system with
a perfectly acceptable mean and a catastrophic p99 satisfies it exactly. For tails you
need [[the tail at scale]], not this.

## Source

John D. C. Little proved the result in 1961; it had been used as folklore in queueing
theory before that without a general proof. Donald Reinertsen's *Principles of Product
Development Flow* is what popularised applying it to work items rather than packets,
which is where the WIP-limit practice in Kanban comes from.
