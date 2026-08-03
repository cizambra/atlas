---
type: razor
title: SOLID, and the CUPID critique
sidebar_position: 5
family: Design and architecture
defines: [SOLID, single responsibility, open-closed, interface segregation, dependency inversion, CUPID]
sources:
  - "Robert C. Martin, principles collected from 1995; acronym by Michael Feathers (~2004)"
  - "Barbara Liskov (1987) — the substitution principle"
  - "Dan North, 'CUPID — for joyful coding' (2021)"
---

## Statement

Five object-oriented principles worth knowing by name — and worth knowing that Dan North's CUPID
argues they optimise the wrong thing.

## In plain terms

**SOLID** collects five design principles into an acronym. They are widely taught, occasionally
useful, and applied dogmatically they produce codebases full of interfaces with one implementation.
North's counter-proposal is that the principles are hard to apply and prescriptive, and that a
different set of properties predicts good code better.

## Decides

What vocabulary to use when discussing object-oriented design, and how much weight to give any of
it.

## Why it holds

The five, briefly:

- **Single responsibility** — a class should have one reason to change. The most useful of the
  five and the vaguest; "reason to change" is doing all the work, and Martin's later gloss ties it
  to one stakeholder rather than one function.
- **Open-closed** — open for extension, closed for modification. Sound where the extension point
  was correctly predicted, and the prediction is what [[YAGNI]] warns about.
- **Liskov substitution** — a subtype must be usable anywhere its parent is. The strongest of the
  five, because it is falsifiable: if callers check the concrete type, the hierarchy is wrong.
- **Interface segregation** — many small interfaces beat one large one, so implementers are not
  forced to depend on methods they do not use.
- **Dependency inversion** — depend on abstractions rather than concretions, so the policy does not
  compile against the detail.

Their common value is vocabulary. Naming a problem "this violates Liskov" is faster and less
personal than describing it, and shared names are most of what design discussion runs on.

North's **CUPID** critique is that the five are properties of code you can achieve while producing
something unpleasant to work in, and he proposes composable, Unix-philosophy, predictable,
idiomatic and domain-based as properties that better predict whether code is joyful to change.

## Example

A team adopts SOLID as a review standard, and a year later the codebase has a recognisable shape.

Every service class has an interface with exactly one implementation, because dependency inversion
was read as "always depend on an interface". Every class has one method, because single
responsibility was read as one function. Following a single request path means opening eleven files.

None of the individual decisions is indefensible and the result is worse than the code it replaced
— navigating it requires an IDE, the interfaces carry no information because there is nothing to
vary, and a new engineer takes four months to become productive.

The CUPID reading asks different questions of the same code:

- is it predictable — can I tell what it does without running it?
- is it idiomatic for this language?
- is it organised around the domain rather than around a layer?

On those, the eleven-file path fails plainly, where SOLID scored it well.

Neither set is a rule. The difference is that one measures structural properties and the other
measures whether the code is pleasant to change, and only the second predicts the outcome the team
wanted.

## Limits

SOLID is object-oriented and largely class-oriented, so it transfers poorly to functional code,
data-oriented designs and small scripts. Applying it universally is a category error.

The principles are also individually contested. Open-closed encourages speculative extension
points; single responsibility is unfalsifiable without a definition of "reason"; interface
segregation is nearly always right and nearly always trivial.

And the acronym has done damage by being memorable. Five principles that fit an initialism are not
therefore the five that matter most — Feathers assembled the ordering to make the word, which is
not a design argument.

## Source

Martin collected the principles across papers from the mid-1990s, and Michael Feathers arranged
them into the acronym around 2004. Liskov's substitution principle predates the collection and
comes from a 1987 keynote on data abstraction.

North's 2021 essay is the most substantial critique from inside the community: his argument is not
that the principles are wrong but that they are neither necessary nor sufficient for good code, and
that properties of the experience of working with code predict quality better than structural rules
do.
