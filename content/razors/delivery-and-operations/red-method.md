---
type: razor
title: The RED method
sidebar_position: 9
family: Delivery and operations
defines: [RED method]
sources:
  - "Tom Wilkie, Weaveworks, 'The RED Method' (2018)"
  - "Google SRE Book (2016) — the golden signals it derives from"
---

## Statement

For every service: request rate, error rate, duration. Three metrics, uniform across everything you
run.

## In plain terms

The **RED method** is a deliberately narrow version of the [[golden signals]], dropping saturation
in exchange for something valuable: three metrics that mean exactly the same thing for every
service, so one dashboard template covers your whole estate and any engineer can read any service's
health.

## Decides

What to instrument on every service, identically, so nobody has to learn a new dashboard per
service.

## Why it holds

Uniformity is the point rather than a side effect. When every service reports the same three
metrics with the same names, an engineer paged for a service they have never seen can read its
health in seconds — which is exactly the situation on-call produces.

It also composes. Rate, errors and duration are additive across services, so you can view them per
endpoint, per service, per team or across the whole system without changing the model.

The three are chosen because they are what a *consumer* of a service experiences. Saturation is a
property of the implementation, and it varies by service — which is precisely why RED leaves it
out, since including it would break the uniformity that gives the method its value.

The trade is explicit. RED tells you a service is unhealthy and cannot tell you why, so the
diagnostic step needs resource metrics underneath — which is the [[USE method]]'s territory. Wilkie's
framing is that the two are complementary: RED for services, USE for the resources they run on.

The practical payoff is automation. Uniform metric names mean dashboards, alerts and SLOs can all be
generated rather than hand-built per service, which is what makes it viable across hundreds of
services.

## Example

An organisation runs 140 microservices, each instrumented by its own team. Some report
`http_requests_total`, some `requests`, some only log. Latency is a histogram in some, an average in
others, absent in most.

An engineer paged at 2am for a service they have not touched spends the first ten minutes finding
out what it exposes and what normal looks like.

Standardising on RED changes the shape of that. Every service reports request rate, error rate and
duration histogram, with the same names and the same labels, emitted by a shared middleware nobody
has to think about.

The dashboard is now generated from the service name. The alerts are generated from the SLO. An
engineer paged for any of the 140 sees the same three panels in the same positions, and can tell
within seconds whether the service is slow, failing, or receiving unusual traffic.

Diagnosis still needs the service's own metrics, and RED did not replace them. What it removed was
the ten minutes of orientation before diagnosis could start.

## Limits

It omits saturation deliberately, which means it has no leading indicator. RED tells you a service
is unhealthy now; it will not tell you that a connection pool has been climbing for forty minutes.

It is also specifically for request-driven services. Batch jobs, stream processors and cron work do
not have a request rate in any useful sense, and forcing them into the model produces metrics that
technically exist and mean nothing.

And uniformity has a cost at the edges. A service whose interesting failure mode is not visible in
rate, errors or duration will look healthy, and the standard template can create false confidence
precisely because it is standard.

## Source

Wilkie derived RED at Weaveworks from Google's golden signals, explicitly simplifying for
microservice environments where the number of services makes per-service dashboard work impractical.

He pairs it with Brendan Gregg's USE method in the same talk, and the pairing is the useful unit:
RED describes what consumers see, USE describes what the resources are doing, and most diagnoses
move from one to the other.
