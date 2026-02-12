/**
 * Infinite variable reward: Different sentiment questions each time
 * Prevents habituation and keeps engagement high
 */

export interface SentimentQuestion {
  id: string;
  question: string;
  category: 'week' | 'energy' | 'mood' | 'connection' | 'workload' | 'growth' | 'autonomy';
  weight: number; // Probability weight for selection
}

const SENTIMENT_QUESTIONS: SentimentQuestion[] = [
  // Week retrospective (35% - most common)
  { id: 'week1', question: 'How are you feeling this week?', category: 'week', weight: 15 },
  { id: 'week2', question: 'What has this week been like for you?', category: 'week', weight: 10 },
  { id: 'week3', question: "How's your week treating you?", category: 'week', weight: 10 },
  
  // Energy level (20%)
  { id: 'energy1', question: "How's your energy right now?", category: 'energy', weight: 10 },
  { id: 'energy2', question: 'How are you holding up energy-wise?', category: 'energy', weight: 10 },
  
  // Mood check (15%)
  { id: 'mood1', question: 'How are you feeling today?', category: 'mood', weight: 8 },
  { id: 'mood2', question: "What's on your heart today?", category: 'mood', weight: 7 },
  
  // Connection/belonging (10%)
  { id: 'connect1', question: 'How connected are you feeling to your team?', category: 'connection', weight: 5 },
  { id: 'connect2', question: 'How supported do you feel lately?', category: 'connection', weight: 5 },
  
  // Workload balance (10%)
  { id: 'workload1', question: "How's your workload feeling?", category: 'workload', weight: 5 },
  { id: 'workload2', question: 'Is work feeling manageable?', category: 'workload', weight: 5 },
  
  // Growth & learning (5%)
  { id: 'growth1', question: 'How do you feel about your growth?', category: 'growth', weight: 3 },
  { id: 'growth2', question: 'Are you feeling fulfilled at work?', category: 'growth', weight: 2 },
  
  // Autonomy & control (5%)
  { id: 'autonomy1', question: 'How much control do you feel over your work?', category: 'autonomy', weight: 3 },
  { id: 'autonomy2', question: 'How empowered are you feeling?', category: 'autonomy', weight: 2 },
];

/**
 * Get a random sentiment question using weighted selection
 * Ensures variety and prevents predictability
 */
export function getRandomSentimentQuestion(previousQuestionIds: string[] = []): SentimentQuestion {
  // Filter out recently asked questions (last 4)
  const recentIds = previousQuestionIds.slice(-4);
  const availableQuestions = SENTIMENT_QUESTIONS.filter(
    (q) => !recentIds.includes(q.id)
  );
  
  // If somehow all questions were recent, use all questions
  const questionPool = availableQuestions.length > 0 ? availableQuestions : SENTIMENT_QUESTIONS;
  
  // Calculate total weight
  const totalWeight = questionPool.reduce((sum, q) => sum + q.weight, 0);
  
  // Random weighted selection
  let random = Math.random() * totalWeight;
  
  for (const question of questionPool) {
    random -= question.weight;
    if (random <= 0) {
      return question;
    }
  }
  
  // Fallback (should never happen)
  return questionPool[0];
}

/**
 * Get question category label for analytics
 */
export function getCategoryLabel(category: SentimentQuestion['category']): string {
  const labels: Record<SentimentQuestion['category'], string> = {
    week: 'Weekly Check-in',
    energy: 'Energy Level',
    mood: 'Mood Check',
    connection: 'Team Connection',
    workload: 'Workload Balance',
    growth: 'Growth & Learning',
    autonomy: 'Autonomy & Control',
  };
  return labels[category];
}

/**
 * Get emoji set variation (also variable!)
 */
export interface EmojiSet {
  emojis: string[];
  labels: string[];
  style: 'standard' | 'faces' | 'hands' | 'energy';
}

const EMOJI_SETS: EmojiSet[] = [
  // Confession-style statements (60% probability)
  {
    emojis: ['💚', '💛', '🤍', '💙', '🖤'],
    labels: [
      "I'm feeling really good",
      "I'm managing okay",
      "I feel a bit disconnected",
      "I'm feeling some strain",
      "I'm tired in my bones"
    ],
    style: 'standard',
  },
  // Work pressure confessions (20%)
  {
    emojis: ['✨', '💫', '⭐', '🌙', '🌑'],
    labels: [
      "I feel energized at work",
      "I'm keeping my head up",
      "I feel a bit invisible",
      "I've been pushing too hard",
      "I feel burned out"
    ],
    style: 'faces',
  },
  // Connection confessions (10%)
  {
    emojis: ['🌟', '☀️', '🌤️', '☁️', '⛈️'],
    labels: [
      "I feel seen and valued",
      "I'm doing alright",
      "I feel a bit unheard",
      "I don't feel supported",
      "I feel completely alone"
    ],
    style: 'hands',
  },
  // Overwhelm confessions (10%)
  {
    emojis: ['🌈', '🌸', '🍃', '🥀', '⚡'],
    labels: [
      "I feel in control",
      "I'm handling things",
      "Things feel heavy",
      "I'm barely keeping up",
      "I'm completely overwhelmed"
    ],
    style: 'energy',
  },
];

export function getRandomEmojiSet(): EmojiSet {
  const random = Math.random();
  
  if (random < 0.6) return EMOJI_SETS[0]; // 60% - standard
  if (random < 0.8) return EMOJI_SETS[1]; // 20% - alternative faces
  if (random < 0.9) return EMOJI_SETS[2]; // 10% - hands
  return EMOJI_SETS[3]; // 10% - energy
}
