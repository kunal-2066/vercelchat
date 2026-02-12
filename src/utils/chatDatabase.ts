import { Message } from './types';

/**
 * Chat Database using localStorage
 * Isolates messages strictly by entered username
 */

// 🔐 Get username from localStorage
const getCurrentUserName = () => {
  return localStorage.getItem("mindpex_username");
};

// 🔑 Storage key based on name
const getStorageKey = () => {
  const name = getCurrentUserName();

  if (name && name.trim() !== "") {
    return `mindpex_chat_messages_${name}`;
  }

  return `mindpex_chat_messages_anonymous`;
};

// 🔑 Session key based on name
const getSessionKey = () => {
  const name = getCurrentUserName();

  if (name && name.trim() !== "") {
    return `mindpex_current_session_${name}`;
  }

  return `mindpex_current_session_anonymous`;
};

// Get or create today's session
export const getTodaySession = async (): Promise<string | null> => {
  const today = new Date().toISOString().split('T')[0];
  const sessionData = localStorage.getItem(getSessionKey());

  if (sessionData) {
    const session = JSON.parse(sessionData);
    if (session.date === today) {
      return session.id;
    }
  }

  const newSession = {
    id: `session-${Date.now()}`,
    date: today,
    messageCount: 0
  };

  localStorage.setItem(getSessionKey(), JSON.stringify(newSession));
  return newSession.id;
};

// Load messages
export const loadMessagesFromDB = async (): Promise<Message[]> => {
  try {
    const stored = localStorage.getItem(getStorageKey());
    if (!stored) return [];

    const messages = JSON.parse(stored);

    return messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (err) {
    console.error('Failed to load messages:', err);
    return [];
  }
};

// Load today's messages
export const loadTodayMessages = async (): Promise<Message[]> => {
  const allMessages = await loadMessagesFromDB();
  const today = new Date().toISOString().split('T')[0];

  return allMessages.filter(msg => {
    const msgDate = new Date(msg.timestamp).toISOString().split('T')[0];
    return msgDate === today;
  });
};

// Save message
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

// Save multiple messages
export const saveBulkMessages = async (
  messages: Message[]
): Promise<boolean> => {
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

// Clear messages
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

// Get today's message count
export const getTodayMessageCount = async (): Promise<number> => {
  const todayMessages = await loadTodayMessages();
  return todayMessages.length;
};
