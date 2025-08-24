---
layout: post
title: Platform Engineering
date: 2025-08-22 00:00:00
tags:
  - platform-engineering
  - development
  - programming
  - ramblings
---

I started as an engineer at [Hudl][hudl] back in 2014. Not too long after then I transitioned over to our at-the-time internal tools and systems team and I’ve been working as a software engineer focused on cloud infrastructure, backend systems, and runtimes (what we now call Platform Engineering) for about ten years now. When I started out, the job centered around virtualization, autoscaling setups, and provisioning self-managed servers.

Eventually, the industry shifted: containerization, serverless and infrastructure-as-code all had significant impact in the Platform Engineering space. Over time, it became clear that *buy over build* was the smarter strategy in many cases; leaning on cloud-managed systems instead of reinventing the wheel internally.

Looking back at the last 10 years, there are some key lessons we've learned that I think are worth sharing, in the hopes that other teams find them useful.

## Get good at migrations

Migrations are unavoidable in platform engineering. Whether it’s a runtime/internal library upgrade, moving cloud/SAAS providers, or shifting from one internal system to another, you're always looking ahead but thinking back - keeping your older systems functioning while implementing the newer ones. The trick is to minimize the pain on both your product team members and your team. Some of the strategies we've employed over the years are:

* Reducing the amount of change required to adopt new libraries, features.
* Limiting the blast radius of breaking changes.
* Avoiding needless in-house abstractions.

On that last point, it’s tempting to build a clever wrapper or new interface, but often it comes at a real cost. Those abstractions can reduce developer efficiency, require constant internal support (think: endless DMs and documentation), and very few product engineers will take the time to deeply understand them. Suddenly, your team becomes the frontline support desk.

## Automation is key

If something can be automated with code, it should be. Reliable tooling that can apply changes automatically across codebases will save everyone time and headaches.

That said, automation isn’t always straightforward. With LLMs and agentic systems everywhere, it’s easy to imagine spinning up an “AI Migration Team” but let’s be honest—that’s a silly idea. Instead, focus on utilizing LLMs and agents on structured but fuzzy tasks: things that are too messy to solve with rigid scripts but can still be guided and constrained.

For example:

* Limit AI changes to specific directories.
* Tell it to ignore tests, builds, or GitHub checks to avoid off-the-rails fix-it behavior.
* Minimize the blast radius of hallucinations by setting small goals.

Code-first automation should handle the rest.

## Centralize what matters

Centralization can make migrating large chunks of your platform a breeze, or make maintaining your decentralized services a nightmare. A platform team’s energy should go into centralizing the things that actually matter:

* Platform-wide alerting
* Internal platform logic and services
* IAM and RBAC

This prevents fragmented responsibility and gives you a single source of truth for the critical parts of your infrastructure. Note that this can also be a rabbit hole and potentially have a massive negative impact on adoption efforts, new feature releases, and it requires a high standard of quality and validation processes to reduce blast radius.

## The platform isn’t just a datacenter in Virginia

In order to be successful as a platform team you'll need to understand how your users are utilizing what you build.

That means you need to analyze the code your users are writing:

* Collect versions of libraries, runtimes, container images, IaC modules and more. This is crucial to understanding adoption of your code, identifying security vulnerabilities, and planning migrations.
* Track test and automation coverage. Higher coverage means higher confidence during future migrations.
* Map code ownership to teams so you know who to call when alarms go off or when you need testers during migrations.
* Track [DORA metrics][dora] to understand the heavily utilized areas of the platform, this can help you determine impact of new features or blast radius of defects.

## Grade services on the aspects that promote good service health

Migrations are easier on services that are adhering to the latest standards. Auditing services should be a normal part of the process. Build a periodic audit cycle to set baselines, then use it as an opportunity to engage with product engineers. This is a great moment to teach;people are more open to learning about a new feature, config, or process when they’re already in the context of reviewing their systems.

For example, you might establish a grading system where the following would reduce the service grade:

* Old dependencies.
* Low test coverage.
* Outdated infrastructure.
* Poor performance.
* High error rates.

Allow exclusions if necessary, but track them. Transparency matters.

## Observe your platform

Observability is non-negotiable. OpenTelemetry (OTel) gives structure, but in practice it’s still kind of the wild west. That’s where you'll need to lean into education and evangelism.

Train product engineers on what OTel is, how data is collected, how it can be used and how they can add or extend it. Once they see the value, they’ll often become ambassadors to the rest of their teams. Work with them to add application performance monitoring, capture critical pathways, and build SLOs and alarms.

It's not enough to just collect observability data, you have to teach people how to use it.


None of these is a silver bullet, there's no one magical process for being successful in the platform engineering space. Also, you don't need to do all or any of these, your organization likely does things a bit differently and that's ok, these are the lessons I've learned in the last eleven years and I hope you might find a few valuable.


[hudl]: https://www.hudl.com
[dora]: https://www.datadoghq.com/knowledge-center/dora-metrics/
