/**
 * Dynamic conversation starter prompts that rotate based on time and context
 * Provides infinite variability for habit formation
 */

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function getDayOfWeek(): number {
  return new Date().getDay();
}

const morningPrompts = [
  "Is there anything you're carrying into today?",
  "Woke up heavy? I'm here.",
  "How are you starting this morning?",
  "What's sitting with you as you begin today?",
  "Feeling the weight of something already?",
];

const afternoonPrompts = [
  "How's your day treating you so far?",
  "Need a moment to pause and breathe?",
  "What's been on your mind today?",
  "Carrying anything that feels too heavy?",
  "How are you holding up?",
];

const eveningPrompts = [
  "Before you rest, is something still on your mind?",
  "You made it through today. Want to unpack anything?",
  "How are you feeling as the day winds down?",
  "Need to let something go before tomorrow?",
  "What's weighing on you tonight?",
];

const nightPrompts = [
  "Still awake? What's keeping you up?",
  "Want to talk about what's on your heart?",
  "Having trouble settling? I'm here.",
  "What do you need to release tonight?",
  "Can't quiet your mind? Let's talk.",
];

const mondayPrompts = [
  "Monday feeling heavy? I'm here.",
  "How are you facing this week?",
];

const fridayPrompts = [
  "Made it to Friday. How are you feeling?",
  "Week almost done. Want to unpack anything?",
];

const universalPrompts = [
  "I'm feeling overwhelmed after today's meeting...",
  "I'm struggling with feeling undervalued at work",
  "I need to talk about a conflict with my manager",
  "I'm experiencing burnout and exhaustion",
];

/**
 * Get 4 contextual conversation starters based on time of day
 */
export function getConversationStarters(): string[] {
  const timeOfDay = getTimeOfDay();
  const dayOfWeek = getDayOfWeek();
  const starters: string[] = [];

  // Get time-specific prompts
  let timePrompts: string[] = [];
  switch (timeOfDay) {
    case 'morning':
      timePrompts = morningPrompts;
      break;
    case 'afternoon':
      timePrompts = afternoonPrompts;
      break;
    case 'evening':
      timePrompts = eveningPrompts;
      break;
    case 'night':
      timePrompts = nightPrompts;
      break;
  }

  // Shuffle and select 2 time-specific prompts
  const shuffledTimePrompts = [...timePrompts].sort(() => Math.random() - 0.5);
  starters.push(...shuffledTimePrompts.slice(0, 2));

  // Add day-specific prompt if it's Monday or Friday
  if (dayOfWeek === 1 && mondayPrompts.length > 0) {
    const randomMonday = mondayPrompts[Math.floor(Math.random() * mondayPrompts.length)];
    starters.push(randomMonday);
  } else if (dayOfWeek === 5 && fridayPrompts.length > 0) {
    const randomFriday = fridayPrompts[Math.floor(Math.random() * fridayPrompts.length)];
    starters.push(randomFriday);
  } else {
    // Add one more universal prompt if not Monday/Friday
    const shuffledUniversal = [...universalPrompts].sort(() => Math.random() - 0.5);
    starters.push(shuffledUniversal[0]);
  }

  // Fill remaining slot with universal prompt
  const shuffledUniversal = [...universalPrompts].sort(() => Math.random() - 0.5);
  starters.push(shuffledUniversal[Math.floor(Math.random() * shuffledUniversal.length)]);

  // Return 4 unique prompts
  return [...new Set(starters)].slice(0, 4);
}
