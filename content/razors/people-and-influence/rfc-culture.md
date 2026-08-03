---
type: razor
title: RFC culture
sidebar_position: 14
family: People, organization, influence
defines: [RFC process]
sources:
  - "IETF RFC 2026, 'The Internet Standards Process' (1996)"
  - "Rust RFC process, rust-lang/rfcs (2014–)"
  - "Oxide Computer, 'RFD: Requests for Discussion' (2020)"
---

## Statement

Make the design reviewable in writing before it is built, so disagreement is cheap and recorded.

## In plain terms

An **RFC process** gives proposals a defined lifecycle: written, circulated, discussed, accepted or
rejected, with the outcome recorded. The value is in the two ends — disagreement before
implementation is cheap, and the [[decision record]] answers "why is it like this" years later when
everyone involved has left.

## Decides

Whether a class of decision should go through a written process, and what that process needs.

## Why it holds

The cost of disagreement rises sharply with implementation. An objection raised against a document
costs a rewrite; the same objection against three weeks of code costs three weeks, and the author is
now invested in defending it.

The lifecycle is what distinguishes a process from a document. Everyone knows where proposals go,
who decides, and when discussion ends — and the last is the part that matters most, because an
open-ended design discussion has no natural termination and can absorb months.

The record is the half that pays out latest and largest. Two years on, the people are gone and the
reasoning is not in the code, so the next team either preserves a constraint that expired or removes
one that is load-bearing. Both are expensive and both are prevented by two paragraphs.

Legitimacy is the third function. A decision that went through a known process is harder to
relitigate than one made in a meeting, which matters for decisions that will be questioned
repeatedly.

The scope is where these processes fail. Applied to everything, an RFC process produces a queue, a
backlog of undecided proposals and engineers who route around it — so it belongs on decisions that
are expensive to reverse or that bind other teams, and nothing else.

## Example

An organisation introduces an RFC process for architectural decisions.

The first year works well. Proposals get written, reviewed by people who would otherwise have found
out later, and accepted or rejected with the reasoning attached. Two proposals are rejected on
objections that would have surfaced in month three of implementation.

The failure appears in year two, and it is the undecided proposal. Eleven RFCs are open, some for
eight months — neither accepted nor rejected, because nobody owns closing them.

That is worse than rejection. The authors cannot proceed, adjacent work is blocked on an unresolved
question, and the process now has a reputation as the place proposals go to stall.

The fix is a default outcome and a named closer: every RFC has a decider, a decision date, and an
automatic status of rejected if the date passes without a decision. Rejection is recoverable — the
proposal can be resubmitted — and ambiguity is not.

The other correction is scope. Narrowing the process to decisions that are hard to reverse or that
bind other teams cuts the volume by two thirds, which is what makes the remaining ones get the
attention they need.

## Limits

The overhead is real and is frequently misapplied. A process designed for architectural decisions
applied to routine changes produces ceremony, and the correct response to most proposals is a pull
request with a good description.

It also privileges people who write well and have time, which is a fairness question rather than a
process one. Someone with a good idea and poor written English is disadvantaged by a written
process in a way they are not by a conversation.

And a record is only useful if it is findable. RFCs in a wiki nobody searches, or in a tool that was
migrated away from, are the same as no record — which is the argument for keeping them in the
repository.

## Source

The form comes from the IETF, where Requests for Comments have documented internet protocol
decisions since 1969, and RFC 2026 formalises the standards process itself.

Rust's RFC process is the most influential software adaptation, and Oxide's RFD process is the most
fully specified — with an explicit state machine, numbered documents in a repository, and a
deliberate emphasis on writing things down before they are built.
