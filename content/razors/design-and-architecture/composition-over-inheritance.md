---
type: razor
title: Composition over inheritance
sidebar_position: 4
family: Design and architecture
defines: [composition over inheritance, the fragile base class]
sources:
  - "Erich Gamma, Richard Helm, Ralph Johnson and John Vlissides, Design Patterns (1994)"
  - "Barbara Liskov, 'Data Abstraction and Hierarchy' (1987) — the substitution principle"
---

## Statement

Inheritance couples you to a parent's decisions forever; composition lets you change your mind.

## In plain terms

**Composition over inheritance** says to build objects out of other objects rather than by
extending them. Inheritance ties a subclass to every implementation decision in its parent —
including the ones nobody documented — and the relationship cannot be changed at runtime or undone
cheaply.

## Decides

Whether to extend an existing class or hold an instance of something and delegate to it.

## Why it holds

Inheritance is the strongest coupling a language offers. A subclass depends on the parent's public
interface, its protected members, its internal call order, and its assumptions — most of which were
never written down.

**The fragile base class** problem is the consequence. A change inside the parent that respects its
own contract can still break subclasses, because they depended on details the contract never
mentioned. The parent's author cannot know what is safe to change, which means the class ossifies.

The taxonomy problem is the second failure. Inheritance forces a single hierarchy, and real domains
have several independent axes — a payment can be recurring or one-off, domestic or international,
card or bank transfer. Modelling that as a class tree produces a combinatorial explosion; modelling
it as composed behaviours does not.

Composition also changes at runtime, which inheritance cannot. An object that holds a strategy can
swap it; a subclass is what it is for its lifetime.

The Gang of Four's argument is that composition keeps each class encapsulated and focused, and that
class hierarchies stay small — which is why most of their patterns are composition arrangements
rather than inheritance ones.

## Example

A notification system starts with a `Notifier` base class and `EmailNotifier` and `SmsNotifier`
subclasses. Clean, and it fits.

Then requirements arrive: some notifications retry, some are rate-limited, some are batched, some
are urgent and skip batching. Each is independent of the transport.

The inheritance version produces `RetryingEmailNotifier`, `BatchedRetryingEmailNotifier`,
`RateLimitedSmsNotifier` and eventually a class per combination — and adding a third transport
doubles the tree.

The composed version has one `Notifier` holding a transport, a retry policy and a batching policy.
Adding a transport is one new class; adding a policy is one new class; the combinations require no
code at all, and a notification can change its retry policy at runtime because the policy is a
field rather than a type.

## Limits

It is a default, not a prohibition. Inheritance is the right tool for genuine is-a relationships in
a stable hierarchy, and interface inheritance — implementing a contract without inheriting
behaviour — carries almost none of the coupling.

Composition also has costs. More objects, more wiring, more indirection, and a call path that goes
through several small collaborators is harder to follow than one that goes to a parent method.

The useful test is Liskov's: if every subclass can be substituted for the parent without any caller
noticing, inheritance is modelling something real. If callers have to check the concrete type, the
hierarchy is describing something that is not a hierarchy.

## Source

The principle is stated in *Design Patterns* as one of two central themes — "favour object
composition over class inheritance" — alongside programming to an interface rather than an
implementation.

Liskov's substitution principle supplies the test that makes the choice decidable, and the fragile
base class problem was documented extensively in the 1990s as large class libraries reached the age
where their parents could no longer be changed.
