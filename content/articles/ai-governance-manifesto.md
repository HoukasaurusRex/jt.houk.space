---
category: "technology"
created_at: "2026-02-26T00:00:00.000Z"
updated_at: "2026-02-26T00:00:00.000Z"
title: "The People In The Room: A Manifesto for AI Governance"
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

At a recent internal innovation event, I watched talented engineers and product people present projects of real technical ambition.
The energy was infectious. One project stood out: an AI system that used in-store camera footage to analyze how we physically
interact with products (where we linger, what we reach for, what we put back) and surfaced those insights to store owners.

It was clever. The business value was obvious. The team clearly believed in it.

And yet as I clapped and nodded I felt something was off about it.

Any of us walking through that store would have had no idea any of it was happening. No notice, no opt-out, no way to simply
exist in a physical space without surrendering our faces, our movements, and our behavioral patterns to a system we were never
aware of. The intent was entirely benign. And yet the gap between that intent and the reality of what was being built felt as
wide as the monitors we watched on.

And as quickly as that thought surfaced, the event moved on.

This is an attempt to name that gap. To capture this moment. The people building these systems are not villains. But we are at
a moment where the tools available to us have outpaced even our language to describe them, and the people who can define it are
not just executives or regulators.

They are us. The people in the room when it gets built.

---

## I. The Consent Gap Has Moved Offline

When we visit a website, there is a normative expectation we will be tracked. The cookie banner, for
all its uselessness as genuine consent, represents an acknowledgment that collection is happening. Legislation in Europe and
the United States has started to address this: the right to know what is collected, to delete it, to opt out. Imperfect
protections. But visible ones.

AI is moving into physical spaces, and those protections do not follow us through the door.

When we walk into a store, we have no such awareness. We move freely, unaware that cameras connected to AI systems may be
analyzing our body language, inferring our demographics, mapping our behavioral patterns, and contributing that data to a
model informing decisions we'll never know were made about us. This is not a hypothetical future. It is a feature being built
right now, in hackathons and product sprints, by people who haven't yet been given a framework for asking what else it does.

Doorbells on our neighbors' houses capture our faces as we pass. Security cameras at shop entrances stitch together
a map of our daily movements. Robotic house maids create networks of associates and relationships sold to authorities.
The infrastructure of neighborhood surveillance has been installed voluntarily, camera by camera,
in the name of safety and convenience, and none of us consented to becoming a recurring node in someone else's network.

This is the context in which we are building.

---

## II. We Are All The Custodians of A Power We Did Not Ask For

Most of the people building surveillance-capable AI systems are genuinely trying to help. The business value is real. The
technical achievement is real. The intent is real.

And none of that is sufficient protection against harm.

Participation in systems of harm rarely begins with bad actors. It begins with accumulated small decisions, each locally
reasonable, none globally reviewed, that together build something no individual in the chain would have endorsed if they could
see the whole picture.

A retail analytics system gets combined with a partner integration. Now it can identify individuals across visits, infer
health circumstances from purchasing patterns, and contribute biometric data to databases the retailer never audited. A
recommendation engine optimizes for engagement and radicalizes users by accident, because no one asked what that would mean
at scale. A company sells its customer dataset during acquisition, and the new owner uses it in ways none of us anticipated.
An organization shares footage with a partner that has law enforcement relationships. Biometric profiles of people who did
nothing wrong are compiled, shared, weaponized. Not because they did anything wrong. Because they were present. Because a
camera saw them, and the infrastructure existed to do something with what it saw.

None of these scenarios require negligence. They require only an absence of deliberate governance, like manufacturing a car
without brakes because everyone was focused on making it go faster.

Building that layer between principles and daily decisions is not a job for policy teams alone. It is a job for everyone who
touches the system. You and me. The people in the room when it gets built.

---

## III. The Law Is a Floor, Not a Ceiling

Legislation is catching up to yesterday's problems.

