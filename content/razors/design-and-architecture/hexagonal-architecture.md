---
type: razor
title: Hexagonal architecture
sidebar_position: 12
family: Design and architecture
defines: [hexagonal architecture, ports and adapters]
sources:
  - "Alistair Cockburn, 'Hexagonal Architecture' (2005)"
  - "Robert C. Martin, 'The Clean Architecture' (2012) — a later variant"
---

## Statement

Push the database and the UI to the edges as adapters, so the domain can be tested without either.

## In plain terms

**Hexagonal architecture** — also called **ports and adapters** — inverts the usual layering. Rather
than the domain sitting on top of the database, the domain sits in the middle and defines the
interfaces it needs. The database, the HTTP layer and the message queue are all adapters plugged
into those interfaces, and all of them are replaceable.

## Decides

Which direction dependencies point between the domain and its infrastructure.

## Why it holds

The observation Cockburn started from is that the database and the user interface are the same kind
of thing — external systems the application talks to — and layering that treats one as "below" and
one as "above" is an accident of how applications are usually drawn.

Treating both as adapters produces the useful property: the domain has no compile-time dependency
on anything external. It defines **ports** — interfaces expressed in its own vocabulary — and
adapters implement them.

Testability is the immediate payoff and it is large. Domain logic can be exercised with in-memory
adapters, in milliseconds, with no database, no HTTP and no fixtures — which is what makes it
practical to have thousands of tests over business rules rather than dozens.

Replaceability is the second. Changing a database, adding a second API protocol or moving to a
different queue touches only the adapter, because nothing in the domain knows which one is in use.

The direction of dependency is the whole trick. Infrastructure depends on the domain; the domain
depends on nothing — which is why the interfaces have to be defined by the domain rather than by
the database library.

## Example

An order service is written in the conventional layered way: controllers call services, services
call repositories, repositories are the ORM's classes, and domain objects are ORM entities.

Testing a pricing rule requires a database. The test constructs an Order — which is an ORM entity,
so it needs a session — saves related records to satisfy foreign keys, and takes 400ms. There are
sixty such tests and the suite takes four minutes.

The hexagonal version defines an `OrderRepository` port in the domain, expressed in domain terms.
The ORM implementation is an adapter that lives outside; the tests use an in-memory implementation
that is thirty lines.

Pricing rules are now pure functions over domain objects with no persistence concept, tested in
under a millisecond. The sixty tests take 200ms in total, so they run on every save rather than in
CI.

Two years later the team adds a GraphQL API alongside the REST one. It is a second inbound adapter
against the same ports, and no domain code changes at all — which is the property the structure was
bought for.

## Limits

It is overhead for small applications. A CRUD service with no meaningful domain logic gets ports,
adapters and mapping code protecting logic that does not exist, and the direct version is better.

The mapping between domain models and persistence models is also real work, and teams frequently
abandon the pattern at exactly that point — deciding the ORM entity is close enough to the domain
object, which quietly reintroduces the dependency.

And the payoff is proportional to how much domain logic there is. Where the interesting behaviour
is in queries and the application is mostly a thin layer over a database, hexagonal architecture is
ceremony around a database.

## Source

Cockburn published the pattern in 2005, having developed it through the early 2000s, explicitly to
solve two recurring problems: business logic leaking into the user interface, and applications that
could not be tested without their infrastructure.

Later variants — Clean Architecture, Onion Architecture — differ mainly in how many concentric
layers they name. The load-bearing idea is the same in all of them: dependencies point inward, and
the domain defines the interfaces.
