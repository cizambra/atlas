---
type: razor
title: The rule of least power
sidebar_position: 9
family: Design and architecture
defines: [rule of least power]
sources:
  - "Tim Berners-Lee and Noah Mendelsohn, 'The Rule of Least Power', W3C (2006)"
---

## Statement

Choose the least powerful language that solves the problem — weaker formats are easier to analyse
and outlive their authors.

## In plain terms

The **rule of least power** inverts the usual instinct. Given a choice between a configuration
format, a template language and a full programming language, pick the weakest one that can express
what you need. Power buys expressiveness and costs analysability — and analysability is what lets
other tools, and other people, work with it later.

## Decides

Whether to express something in data, in a restricted language, or in code.

## Why it holds

The trade is between what you can say and what can be known about what you said. A declarative
format can be parsed, validated, diffed, transformed, migrated and reasoned about by tools that
have never seen it. A Turing-complete language can express anything and can only be understood by
running it.

That is the halting problem as an engineering constraint. You cannot in general determine what
arbitrary code does without executing it, so every capability built on top of it — static analysis,
automatic migration, safe transformation — becomes impossible or unreliable.

Longevity follows from the same property. Data in a simple format is readable in twenty years by
tools nobody has written yet; logic embedded in a scripting language is readable only by that
language's runtime, which will eventually stop being maintained.

Berners-Lee's example is the web itself. HTML is weak on purpose — it declares structure rather
than computing it — which is why search engines, screen readers, browsers and archives can all
process pages written by people who never anticipated any of them.

## Example

A team needs deployment configuration for forty services. Environment variables, resource limits,
health check paths, replica counts.

The expressive option is to write it in the application language: a config script per service, with
loops for environments, conditionals for regions, and shared functions for common patterns. It is
concise, DRY, and satisfying.

Two years later the costs are visible. Nobody can answer "which services have a memory limit above
2GB" without running forty scripts. A migration to a new deployment system requires a human to
read every script, because static analysis cannot tell what a config will evaluate to. A junior
engineer cannot change a replica count without understanding the shared function library.

The declarative version is more verbose and worse to write. It is also greppable, diffable in
review, machine-migratable, and analysable by tools that did not exist when it was written — and
answering the memory-limit question takes one command.

The generation problem is solvable in the weak version too: generate the declarative files from a
script, and commit the output. Power at build time, weakness at rest.

## Limits

Least power is not no power. A configuration format that cannot express a genuine requirement
forces the requirement into a worse place — a wrapper script, a manual step, or a comment telling
someone what to do by hand.

Formats also drift toward power under pressure. Templating, then conditionals, then loops, then
functions — most configuration languages have grown into accidental programming languages badly,
and the honest response at that point is to use a real one deliberately.

And the analysability benefit only pays if something is actually analysing. For a config file that
three people edit and no tool reads, the argument is much weaker and readability wins.

## Source

Berners-Lee and Mendelsohn published the rule as a W3C Technical Architecture Group finding in 2006,
generalising the design philosophy behind HTML, RDF and the web's other declarative formats.

The argument is explicitly about reusability of information: the more powerful the language, the
less that can be determined about what has been written in it, and the web's value depends on
information being processable by parties the author never anticipated.