[GDPR](https://gdpr-info.eu/) and [CCPA](https://oag.ca.gov/privacy/ccpa) were designed for digital data collection. The
[EU AI Act](https://artificialintelligenceact.eu/) goes further, classifying real-time biometric surveillance and social
scoring as prohibited or high-risk. The direction is clear: explicit, informed consent is becoming the expected standard. But
legislation is measured in years while our sprints are measured in weeks.

Organizational governance is not a "nice to have" or a "future problem" or waiting on "industry standards" to catch up.
It is something we need to figure out right now. It is our hands that must use the tools we have now,
however imperfect they may be, to build.

The people whose behavior is being analyzed in these systems are not abstractions. They are us, with rights and reasonable
expectations about how we will be treated in the spaces we inhabit. We shop at these stores. We use these apps. We stroll through
the neighborhoods we build.

We can do better than the minimum the law currently demands. And we should.

---

## IV. The Principles

These are not policy commitments. They are personal ones: to ourselves, to the people on our teams, and to everyone who will
one day live in the systems we build.

### 1. Consent Must Follow the Person, Not the Platform

If our system is analyzing someone's behavior, that person should know and be able to say no. Not just online. Consenting
to a security camera is not consent to AI behavioral analysis. Consenting to a loyalty program is not consent to biometric
profiling. When our use of their data changes materially, we ask again.

### 2. Physical Space Is Not a Data-Collection Default

Camera footage and sensor data carry the same obligations as any behavioral data we collect online. A camera being legally
permitted to record doesn't mean our AI analysis of that footage is consented to. Before shipping a system that processes
physical behavioral data, ask honestly: would the people being observed agree to this if they understood what was happening?
If the answer is probably not, that is information.

### 3. Collect Less

Every data point we collect is a surface for misuse, breach, and unintended inference. Define the minimum required before
we build. Delete what's no longer necessary. Audit what our integrations share as rigorously as we audit our own code. The
ability to collect something is not justification for collecting it.

### 4. Own What We Build

Not all AI carries the same risk. A search algorithm and a behavioral profiling system are not the same thing. Know which
is which. Maintain a registry of our AI systems, including third-party ones, classified by risk. High-risk systems need
human review before consequential decisions are made. Each system needs a named person accountable for its behavior. If
we can't explain what a system does and what it optimizes for in plain language to a colleague, we don't understand it well
enough to ship it.

### 5. Transparency Is Operational, Not Aspirational

A privacy policy is not transparency. When our system influences a decision that affects someone, they should be able to
know it, understand why, and contest it. We should be able to explain what every system we build does, and reconstruct
why it made the decisions it made. If we can't, we can't govern it.

### 6. Ask Who Bears the Risk

Governance designed entirely by those who profit from our deployments will systematically undercount those of us who bear its
costs. Before shipping high-risk systems, ask explicitly: who gets hurt if this goes wrong, and are they represented in
this room? Build feedback channels that let people report harms, reviewed by someone with the authority to act.

---

## V. Implementation Is the Only Thing That Matters

The [European AI Alliance](https://futurium.ec.europa.eu/en/european-ai-alliance/community-content/writing-organizational-ai-policy-first-step-towards-effective-ai-governance)
has found that fewer than 2% of published AI ethics guidelines include concrete implementation examples. Policy documents
without operational grounding are not governance; they are liability management dressed up as values.

Governance lives in three layers: the strategy that names what we are and are not willing to build, the policy that makes
those limits specific and enforceable, and the systems that put policy into our daily product and engineering decisions.
Strategy without policy is aspiration. Policy without systems is theater. And none of it matters unless we raise our hands
in the room.

---

## VI. You Are Not a Passenger

You. The engineer, the designer, the product manager, the data scientist. The person who was in that room and felt
something they couldn't quite name.

The framing that governance is someone else's problem is comfortable. It is also wrong.

The decisions that matter most in the life of an AI system are not made in boardrooms or regulatory filings. They are made
in design reviews. In sprint planning. In the moment someone says "what if we also captured—" and the room either slows
down to ask what that means or moves on because the timeline is tight and the idea is interesting. They are made in the
small daily choices about what to build, what to question, and what to say out loud.

The engineers who defined what the internet became did not do it in executive suites. They did it in design reviews, in
architecture discussions, in the small moments where a choice was made and compounded. We are in those moments right now,
with the same tools and the same stakes, and more context than any generation of builders has ever had.

You have more power than you think. Organizations are made of people, and the culture that prevents an AI system from
crossing an ethical line is built by people who, over and over, choose to ask the question.

Take what is useful from this. Share it with the people you work with who would engage with it honestly.

The goal is not compliance. The goal is a culture in which the question *should we?* lives alongside *can we?* as a
natural part of how we build.

We stand at the edge of a knife, and which way we will lean depends on choices made by developers, designers, managers - us.

The people in the room.

---

## Appendix: Legislative Reference

| Regulation | Jurisdiction | Key Provisions |
| --- | --- | --- |
| [GDPR](https://gdpr-info.eu/) | European Union | Lawful basis for processing, explicit consent, right to erasure, data minimization, automated decision-making protections, cross-border transfer restrictions |
| [CCPA / CPRA](https://oag.ca.gov/privacy/ccpa) | California, USA | Right to know, right to delete, right to opt out of sale, sensitive data protections, automated decision-making transparency |
| [EU AI Act](https://artificialintelligenceact.eu/) | European Union | Risk classification of AI systems, prohibition of real-time biometric surveillance and social scoring, high-risk system requirements, conformity assessments |
| [LGPD](https://www.gov.br/secretaria-geral/pt-br/legislacao/lei/2018-1/2018_lei-13709) | Brazil | Consent and legitimate interest as legal bases, data subject rights, data protection officer requirements |
| [PIPEDA](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/) | Canada | Accountability, consent, limiting collection, safeguards, individual access rights |


