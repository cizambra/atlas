---
type: razor
title: Conway's Law
family: Laws of systems
defines: [Conway's Law]
sources:
  - "Melvin E. Conway, 'How Do Committees Invent?' Datamation (1968)"
  - "Nagappan et al., Microsoft Research (2008) — organisational structure predicts defect-proneness"
---

## Statement

Any organisation that designs a system will produce a design whose structure copies the
communication structure of that organisation.

## In plain terms

Software comes out shaped like the org chart that built it. Two teams who talk all day produce
parts that fit together; two teams who barely talk produce a seam between them, an API, a
handoff. If you want a different architecture, you usually have to change who talks to whom
first.

## Decides

Whether the architecture problem in front of you is actually an architecture problem, or
an organisational one wearing its clothes.

## Why it holds

An interface between two components is an agreement between the people who own them.
Reaching an agreement costs communication, and communication is cheap inside a team and
expensive across an organisation.

So teams that talk constantly produce components that assume things about each other,
because it was easier to coordinate than to specify. Teams that rarely talk produce
strict, narrow interfaces, because that is the only kind of agreement they can afford to
maintain.

Nobody decides this. It is the accumulated result of thousands of small choices about
what is easier this afternoon, which is why exhortation does not counter it and
restructuring does.

## Example

Three teams are asked to build a checkout system, and produce three services. This
surprises nobody.

What is worth noticing is the fourth thing they produce: a shared library that all three
depend on, owned by none of them, containing exactly the logic that did not fit cleanly
in one team's boundary. It becomes the most-changed and least-maintained code in the
system.

That library is Conway's Law leaving a receipt. The org chart had no home for
cross-cutting concerns, so the architecture grew an orphan.

## Limits

It is descriptive, not prescriptive. Conway's Law does not say the mirrored architecture
is wrong — if your team boundaries match your domain boundaries, the mirroring is
exactly what you want, and fighting it produces an architecture nobody can staff.

The inverse manoeuvre — reshaping teams to get the architecture you want — is real but
slow and expensive. It works on the scale of quarters, and it costs people their
context, their relationships, and often their goodwill. It is not a refactoring
technique.

It also does not apply cleanly below a certain size. A four-person team has one
communication structure, so the law predicts nothing useful about how they should split
their code.

## Source

Melvin Conway's paper was rejected by *Harvard Business Review* on the grounds that he
had not proved his thesis, and appeared in *Datamation* in 1968. The empirical support
arrived much later: a 2008 Microsoft Research study found organisational metrics
predicted which components would be defect-prone better than code metrics did.
