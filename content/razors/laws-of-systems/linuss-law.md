---
type: razor
title: Linus's Law, and its limits
sidebar_position: 21
family: Laws of systems
defines: [Linus's Law]
sources:
  - "Eric S. Raymond, The Cathedral and the Bazaar (1997)"
  - "Heartbleed (CVE-2014-0160) and the Core Infrastructure Initiative response (2014)"
---

## Statement

Given enough eyeballs all bugs are shallow — but Heartbleed showed eyeballs must actually be
looking.

## In plain terms

**Linus's Law** claims that with enough people reviewing code, someone will spot any given bug. The
mechanism is real and the premise is the weak part: "enough eyeballs" describes people actually
reading the code with the relevant expertise, and being publicly available is not the same as being
read.

## Decides

How much assurance to draw from the fact that code is open, or that many people use it.

## Why it holds

The underlying mechanism is sound. Different reviewers have different expertise and different
mental models, so a bug invisible to one is obvious to another — and the probability that a given
defect is caught rises with the number of genuinely independent readers.

The premise is what fails. Availability is not review. A widely-used library may have very few
people who have ever read its security-critical parsing code, and users overwhelmingly assume
somebody else has.

Heartbleed is the definitive counterexample. A missing bounds check in OpenSSL's heartbeat
extension — code protecting a large fraction of internet traffic — went undiscovered for two years.
The eyeballs existed in principle, the code was open, and almost nobody was reading that file. The
Core Infrastructure Initiative was founded afterwards specifically to fund review of critical
infrastructure that everyone depended on and nobody was paid to examine.

The corrected form is that bug-finding scales with *attention*, not with exposure — and attention
has to be arranged and usually funded.

## Example

A company's dependency audit finds a JSON-parsing library used in every service, with 40,000
GitHub stars and eleven years of history.

The natural inference is that a library this widely used has been thoroughly examined. It is
battle-tested by definition.

The actual state is knowable and nobody checks it. Two maintainers, one of whom is inactive. The
last commit to the parser core was three years ago. There has never been an external security
audit, and the fuzzing setup in the repository was last run in 2022.

Popularity measured usage rather than review, and the two are uncorrelated — a library used by
thousands of teams who each assumed the others had looked is exactly the Heartbleed shape.

The response is not to stop using it. It is to stop treating popularity as evidence of scrutiny:
fund an audit, run a fuzzer, or accept the risk explicitly rather than by assumption.

## Limits

The law is broadly right for the class of bugs many users encounter. Crashes, wrong output and
common-path defects genuinely are found quickly by a large user base, because using the software
surfaces them.

It is weakest exactly where it matters most. Security vulnerabilities in rarely-executed code paths
produce no symptom for ordinary users, so no amount of usage finds them — they require someone
deliberately looking, with the right expertise.

The bystander effect also works against it. The more users a project has, the more each of them
assumes review is someone else's contribution, which is why the most depended-upon libraries are
frequently the least examined per unit of dependence.

## Source

Raymond formulated it in *The Cathedral and the Bazaar*, naming it after Linus Torvalds and
presenting it as the core advantage of open, bazaar-style development over closed development.

Heartbleed in 2014 is the case that forced the qualification, and the industry response — funded
audits, dedicated security review for critical infrastructure, and continuous fuzzing — is an
implicit admission that eyeballs do not arrive on their own.
