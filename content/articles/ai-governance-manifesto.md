---
category: "technology"
created_at: "2026-02-26T00:00:00.000Z"
updated_at: "2026-02-26T00:00:00.000Z"
title: "The People In The Room: A Manifesto for the Responsible Use of AI in Organizations with Access to Customer Data"
tags:
  - "ai"
  - "ethics"
  - "governance"
  - "privacy"
  - "surveillance"
  - "policy"
status: "published"
summary: "A call to action for the engineers, designers, and product people building AI systems, the people in the room when it gets built."
author: "JT Houk"
location: "Montreal"
date: "2026-02-26"
image: "https://res.cloudinary.com/doyxsswbb/image/upload/w_1200,c_limit,f_auto,q_auto/v1772142953/Person_in_White_Shirt_Mirror_qe6ufg.jpg"
image_credit: "Photo by <a href='https://unsplash.com/@theblowup'>the blowup</a> on Unsplash"
images:
  - url: "https://res.cloudinary.com/doyxsswbb/image/upload/w_1200,c_limit,f_auto,q_auto/v1772142953/Person_in_White_Shirt_Mirror_qe6ufg.jpg"
    credit: "Photo by the blowup on Unsplash"

---

> "The greatest dangers to liberty lurk in insidious encroachment by men of zeal, well-meaning but without understanding."
> — Justice Louis Brandeis, *Olmstead v. United States*, 1928

This piece began with a moment of genuine admiration.

At a recent internal innovation event, I watched talented engineers and product people present projects of real technical ambition. The energy was infectious, the kind that reminds you why this work matters and why the people doing it are extraordinary. One project, in particular, stood out for its creativity and commercial appeal: an AI system that used in-store camera footage to analyze how we physically interact with products (where we linger, what we reach for, what we put back) and surfaced those insights to store owners to improve product placement and performance.

It was clever. The business value was obvious. The team clearly believed in it.

And I found myself unable to shake a quiet discomfort I couldn't immediately name.

Any of us walking through that store would have had no idea any of it was happening. There is no notice, no opt-out, no way to simply exist in a physical space without surrendering our faces, our movements, and our behavioral patterns to a system we were never aware of, let alone consented to interact with. The intent was entirely benign: better products, better stores, better experiences. And yet the gap between that intent and the reality of what was being built felt wide and important.

This manifesto is an attempt to name that gap. Not to assign blame; the people building these systems are not villains, and the problems they're solving are real. But we are at a moment where the tools available to us have outpaced the ethical frameworks governing their use, and the people with the most power to close that gap are not just executives or regulators.

They are us. The people in the room when it gets built.

---

## I. The Consent Gap Has Moved Offline

