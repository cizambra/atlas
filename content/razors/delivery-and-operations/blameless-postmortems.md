---
type: razor
title: Blameless postmortems
sidebar_position: 11
family: Delivery and operations
defines: [just culture, near miss]
sources:
  - "John Allspaw, 'Blameless PostMortems and a Just Culture', Etsy (2012)"
  - "Sidney Dekker, Just Culture (2007)"
  - "Google SRE Book, postmortem culture chapter (2016)"
---

## Statement

People act reasonably given what they knew; asking who erred buys silence, asking what made it look
right buys information.

## In plain terms

A [[blameless postmortem]] is not about being nice. It is a trade: you give up the satisfaction of
attribution and you get the information that only the person involved has. Once naming someone has
consequences, people stop volunteering the detail that explains the decision — and that detail was
the finding.

## Decides

How to run the analysis after something breaks.

## Why it holds

The mechanism is incentive rather than kindness. If being named has costs, people optimise for not
being named: the omitted detail, the unmentioned workaround, and — most expensively — the
unreported **near miss**, which is the cheapest information an organisation ever gets.

What you lose is the reasoning. The engineer who made the change knows why it looked safe, and that
reason is the systemic finding: the documentation said X, staging did not have Y, the alert had
fired falsely eleven times so it was ignored.

**Just culture** is the precise version, and it is not consequence-free. Dekker's distinction is
between honest mistakes made in a system that permitted them, and genuine recklessness or repeated
negligence — the first is a systems question, the second is a management one, and blamelessness
covers the first.

The test that catches the failure: if the postmortem's finding is "the engineer should have been
more careful", nothing was learned. Careful was already the input, and the next engineer will have
exactly the same information.

## Example

A config change takes checkout down for four hours. The blameful version writes "root cause: human
error — engineer deployed an invalid config", and adds a mandatory second approver on all config
changes.

Three things follow. Config deploys now take a day, which is a permanent tax on every safe change.
The next near miss goes unreported, because reporting one now looks like volunteering for scrutiny.
And the same class of failure recurs in Q3 with a different name attached.

The blameless version asks what would have to be true for deploying it to be the right action, and
finds five degraded defences: validation ran in CI but not at deploy, staging had a different config
shape so it passed there, the deploy tool reported success before the rollout finished, the relevant
alert had been muted after eleven false positives, and the runbook described a system replaced eight
months earlier.

Every one of those existed the day before the incident, and every one is fixable. "Be more careful"
addresses none of them.

The second version also produces something the first cannot: the next near miss gets reported, in
week three, and is fixed before it becomes an incident.

## Limits

Blameless is not accountability-free, and the conflation is the most common misreading. A just
culture still addresses recklessness, deliberate shortcuts around known controls, and repeated
patterns after the context has been supplied.

It also does not mean the analysis is soft. A rigorous blameless postmortem is more uncomfortable
than a blameful one, because it examines decisions the organisation made rather than one someone
made in a moment.

And the practice degrades if action items rot. A postmortem whose findings are never implemented
teaches people the process is theatre, at which point the honesty it depends on stops being
offered.

## Source

Allspaw's 2012 Etsy post is the canonical engineering statement, drawing on Dekker's work in
aviation and healthcare safety, and it introduced the argument in the form most engineers
encountered it.

Dekker's *Just Culture* supplies the harder distinction — between an honest mistake, a risky
choice, and reckless behaviour — which is what makes blamelessness a coherent policy rather than a
blanket amnesty.
