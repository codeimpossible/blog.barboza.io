---
title: D&D reward cards
layout: post
templateEngineOverride: njk,md
tags:
  - dungeons-and-dragons
  - roleplaying
  - table-top
---

Six months ago I started DMing my first ever D&D campaign. It's a short campaign - in fact we just had the finale session and are taking a break before our next adventure - but it was a really great experience. I think the thing I enjoyed most was how much I able to empower the players in the campaign to change and impact the story in unpredictable ways.

From the start I wanted to really lean into the idea of the players and I crafting a story together, putting the characters into harrowing scenarios and have them overcome seemingly impossible challenges.

These goals, along with wanting to keep player engagement high throughout the campaign lead me to including a reward that I could present to players for good engagement with the game: doing solid roleplay, helping each other out with good teamwork, and even stepping out of the game a bit to take useful notes or give a recap when everyone else forgot what happened last session.

I knew I wanted something _more_ than giving out inspiration, although that is still a good reward but I knew I wanted to give players something that could genuinely alter the course of the game if used well.

So I drafted up a set of eight reward cards that gave players useful, powerful, and sometimes down-right ridiculous abilities or one-time effects. Since the campaign is full of really good friends, and none of us are taking this campaign too seriously, it didn’t matter if some of the cards were a little broken or wildly overpowered. If anything, those cards just made things more memorable.

I've included each of the cards below, feel free to use or remix them as you like if you think they'd be a good addition to your campaign.

{% set cards = collections['dnd_reward_cards'] %}

<div id="cards-carousel" class="relative w-full" data-carousel="static">
<div class="relative h-128 overflow-hidden rounded-base">
{% for card in cards %}
<div class="hidden items-center duration-700" data-carousel-item>
  <div class="absolute reward-card bg-gray-100 border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-100">
    <div class="flex flex-col p-2 dark:border-grey-300">
    <img class="w-32 h-32 mb-3 {{ card.data.icon_class }} m-auto relative" src="{{ card.data.icon }}" alt="{{ card.data.alternate }}" title="{{ card.data.title }}" />
    <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">{{ card.data.title }}</h5>
    <div class="flex pl-2 pr-2 text-gray-700 text-md dark:text-gray-300 text-center">{{ card.templateContent | safe }}</div>
    <span class="text-sm text-gray-400 dark:text-gray-500 text-center">{{ card.data.icon_attribution | safe }}</span></div></div></div>
{% endfor %}</div>
<button type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev><span class="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"><svg class="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/></svg><span class="sr-only">Previous</span></span></button><button type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next><span class="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"><svg class="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/></svg><span class="sr-only">Next</span></span></button></div>

<noscript>
{% for card in cards %}
* "{{ card.data.title }}" - {{ card.templateContent | safe }}
{% endfor %}
</noscript>

In the end, the cards did exactly what I wanted: they encouraged players to show up, be involved in the story, help each other, and make the game as fun as possible for everyone. If you do use any of these or if you have your own "reward cards" system, shoot me a message on [mastodon][mastodon]!

[mastodon]: https://mastodon.gamedev.place/@Literallyacat