For years, the conversation about digital privacy centered on what happens on screens: cookies, tracking pixels, behavioral advertising, data brokers. Slowly, imperfectly, legislation and public awareness have started to address those contexts. The [General Data Protection Regulation (GDPR)](https://gdpr-info.eu/) in Europe and the [California Consumer Privacy Act (CCPA)](https://oag.ca.gov/privacy/ccpa) in the United States established foundational rights: the right to know what is collected, to access and delete personal data, to opt out of sale, and to be protected from consequential automated decisions made without human review.

These are meaningful protections, though they remain poorly understood and inconsistently enforced even in the digital contexts they were designed for.

But a quiet shift is underway: AI is moving into physical spaces, and the consent frameworks we've been building don't follow us through the door.

When we visit a website, there is a legal and normative expectation (however imperfectly realized) that our behavior may be tracked. The cookie banner, for all its uselessness as genuine consent, represents an acknowledgment that collection is happening. When we walk into a physical space, we have no such awareness. We move freely, we browse, we make ordinary human decisions, unaware that cameras connected to AI systems may be analyzing our body language, inferring our demographics, mapping our behavioral patterns, and contributing that data to a model that will inform decisions we'll never know were made about us.

This is not a hypothetical future. It is a feature being built right now, in hackathons and product sprints, by well-meaning people who are focused on the genuine value it creates and haven't yet been given a framework for asking what else it does.

The same analytical gap applies to digital behavioral data, but physical surveillance carries a particular weight: we cannot see it happening, cannot move through a different browser or enable privacy tools, and retain no intuition that it's occurring. The consent gap, in physical spaces, is nearly total.

And it does not stop at the store entrance. Doorbells on our neighbors' houses capture our faces as we pass. Security cameras at every shop entrance stitch together a map of our daily movements. The infrastructure of neighborhood surveillance has been installed voluntarily, camera by camera, in the name of safety and convenience, and none of us consented to becoming a recurring node in someone else's network.

This is the context in which we are building. And it means the question of governance (who asks the hard questions, when, and with what authority) has never been more important.

---

## II. We Are All The Custodians of A Power We Did Not Ask For

The hardest thing about this moment is that most of the people building surveillance-capable AI systems are genuinely trying to help. They're solving real problems: helping small retailers compete, reducing product waste, understanding what we actually want instead of what we say we want. The business value is real. The technical achievement is real. The intent is real.

And none of that is sufficient protection against harm.

Participation in systems of harm rarely begins with bad actors. It begins with accumulated small decisions (each locally reasonable, none globally reviewed) that together build something no individual in the chain would have endorsed if they could see the whole picture:

**An AI system analyzes in-store foot traffic and product interaction** to give retailers insight into how we behave. The business case is clear. But the same data infrastructure, combined with a future partner integration, could enable the identification of specific individuals across multiple visits, the inference of health or economic circumstances from our purchasing patterns, or the contribution of our biometric behavioral data to third-party databases the retailer never audited.

**A retailer integrates a third-party analytics provider** without reviewing what that provider shares with data brokers, who sell it to insurance companies, who use it to adjust premiums for people in certain zip codes.

**A platform deploys a recommendation engine** that optimizes for engagement and inadvertently creates filter bubbles that radicalize users, not because anyone intended harm, but because no one asked what optimization for engagement would do at scale over time.

**A company sells its customer dataset** during acquisition due diligence, and that data is later used by the new owner in ways none of us ever anticipated.

**An organization provides footage or identity data** to a partner with law enforcement relationships, and that data is used to compile biometric profiles of people who attended a public gathering. Their identities are retained, shared, weaponized. Not because they did anything wrong. Because they were present. Because a camera saw them, and the infrastructure existed to do something with what it saw. This is not a cautionary hypothetical. It is a description of something that has already happened, that is happening now, built in part from the kind of commercial data infrastructure we design and deploy every day.

None of these scenarios require negligence. They require only an absence of deliberate governance, the organizational equivalent of building a vehicle without brakes because everyone was focused on making it go faster.

The [EU AI Alliance](https://futurium.ec.europa.eu/en/european-ai-alliance) describes organizational AI policy as the necessary middle layer between abstract ethical principles and formal regulation: the layer where values become rules, and rules become decisions. Without that layer, consequential choices get made by default, by whoever ships fastest, whoever asks the fewest questions, whoever optimizes hardest for the metric in front of them. Default choices, in systems with this much power, are not neutral. They tend to concentrate consequences in the communities least equipped to push back.

Building that middle layer is not a job for policy teams alone. It is a job for everyone who touches the system. You and me. The people in the room when it gets built.

---

## III. The Law Is a Floor, Not a Ceiling; And the Floor Is Still Being Built

Legislation is catching up, but it is catching up to yesterday's problems.

GDPR and CCPA were designed for digital data collection. The [EU AI Act](https://artificialintelligenceact.eu/) goes further, classifying AI systems that enable real-time biometric surveillance and social scoring as prohibited or high-risk, and requiring conformity assessments for systems that make consequential decisions about people. Brazil's LGPD, Canada's PIPEDA, Japan's APPI; the global direction is clear: explicit, granular, informed consent is becoming the expected standard.

But none of these frameworks fully address the physical-space consent gap. The person walking into a store, a venue, a workplace, or a public space has no equivalent of the cookie banner, no notification that an AI system is observing and analyzing their behavior. Regulators are beginning to grapple with this, but the legislative timeline is measured in years, and the deployment timeline for these systems is measured in months.

In that gap, organizational governance is not a nice-to-have. It is the only thing standing between a well-intentioned product and an unexamined one.

Organizations that build that governance now (those that establish clearer standards than regulators currently require) will be better positioned legally and reputationally than those who wait. But the stronger argument isn't competitive positioning. It's that the people whose behavior is being analyzed in these systems are not abstractions. They are us, people with rights and vulnerabilities and reasonable expectations about how we will be treated in the spaces we inhabit. We go to stores. We use apps. We walk through the same venues we instrument. The data in these systems belongs to people like us, and often to us directly.

We can do better than the minimum the law currently demands. And we should.

---

## IV. The Principles

The following is not a compliance checklist. It is a set of commitments: to each other and to everyone who will one day be on the receiving end of what we build, which is to say, to ourselves, about how we engage with the power we've been given.

### 1. Consent Must Follow the Person, Not the Platform

Consent is not a checkbox and it is not contextual. If an AI system is analyzing a person's behavior, that person should know about it and be able to meaningfully decline, regardless of whether the system is digital or physical, online or in-store.

**In practice, this means:**

- We must be informed, in clear and accessible language, when AI systems are observing or analyzing our behavior in physical spaces. Signage is a minimum; it is not sufficient on its own.
- Opt-out must be possible without loss of access to core services. Anyone who declines behavioral analysis should still be able to shop.
- Consent must be specific to purpose. Consenting to security cameras is not consent to AI behavioral analysis. Consenting to a loyalty program is not consent to biometric profiling.
- Re-consent must be sought when the purpose of data use changes materially, including when new AI capabilities are applied to existing data.

### 2. Physical Space Is Not a Data-Collection Default

The digital-physical boundary no longer exists in any meaningful technical sense. AI systems can observe, analyze, and model behavior in the physical world with the same granularity as behavioral tracking online. Our governance frameworks must reflect this.

**In practice, this means:**

- Camera footage, sensor data, and any other form of physical behavioral observation should be treated with the same data governance standards as digital behavioral data.
- The fact that a camera is legally permitted to record in a space does not mean AI analysis of that footage is consented to, or appropriate.
- Before deploying any AI system that processes physical behavioral data, ask: would the people being observed consent to this if they understood what was happening? If the honest answer is "probably not," that is information.
- Physical surveillance data must have explicit retention limits and must not be combined with other datasets in ways that enable individual identification without specific, informed consent.

### 3. Collect Less

Every additional data point is an additional surface for misuse, breach, and unintended inference. Minimization is not a constraint on innovation; it is a discipline that makes systems more trustworthy and organizations more defensible.

**In practice, this means:**

- Define the minimum data required for each AI use case before building it. Do not collect "just in case."
- Set explicit retention limits. Data that is no longer necessary for its stated purpose should be deleted, not archived indefinitely.
- Audit third-party integrations for data sharing practices as rigorously as you audit your own.
- The ability to collect something is not justification for collecting it.

### 4. AI Systems Must Be Classifiable, Reviewable, and Owned

Not all AI carries the same risk. A search ranking algorithm and a behavioral profiling system are not the same thing, and they should not be governed the same way.

**In practice, this means:**

- Maintain a registry of all AI systems in use (including third-party systems) classified by risk level: permitted, restricted, or prohibited.
- High-risk systems (those that affect access to services, pricing, credit, employment, or that process sensitive categories of data) require human review before consequential actions are taken.
- Prohibited systems include: real-time biometric identification without explicit consent, social scoring based on behavioral data, and systems that use protected characteristics to make consequential decisions.
- Each AI system must have a named person accountable for its behavior and its outputs.

### 5. Transparency Is Operational, Not Aspirational

A privacy policy is not transparency. Transparency is the ongoing, practical ability of people to understand how AI systems affect them and to do something about it.

**In practice, this means:**

- When an AI system influences a decision that affects any of us, we must be able to know this, understand why, and contest it.
- Internal teams must be able to explain, in plain language, what each AI system does and what it is optimizing for. If you can't explain it to a colleague, you don't understand it well enough to deploy it.
- AI system behavior must be logged and auditable. If you cannot reconstruct why a system made a particular decision, you cannot govern it.

### 6. Ask Who Bears the Risk

AI governance designed entirely by those who benefit from AI deployment will systematically underweight the interests of those who bear its risks. This is not malice; it is the ordinary operation of perspective.

**In practice, this means:**

- Impact assessments for high-risk AI systems must explicitly consider effects on marginalized communities, non-majority language speakers, people with disabilities, and others who may be underrepresented in training data or disproportionately affected by model errors.
- Feedback channels must allow any of us to report AI-driven harms, and those reports must be reviewed by people with the authority to act on them.
- Significant AI procurement and deployment decisions should include input from legal, privacy, and, where appropriate, external voices with expertise in civil liberties or community impact.

---

## V. Implementation Is the Only Thing That Matters

The [European AI Alliance](https://futurium.ec.europa.eu/en/european-ai-alliance/community-content/writing-organizational-ai-policy-first-step-towards-effective-ai-governance) notes that academic research has found fewer than 2% of published AI ethics guidelines include concrete implementation examples. Policy documents without operational grounding are not governance; they are liability management dressed up as values.

Governance lives in three layers:

1. **Strategy:** Leadership articulates the organization's values and risk appetite: what AI is for, what it is not for, and what the organization is willing to forgo in service of those limits.
2. **Policy:** Specific, enforceable rules about what AI systems can and cannot do, who is accountable for them, and what happens when something goes wrong.
3. **Systems:** The operational workflows, review processes, tooling, and incentives that make policy real in daily product and engineering decisions.

Each layer depends on the others. Strategy without policy is aspiration. Policy without systems is theater. And all of it requires people who are willing to raise their hands in the room before the thing ships, not after.

---

## VI. You Are Not a Passenger

This is where I want to speak directly to you: the engineer, the designer, the product manager, the data scientist, the researcher, the person who was in the room when the project that inspired this piece was presented and felt something they couldn't quite name.

The framing of AI governance as a problem for leadership, legal, and policy teams has a convenient side effect: it implies that everyone else is off the hook. That the right posture for the person doing the building is to focus on the craft and trust the systems above them to ask the hard questions.

That framing is comfortable. It is also wrong.

The decisions that matter most in the life of an AI system are not made in boardrooms or regulatory filings. They are made in design reviews. In sprint planning. In the moment someone says "what if we also captured—" and the room either slows down to ask what that means or moves on because the timeline is tight and the idea is interesting. They are made in the small daily choices about what to build, what to question, and what to say out loud.

History is not kind to people who built something consequential and then said they were just following instructions, just shipping features, just doing their jobs. But history is also full of examples (many of them small, most of them unrecorded) of individuals who said *wait* and changed the outcome.

You have more power than you think. Not because you control the organization, but because you are part of it, and organizations are made of people. The culture of scrutiny that prevents an AI system from crossing an ethical line is not installed by policy; it is built by people who, over and over, choose to ask the question.

If you have read this far, you probably already believe some version of what it says. The challenge is rarely convincing people that these questions matter; it is creating the conditions in organizations where asking them is normal, expected, and valued.

That work starts with conversation. With sharing frameworks. With making it easier for people who already feel the discomfort to put language to it and bring it into the rooms where decisions are being made.

This document is offered in that spirit, not as a finished answer, but as a starting point. Take what is useful. Adapt it to your context. Push back on what doesn't fit. Share it with the people you work with who you think would engage with it honestly.

The goal is not compliance. The goal is a culture in which the question *should we?* lives alongside *can we?* as a natural part of how we build.

We stand at the edge of a knife, and which way we will lean depends on choices made by developers, designers, managers - us.

The people in the room.

---

## Appendix: Legislative Reference

| Regulation | Jurisdiction | Key Provisions |
|---|---|---|
| [GDPR](https://gdpr-info.eu/) | European Union | Lawful basis for processing, explicit consent, right to erasure, data minimization, automated decision-making protections, cross-border transfer restrictions |
| [CCPA / CPRA](https://oag.ca.gov/privacy/ccpa) | California, USA | Right to know, right to delete, right to opt out of sale, sensitive data protections, automated decision-making transparency |
| [EU AI Act](https://artificialintelligenceact.eu/) | European Union | Risk classification of AI systems, prohibition of real-time biometric surveillance and social scoring, high-risk system requirements, conformity assessments |
| [LGPD](https://www.gov.br/secretaria-geral/pt-br/legislacao/lei/2018-1/2018_lei-13709) | Brazil | Consent and legitimate interest as legal bases, data subject rights, data protection officer requirements |
| [PIPEDA](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/) | Canada | Accountability, consent, limiting collection, safeguards, individual access rights |

<Newsletter />

<Comments />
