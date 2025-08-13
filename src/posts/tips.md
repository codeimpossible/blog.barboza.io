---
layout: post
title: Tips
date: 2025-07-27
excerpt: 'This is kind of like my own little set of guidelines, practices or beliefs that have helped me during my career.'
tags:
  - tips
  - tricks
  - programming
---

I've wanted to post this for a long time, it's kind of like my own little set of guidelines, practices or beliefs that have helped me during my career. They're definitely _not_ some bullshit gate-keepy "only real programmers..." nonsense. I'm always adding, revising, removing things, but I like having them written down somewhere so I can refer back to them from time to time.

You're of course welcome to follow some, all or none of these things. I'm sure there are folks out there who do none of these are are successful, it's not really about that. It's more about establishing your own set of practices, beliefs that work for you and maybe this list will help you do that. Or maybe it won't, either is fine. If you have some thoughts or opinions on this list or maybe some things from your own list that aren't on here, [I'd love to hear about them][mastodon]!

- There is no magic. Computers only do what they are instructed to do.
- Read the error messages.
- When all other reasonable theories have been exhausted, the problem is file encoding. Or DNS.
- Invest in your tools: get a keyboard you like, a good chair, a solid desk, a good monitor.
- Invest in your pipelines: create macros, small scripts to make complicated tasks easier.
- Most times, you have to build the shittier version first.
- Linting should never block push, merge or deploy. Automate as much of the code cleanup as possible.
- Avoid code litter
  - git is your history, don't commit commented out or unused code.
  - refactor for fewer instructions, dont sacrifice readability though.
  - names are important, conventions are even more important
  - comments are only for _why_ not _how_.
- Test code should focus on being easily readable and easily written
- _Knowing_ something and _proving_ something are two different things.
- The longest memory is shorter than the shortest pencil. Write documentation.
- Documentation should first focus on _why_ with _how_ being secondary.
- Avoid multiple returns from a function.
- Write code so that it can be read by humans first and run efficiently by the computer second.
- When confronted with a seemingly impossible problem, think "gloves".
  - This is a reference to a [really great article from TheDailyWTF][daily_wtf_gloves] where a group of engineers
    were trying to think up the "best" way to keep their hands warm during winter bicycle rides into the office.
    You don't need a pedal-powered heating coil in your handlebars, you just need gloves.
  - Break the problem down to its simplest version, solve that, then add complexity in steps, solving as you iterate.
- Looking information up does not make you stupid, it makes you resourceful. Mages travel with large spellbooks because
  nobody can remember everything. The best spellcasters are the ones who can look up the right spell in the middle of
  combat, not the ones who try to know every spell.
- "Glue" work is work. It's undervalued, but no large company can survive without it.

[daily_wtf_gloves]: https://thedailywtf.com/articles/the_complicator_0x27_s_gloves
[mastodon]: https://mastodon.gamedev.place/@Literallyacat
