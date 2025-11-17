---
title: D&D reward cards
layout: post
templateEngineOverride: njk,md
tags:
  - dungeons-and-dragons
  - roleplaying
  - table-top
---

{% set cards = collections['dnd_reward_cards'] %}

<div class="grid grid-cols-2 gap-4 cards">
{% for card in cards %}
<div class="reward-card max-w-sm m-5 bg-gray-100 border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-100">
    <div class="flex flex-col items-center p-2 m-5 dark:border-grey-300">
        <img class="w-32 h-32 mb-3 {{ card.data.icon_class }}" src="{{ card.data.icon }}" alt="Reward card icon"/>
        <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{{ card.data.title }}</h5>
        <div class="flex pl-2 pr-2 text-gray-700 text-md dark:text-gray-300">
            {{ card.templateContent | safe }}</div>
        <span class="text-sm text-gray-400 dark:text-gray-600">
            {{ card.data.icon_attribution | safe }}</span></div></div>
{% endfor %}</div>

"I will have my vengeance..."
In battle, if they have less than 10 HP, the player of the card gains 10 HP and their next attack is a natural 20.

"Fight in the shade..."
You get an additional ranged attack.

"I'll be back"
You are immediately transported to another plane. While there you cannot be targeted or detected by another creature or character. If done during combat, you can stay for up to 1d6 combat turns, and when you return you can rematerialize in any non-occupied space on the battle map. Otherwise you can stay for up to 5 minutes of non-combat time and may rematerialize at any location within eyesight of your location before you left.

"Yeah I saw that going differently in my head"
A character or creature does something downright dumb, dangerous or both.

"I can do this all day"
You immediately regain all your HP and the [Resilient][feat_resilient] feat.

"Say 'Hello' to my little friend"
For the remainder of the encounter, your melee weapon does 1d20 additional damage per round and you gain the same in temporary HP.

"That's not a knife, this is knife"
For the remainder of the encounter, one dagger is magically transformed into a Dagger +5.

"The space between breath..."
For the remainder of the encounter, the max distance of your ranged attacks is increased by 200ft.

"I'm your huckleberry"
Combat ends for all other characters and creatures. You and the opposing "leader" settle the fight one-on-one.

"I love the smell of napalm in the morning"
The next five evocation spells cast by the player will have maximum damage.

"There is no place like home"
You are able to immediately teleport yourself and up to 4 medium sized characters or creatures within 15ft of you to any location you have visted within the last three days.

"Like a box of chocolates"
You stumble upon a small, rectangular wooden box. It is 10"x12"x6" in size and is covered in markings of a forgotten language. The box has a hinged lid and only a latch keeping it shut, now what could be inside?

"A martini. Shaken, not stirred."
Your reputation precedes you. The local innkeeper is excited about your visit and invites you to eat, drink and stay at their establishment for free. You gain a +10 on charisma checks when talking to the innkeeper.

"I have always depended on the kindness of strangers."
You can add +5 to one charisma check while in town.

"It was Beauty killed the Beast"
For the remainder of the encounter, all female characters and creatures add 1d8 to their damage.

"Hasta la vista, baby."
When the hero speaks this line, their next attack roll is a natural 20.

"THIS. IS. SPARTA!"
For the remainder of the encounter, the hero gains +3 to all attack rolls and damage. If they are attacking the enemy leader, or the enemy has an opposite alignment, the hero gains +6 to all attack rolls and damage.

"Somebody get that kid a sandwich"
For the remainder of the encounter, the hero gains 15 temporary hit points and +3 to strength and dexterity modifiers.


[feat_resilient]: https://www.aidedd.org/feat/resilient
