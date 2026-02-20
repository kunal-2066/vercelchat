/**
 * Session memory - Remembers emotional context across conversations
 * Creates attachment through continuity
 * 
 * Uses localStorage for storage
 * TODO: Replace with backend when project is complete
 */

export interface EmotionalMemory {
  topic: string;
  emotion: string;
  timestamp: number;
  messageSnippet: string;
}

const MAX_MEMORIES = 5;
const MEMORY_KEY = 'mindpex_emotional_memory';

/**
 * Extract emotional topic from user message
 */
export function extractEmotionalTopic(message: string): EmotionalMemory | null {
  const lowerMessage = message.toLowerCase();
  
  // Detect work-related stress
  if (lowerMessage.includes('meeting') || lowerMessage.includes('presentation')) {
    return {
      topic: 'work_meeting',
      emotion: 'stress',
      timestamp: Date.now(),
      messageSnippet: message.slice(0, 100),
    };
  }
  
  // Detect burnout
  if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('drained')) {
    return {
      topic: 'burnout',
      emotion: 'exhaustion',
      timestamp: Date.now(),
      messageSnippet: message.slice(0, 100),
    };
  }
  
  // Detect isolation
  if (lowerMessage.includes('alone') || lowerMessage.includes('isolated') || lowerMessage.includes('nobody')) {
    return {
      topic: 'isolation',
      emotion: 'loneliness',
      timestamp: Date.now(),
      messageSnippet: message.slice(0, 100),
    };
  }
  
  // Detect conflict
  if (lowerMessage.includes('argument') || lowerMessage.includes('conflict') || lowerMessage.includes('disagree')) {
    return {
      topic: 'conflict',
      emotion: 'tension',
      timestamp: Date.now(),
      messageSnippet: message.slice(0, 100),
    };
  }
  
  // Detect overwhelm
  if (lowerMessage.includes('overwhelm') || lowerMessage.includes('too much') || lowerMessage.includes('overload')) {
    return {
      topic: 'overwhelm',
      emotion: 'stress',
      timestamp: Date.now(),
      messageSnippet: message.slice(0, 100),
    };
  }
  
  return null;
}

/**
 * Save emotional memory to localStorage
 */
export async function saveEmotionalMemory(memory: EmotionalMemory): Promise<void> {
  try {
    const stored = localStorage.getItem(MEMORY_KEY);
    const memories: EmotionalMemory[] = stored ? JSON.parse(stored) : [];
    
    // Add new memory and keep only the most recent ones
    memories.unshift(memory);
    const trimmed = memories.slice(0, MAX_MEMORIES);
    
    localStorage.setItem(MEMORY_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('Failed to save emotional memory:', err);
  }
}

/**
 * Get recent emotional memories (last 24 hours)
 */
export async function getRecentMemories(): Promise<EmotionalMemory[]> {
  try {
    const stored = localStorage.getItem(MEMORY_KEY);
    if (!stored) return [];
    
    const memories: EmotionalMemory[] = JSON.parse(stored);
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    // Filter memories from last 24 hours
    return memories.filter(m => m.timestamp > oneDayAgo);
  } catch (err) {
    console.error('Failed to fetch emotional memories:', err);
    return [];
  }
}

/**
 * Generate continuity message based on last conversation
 * "You were tired yesterday. How are you feeling today?"
 */
export async function generateContinuityMessage(): Promise<string | null> {
  const recent = await getRecentMemories();
  
  if (recent.length === 0) return null;
  
  const lastMemory = recent[0];
  const hoursSince = Math.floor((Date.now() - lastMemory.timestamp) / (1000 * 60 * 60));
  
  // Topic-specific continuity messages
  const messages: Record<string, string[]> = {
    work_meeting: [
      "That meeting sounded heavy yesterday. How are you feeling today?",
      "I've been thinking about that presentation you mentioned. How did it go?",
      "You seemed stressed about that meeting. Is today feeling any lighter?",
    ],
    burnout: [
      "You said you felt drained last time we talked. Did you get some rest?",
      "I remember you were exhausted. How's your energy today?",
      "That tiredness you mentioned yesterday — is it still weighing on you?",
    ],
    isolation: [
      "You felt alone when we last spoke. Has anything shifted?",
      "I remember you saying nobody understood. Are you feeling any more connected now?",
      "That loneliness you shared yesterday — how are you holding up today?",
    ],
    conflict: [
      "That disagreement sounded tough. Has anything resolved?",
      "You mentioned some tension yesterday. How are things now?",
      "I remember that conflict was weighing on you. Any progress?",
    ],
    overwhelm: [
      "You felt overwhelmed last time. Is today any more manageable?",
      "That overload you mentioned — has the pressure eased at all?",
      "I remember everything felt like too much yesterday. How's today?",
    ],
  };
  
  // Only show if within reasonable time (4-48 hours)
  if (hoursSince < 4 || hoursSince > 48) return null;
  
  const topicMessages = messages[lastMemory.topic];
  if (!topicMessages) return null;
  
  // Random selection
  return topicMessages[Math.floor(Math.random() * topicMessages.length)];
}
