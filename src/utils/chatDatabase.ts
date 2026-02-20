import { Message } from './types';

/**
 * Chat persistence in localStorage.
 * Messages are isolated by entered username so each user sees only their own history.
 */

const DEFAULT_USER_KEY = 'anonymous';

const getCurrentUserName = () => {
  const name = localStorage.getItem('mindpex_username');
  return name && name.trim() ? name.trim() : DEFAULT_USER_KEY;
};

const getStorageKey = () => `mindpex_chat_messages_${getCurrentUserName()}`;
const getSessionKey = () => `mindpex_current_session_${getCurrentUserName()}`;

// Get or create today's chat session
export const getTodaySession = async (): Promise<string | null> => {
  const today = new Date().toISOString().split('T')[0];
  const sessionData = localStorage.getItem(getSessionKey());

  if (sessionData) {
    const session = JSON.parse(sessionData);
    if (session.date === today) {
      return session.id;
    }
  }

  // Create new session for today
  const newSession = {
    id: `session-${Date.now()}`,
    date: today,
    messageCount: 0
  };

  localStorage.setItem(getSessionKey(), JSON.stringify(newSession));
  return newSession.id;
};

// Load messages from localStorage
export const loadMessagesFromDB = async (): Promise<Message[]> => {
  try {
    const stored = localStorage.getItem(getStorageKey());
    if (!stored) return [];

    const messages = JSON.parse(stored);
    return messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
      versions: Array.isArray(msg.versions)
        ? msg.versions.map((v: any) => ({
            ...v,
            timestamp: new Date(v.timestamp),
          }))
        : undefined,
    }));
  } catch (err) {
    console.error('Failed to load messages:', err);
    return [];
  }
};

// Load messages for current user. Kept for compatibility with existing hook usage.
export const loadTodayMessages = async (): Promise<Message[]> => {
  return loadMessagesFromDB();
};

// Save single message to localStorage
export const saveMessageToDB = async (message: Message): Promise<boolean> => {
  try {
    const messages = await loadMessagesFromDB();
    messages.push(message);
    localStorage.setItem(getStorageKey(), JSON.stringify(messages));
    return true;
  } catch (err) {
    console.error('Failed to save message:', err);
    return false;
  }
};

// Save multiple messages (bulk insert)
export const saveBulkMessages = async (messages: Message[]): Promise<boolean> => {
  try {
    const existingMessages = await loadMessagesFromDB();
    const allMessages = [...existingMessages, ...messages];
    localStorage.setItem(getStorageKey(), JSON.stringify(allMessages));
    return true;
  } catch (err) {
    console.error('Failed to bulk save messages:', err);
    return false;
  }
};

// Clear all messages
export const clearMessagesInDB = async (): Promise<boolean> => {
  try {
    localStorage.removeItem(getStorageKey());
    localStorage.removeItem(getSessionKey());
    return true;
  } catch (err) {
    console.error('Failed to clear messages:', err);
    return false;
  }
};

// Get message count for today's session
export const getTodayMessageCount = async (): Promise<number> => {
  const todayMessages = await loadTodayMessages();
  return todayMessages.length;
};

// Overwrite all messages (for editing/history rewriting)
export const overwriteMessages = async (messages: Message[]): Promise<boolean> => {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(messages));
    return true;
  } catch (err) {
    console.error('Failed to overwrite messages:', err);
    return false;
  }
};
