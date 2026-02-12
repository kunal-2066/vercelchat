import { Message } from './types';

const STORAGE_KEY = 'mindpex_chat_messages';
const MAX_STORED_MESSAGES = 100;

/**
 * Save messages to localStorage
 */
export function saveMessages(messages: Message[]): void {
  try {
    // Only store the most recent MAX_STORED_MESSAGES
    const messagesToStore = messages.slice(-MAX_STORED_MESSAGES);

    // Convert to JSON-serializable format
    const serialized = messagesToStore.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.toISOString(),
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save messages to localStorage:', error);
  }
}

/**
 * Load messages from localStorage
 */
export function loadMessages(): Message[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    // Convert back to Message format with Date objects
    return parsed.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  } catch (error) {
    console.error('Failed to load messages from localStorage:', error);
    return [];
  }
}

/**
 * Clear all messages from localStorage
 */
export function clearMessages(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear messages from localStorage:', error);
  }
}

/**
 * Export conversation as text file
 */
export function exportConversation(messages: Message[]): void {
  const text = messages
    .map(msg => {
      const timestamp = msg.timestamp.toLocaleString();
      const role = msg.role === 'user' ? 'You' : 'Companion';
      return `[${timestamp}] ${role}:\n${msg.content}\n`;
    })
    .join('\n');

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mindpex-conversation-${new Date().toISOString().slice(0, 10)}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Generic localStorage getter with default value
 */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Failed to get ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Generic localStorage setter
 */
export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
}
