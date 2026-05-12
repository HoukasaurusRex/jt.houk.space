---
title: "A Practical Guide to Spending A Thousand Dollars on Your AI API Key in a Day or: How to Go Bankrupt Fast"
created_at: "2026-03-23T14:37:27.513Z"
updated_at: "2026-03-23T14:37:27.513Z"
tags:
  - "ai"
  - "tutorial"
summary: ""
author: "JT Houk"
location: "Montreal"
---

## Notes

- Oops, I Opus'd everything.
  - when planning, you can use opus for more conceptual brainstorming and ideation, but once you start executing, the lack of precision and verbosity
    becomes a liability.
  - Opus can be good at converting a high-level conceptual plan into a detailed execution plan for sonnet to follow though
  - It's not always cheaper to use the smaller models though. Some high-level or ambiguous tasks will create inefficient investigation patterns
    like with complex errors in code, architectural or structural problems with a project, or heavily interdependant or unique test setups.
- "Analyze this repository for me and tell me what you find"
  *well I found your wallet and I know how to use it*.
- "Investigate this error while I go get a coffee"
  *well that didn't work, why don't I try doing the same thing slightly differently but this time I'll consume the entire log output.
  well that didn't work, why don't I try doing the same thing slightly differently and start thumbing through this interesting looking node_modules
  folder.*
  - assume the perspective of the LLM here like you're maliciously complying
- Are you writing a script to call a LLM API?
  - Start from the bottom up, using the cheapest, quickest models first and only scaling up when you have a specific need for more conceptual
    awareness.
- Fast, good, cheap triangle applies
- Keeping context windows low.
  - Do you really need to send all of the wonderful work you did context pumping your model to write that very clever state management system
    to adjust the container padding of your button element?
- Refining plans before implementing can reduce costs
  - Fewer complex errors produced when considered in design step
  - Code produced easier for you and agents to debug
- Some things are made for human eyes
  - Design quirks and UX
- Your model is not your friend
  - Don't ask it to do things that are better for you to do with a search engine or a debugger
  - Don't get it to generate assets more complicated than a pencil - it will try by default (e.g. add a skull and crossbones icon)
    and they will be bad
- Planning mode is not cheap, but implementation is much more expensive.
- Don't auto-accept commands like testing - models can get hung up on solving something inefficiently when you might already know the answer,
  especially when the problem is known in the project.
- Use ccusage
- Like children, each LLM responds better to different command styles.
  - e.g. While Opus likes to pick its own insights from examples, Sonnet likes being given clear rules and responds well to instruction formatting.
    Haiku gets the hammer and a safe little box to hit stuff in.
- Never underestimate the power of a bad decision made iteratively
- Have you tried just getting it right the first time?
- The fast, good, cheap triangle has not retired. It just started billing per million tokens.
- Prompting is a plan with intent
- I wrote a memory tool that uses a vector database and a custom retriever to keep the context window low and costs down. It works,
but there was also a case where it would return all results if not filtered and was polluting my context with 5000 tokens with information on my
funky design preferences on my golang proxy server agents
- I've been having some success with creating subagents to handle repetitive tasks (e.g. plan_from_ticket, review_plan, implement_plan, etc.)
  - Balances cost while taking advantage of using appropriate models for the task
  - "Give your robot its own robots"
