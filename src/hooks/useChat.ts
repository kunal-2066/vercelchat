import { useState, useEffect, useCallback } from 'react';
import { Message, ChatError, ErrorType } from '../utils/types';
import {
  loadTodayMessages,
  saveMessageToDB,
  clearMessagesInDB,
} from '../utils/chatDatabase';
import { extractEmotionalTopic, saveEmotionalMemory } from '../utils/emotionalMemory';
import { useVoiceAssistant } from './useVoiceAssistant';

const ML_API_URL = "https://mlmodel-kvav.onrender.com/chat";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getEmpathyErrorMessage(type: ErrorType): string {
  const messages: Record<ErrorType, string> = {
    network:
      "I'm having trouble connecting right now. Your feelings are still valid, and I'm here when the connection returns.",
    rate_limit:
      "I need a moment to catch my breath. Let's pause for just a second.",
    invalid_response:
      "I'm struggling to find the right words. Could we try that again?",
    timeout: "That took longer than expected. I'm still here with you.",
    unknown:
      "Something unexpected happened, but I'm still here. Your feelings matter.",
  };
  return messages[type];
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [error, setError] = useState<ChatError | null>(null);

  const voiceAssistant = useVoiceAssistant();

  // Load today's messages from local DB
  useEffect(() => {
    const load = async () => {
      const dbMessages = await loadTodayMessages();
      if (dbMessages.length > 0) setMessages(dbMessages);
    };
    load();
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      setError(null);

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      // Add user message locally
      setMessages((prev) => [...prev, userMessage]);
      await saveMessageToDB(userMessage);

      await new Promise((r) => setTimeout(r, 400));

      setIsLoading(true);
      setStreamingMessage('');

      try {
        // ✅ GET USERNAME FROM LOCAL STORAGE
        const username = localStorage.getItem("mindpex_username");

        if (!username) {
          throw new Error("Username not found");
        }

        // ✅ SEND CORRECT JSON FORMAT
        const response = await fetch(ML_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            anon_userid: username,   // REQUIRED
            text: content.trim(),    // REQUIRED
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error:", errorText);
          throw new Error("ML API failed");
        }

        const data = await response.json();

        // ✅ FLEXIBLE RESPONSE PARSING
        const aiText =
          data.response ||
          data.reply ||
          data.message ||
          data.text ||
          "No response from AI.";

        const aiMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: aiText.trim(),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        await saveMessageToDB(aiMessage);

        // Emotional memory
        const emotionalContext = extractEmotionalTopic(userMessage.content);
        if (emotionalContext) await saveEmotionalMemory(emotionalContext);

        // Voice mode
        if (voiceAssistant.isVoiceMode) {
          voiceAssistant.speak(aiText);
        }

      } catch (err: any) {
        console.error('❌ Chat error:', err.message);

        let errorType: ErrorType = 'unknown';
        if (err.message?.includes('network') || err.message?.includes('fetch'))
          errorType = 'network';
        else if (err.message?.includes('rate') || err.status === 429)
          errorType = 'rate_limit';
        else if (err.message?.includes('timeout'))
          errorType = 'timeout';
        else if (err.message?.includes('invalid'))
          errorType = 'invalid_response';

        setError({
          type: errorType,
          message: err.message || 'An error occurred',
          empathyMessage: getEmpathyErrorMessage(errorType),
        });

        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: getEmpathyErrorMessage(errorType),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
        await saveMessageToDB(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [voiceAssistant]
  );

  const clearMessages = useCallback(async () => {
    setMessages([]);
    setStreamingMessage('');
    setError(null);
    await clearMessagesInDB();
  }, []);

  const retryLastMessage = useCallback(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === 'user') {
        setMessages((prev) => prev.slice(0, -1));
        setTimeout(() => sendMessage(last.content), 100);
      }
    }
  }, [messages, sendMessage]);

  return {
    messages,
    setMessages,
    streamingMessage,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
    voiceAssistant,
    addLocalMessage: async (message: Message) => {
      setMessages((prev) => [...prev, message]);
      await saveMessageToDB(message);
    },
  };
}
