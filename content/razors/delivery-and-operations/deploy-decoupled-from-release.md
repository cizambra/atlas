---
type: razor
title: Deploy decoupled from release
sidebar_position: 6
family: Delivery and operations
defines: [dark launch, feature flag, kill switch]
sources:
  - "Continuous delivery practice; Humble and Farley (2010)"
  - "Martin Fowler, 'FeatureToggle' (2010, revised 2017 with Pete Hodgson)"
---

## Statement

Ship the code dark and turn it on separately, so deployment risk and product risk stop being the
same event.

## In plain terms

Deploying is putting code on servers. Releasing is making behaviour visible to users. Coupling them
means every product decision is also a deployment, and every deployment carries product risk. A
**feature flag** separates them: the code ships inert, and turning it on is a config change with its
own timing and its own rollback.

## Decides

Whether the moment code reaches production and the moment users see it should be the same moment.

## Why it holds

The two carry different risks and want different responses. Deployment risk is technical — the
build, the migration, the startup — and its mitigation is small batches and fast rollback. Product
risk is behavioural, and its mitigation is exposing it gradually and measuring.

Coupling them means every mitigation has to serve both, badly. Rolling back a bad feature means
rolling back a deploy that also contained four unrelated fixes; testing a feature in production
means deploying it to everyone.

Decoupled, each is handled on its own terms. A **dark launch** puts the code in production where it
can be exercised without being visible — running the new path in shadow, comparing outputs, warming
caches — before any user is affected.

The **kill switch** is the operational half and the one that pays for the machinery on its own. A
feature that can be disabled in seconds, without a deploy, converts a class of incident from a
rollback into a config change.

It also unblocks [[trunk-based development]]. Incomplete work can live on trunk behind an off flag,
which is what makes daily integration possible without shipping half-finished behaviour.

## Example

A team rewrites the pricing engine. The old and new must agree, and being wrong is expensive.

The coupled version deploys and switches at once. If the new engine is wrong, the discovery is
customer-facing, and the fix is a rollback that also reverts the week's other changes.

The decoupled version deploys the new engine dark. It runs on every request in shadow — computing a
price, logging it, discarding it — while the old engine serves. A comparison job reports
disagreements.

Two weeks of shadow traffic finds three discrepancies, all in edge cases nobody's tests covered:
a currency rounding difference, a grandfathered plan, and a mid-cycle upgrade. Each is fixed and
redeployed with the flag still off, so no customer ever saw any of them.

Then the release is a separate, gradual decision: 1% of traffic, then 10%, then all — with a kill
switch that returns to the old engine in seconds. The technical risk was retired in week one; the
product risk was retired one increment at a time.

## Limits

Flags are debt with a fast clock. Each is a branch in the code, combinations multiply, and a
codebase with two hundred live flags has a state space nobody can test. Removal has to be part of
the process, with an owner and a date, or the mechanism becomes the problem.

Testing also gets harder. Every flag doubles the theoretical configuration space, and while most
combinations are irrelevant, the ones that are not tend to be discovered in production.

And not everything can be flagged. Schema migrations, protocol changes and anything with an
irreversible side effect need a different strategy — expand-and-contract rather than a switch.

## Source

The practice comes out of continuous delivery, where separating deployment from release is what
makes frequent deployment compatible with careful product rollout.

Fowler and Hodgson's revised article is the most useful taxonomy, distinguishing release toggles
(short-lived, removed after rollout) from ops toggles, experiment toggles and permission toggles —
each with a different expected lifetime, which is the distinction that decides how much the debt
matters.
