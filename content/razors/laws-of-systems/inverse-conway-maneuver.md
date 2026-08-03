---
type: razor
title: The inverse Conway manoeuvre
sidebar_position: 6
family: Laws of systems
defines: [inverse Conway manoeuvre]
sources:
  - "Jonny LeRoy and Matt Simons, ThoughtWorks Technology Radar (2015)"
  - "Melvin Conway, 'How Do Committees Invent?' (1968)"
  - "Matthew Skelton and Manuel Pais, Team Topologies (2019)"
---

## Statement

If the architecture follows the org chart, change the org chart to get the architecture you want.

## In plain terms

[[Conway's Law]] observes that systems copy the communication structure of the organisation that
builds them. The **inverse Conway manoeuvre** treats that as a lever rather than a warning: rather
than designing a boundary and fighting the org chart to maintain it, restructure the teams so the
boundary you want becomes the cheap path.

## Decides

Whether to fix a structural architecture problem with design work or with a team change.

## Why it holds

Communication paths determine what is cheap to change. Two people on one team alter an interface in
an afternoon; two teams in different reporting lines negotiate it over a month — so the interface
between them hardens whether or not anyone designed it to.

That means a boundary that fights the organisation erodes. You can design a clean separation
between two teams that share a manager, a roadmap and a database, and within two quarters there is
a shortcut across it — not from carelessness, but because the shortcut is cheaper and cheap paths
win.

Restructuring changes the economics rather than the rules. Once two groups are separately staffed,
separately on call and separately accountable, defining a clean interface is in their own interest,
and the design starts happening without anyone advocating for it.

The failure mode is doing half of it. Splitting reporting lines while leaving the shared database
and the shared release train changes nothing — the dependency was the binding constraint, and the
org chart was only the reason nobody had removed it.

## Example

Two teams release together every time, and six attempts to define a clean interface have all
eroded within a quarter.

The seventh attempt is another interface specification: versioned API, contract tests, five weeks
of design work. Two quarters later three fields have been added by direct database access and the
release train is unchanged.

Reading it as an organisational fact produces a different diagnosis. Same manager, one shared
roadmap, one shared database, one release train, one on-call rotation covering both — that is a
single team with two names, and no interface between two halves of one team survives a deadline.

The manoeuvre sequences the dependency and the structure together: separate the on-call rotation,
split the schema behind views, separate the release trains, then separate the reporting lines. The
architecture that six specifications failed to enforce then appears because it has become the
easiest way to work.

## Limits

Team structure is usually a manager's decision, so this is a razor an engineer supplies the
argument for rather than executes. Stating it in Conway's terms — "we cannot get independent
deploys while two teams share a schema and a release train" — is what converts it from an
architectural preference into a resourcing conversation.

Reorganisations are also expensive and disruptive, they lose context, and they are frequently done
for reasons unrelated to architecture. Proposing one to fix a design problem is a large ask and
should be reserved for problems that are genuinely structural.

And it does not work alone. Changing the org chart without changing the underlying dependencies
produces the same coordination with more meetings.

## Source

The phrase comes from Jonny LeRoy and Matt Simons at ThoughtWorks, entering wider use through the
Technology Radar around 2015, as a deliberate application of Conway's 1968 observation.

Skelton and Pais build the practical framework around it in *Team Topologies*, where team
structure is treated as a first-class design tool and cognitive load is the constraint that decides
where the boundaries go.
