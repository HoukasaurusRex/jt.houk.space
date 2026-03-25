---
title: "A Practical Guide to Spending A Thousand Dollars on Your AI API Key in a Day or: How to Go Bankrupt Fast"
created_at: "2026-03-23T14:37:27.513Z"
updated_at: "2026-03-23T14:37:27.513Z"
tags:
  - "ai"
  - "tutorial"
summary: "Hard-won lessons on how fast an unguarded AI API key can drain your wallet—and how to stop it."
author: "JT Houk"
location: "Montreal"
---

## Notes

- Oops, I Opus'd everything.
  - when planning, you can use opus for more conceptual brainstorming and ideation, but once you start executing, the lack of precision and verbosity
becomes a liability.
  - fortunately, Opus is great at converting a high-level conceptual plan into a detailed execution plan for sonnet to follow.
- "Analyze this repository for me and tell me what you find" *well I found your wallet and I know how to use it*.
- "Investigate this error while I go get a coffee"
  *well that didn't work, why don't I try doing the same thing slightly differently but this time I'll consume the entire log output.
well that didn't work, why don't I try doing the same thing slightly differently and start thumbing through this interesting looking node_modules
folder.*
- Are you writing a script to call a LLM API?
  - Start from the bottom up, using the cheapest, quickest models first and only scaling up when you have a specific need for more conceptual
awareness.
- Fast, good, cheap triangle applies

## The Morning I Watched Four Figures Disappear Before Coffee
<!-- Open with the exact moment of discovery—the billing dashboard refresh, the stomach-drop. What was the project? Was it a demo, a side hustle,
a "quick experiment"? The more mundane the origin, the more universal the dread. Resist explaining too early; let the reader sit in the confusion with
you. -->

## How Infinite Scale Became Our Problem, Not a Feature
<!-- The API's "it just works" promise is also what makes it dangerous. Riff on the asymmetry: the same property that makes LLM APIs magical in
demos—no provisioning, no capacity planning—removes every natural circuit breaker we've trained ourselves to rely on. Cloud veterans know this feeling
from S3 egress or Lambda runaway loops. Draw that parallel. -->

## The Taxonomy of Ways We Burned Money (So You Don't Have To)
<!-- This is the technical core. Think in failure modes, not advice: runaway retry loops, fat context windows on every call, no token budgeting,
dev keys with prod limits, forgotten background jobs. Ground each one in a plausible "it seemed reasonable at the time" decision.
The goal is recognition, not shame. -->

## The Guardrails Nobody Tells You to Set on Day One
<!-- Concrete, practitioner-grade controls: hard spending caps, per-key limits, alerting before the threshold not after,
request logging with cost attribution, circuit breakers in code. Frame these as the infra checklist you'd run before opening a port to the
internet—same stakes, different vector. -->

## Treat Your API Key Like a Loaded Gun You've Left on the Counter
<!-- Land the conviction: the industry has normalized "move fast and add billing alerts later" and someone always pays for it.
Challenge the idea that this is a beginner mistake—plenty of seniors get burned because the tooling defaults to permissive. End with a specific,
memorable rule of thumb the reader can carry out of the article. -->
