import { useState, useEffect, useCallback } from 'react';
import { Message, ChatError, ErrorType } from '../utils/types';
import { streamChatResponse } from '../api/chat';
import {
  loadTodayMessages,
  saveMessageToDB,
  clearMessagesInDB,
  overwriteMessages,
  saveBulkMessages,
} from '../utils/chatDatabase';
import { extractEmotionalTopic, saveEmotionalMemory } from '../utils/emotionalMemory';
import { useVoiceAssistant } from './useVoiceAssistant';

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

  // Load today's messages from local DB on mount
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
        versions: [{ content: content.trim(), timestamp: new Date() }],
        currentVersionIndex: 0
      };

      setMessages((prev) => [...prev, userMessage]);
      await saveMessageToDB(userMessage);

      // 400ms pause before typing indicator (feels more human)
      await new Promise((r) => setTimeout(r, 400));

      setIsLoading(true);
      setStreamingMessage('');

      try {
        // ✅ Only pass the single user message
        // Backend handles session + context internally
        const { textStream } = await streamChatResponse([userMessage]);

        let fullResponse = '';
        for await (const chunk of textStream) {
          fullResponse += chunk;
          setStreamingMessage(fullResponse);
        }

        const aiMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: fullResponse.trim(),
          timestamp: new Date(),
          versions: [{ content: fullResponse.trim(), timestamp: new Date() }],
          currentVersionIndex: 0
        };

        setMessages((prev) => [...prev, aiMessage]);
        setStreamingMessage('');
        await saveMessageToDB(aiMessage);

        // Local emotional memory
        const emotionalContext = extractEmotionalTopic(userMessage.content);
        if (emotionalContext) await saveEmotionalMemory(emotionalContext);

      } catch (err: any) {
        console.error('❌ Chat error:', err.message);

        let errorType: ErrorType = 'unknown';
        if (err.message?.includes('network') || err.message?.includes('fetch'))
          errorType = 'network';
        else if (err.message?.includes('rate') || err.status === 429)
          errorType = 'rate_limit';
        else if (err.message?.includes('timeout')) errorType = 'timeout';
        else if (err.message?.includes('invalid'))
          errorType = 'invalid_response';

        setError({
          type: errorType,
          message: err.message || 'An error occurred',
          empathyMessage: getEmpathyErrorMessage(errorType),
        });
        setStreamingMessage('');
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
      // Initialize versions for new messages
      const messageWithVersions = {
        ...message,
        versions: [{ content: message.content, timestamp: message.timestamp }],
        currentVersionIndex: 0
      };
      setMessages((prev) => [...prev, messageWithVersions]);
      await saveMessageToDB(messageWithVersions);
    },
    editMessage: async (id: string, newContent: string) => {
      // Find the message index
      const index = messages.findIndex(m => m.id === id);
      if (index === -1) return;

      const messageToEdit = messages[index];

      // Update versions for the edited message
      const currentVersions = messageToEdit.versions || [{ content: messageToEdit.content, timestamp: messageToEdit.timestamp }];
      const newVersions = [...currentVersions, { content: newContent, timestamp: new Date() }];

      const updatedMessage = {
        ...messageToEdit,
        content: newContent,
        versions: newVersions,
        currentVersionIndex: newVersions.length - 1
      };

      // Keep messages up to this point (including the updated one)
      // Discard future messages (truncating the branch)
      const historyToKeep = [...messages.slice(0, index), updatedMessage];

      // Update state and DB
      setMessages(historyToKeep);
      await overwriteMessages(historyToKeep);

      // Trigger new AI response
      setIsLoading(true);
      setStreamingMessage('');

      try {
        const { textStream } = await streamChatResponse([updatedMessage]); // Use the updated message context

        let fullResponse = '';
        for await (const chunk of textStream) {
          fullResponse += chunk;
          setStreamingMessage(fullResponse);
        }

        const aiMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: fullResponse.trim(),
          timestamp: new Date(),
          versions: [{ content: fullResponse.trim(), timestamp: new Date() }],
          currentVersionIndex: 0
        };

        setMessages((prev) => [...prev, aiMessage]);
        setStreamingMessage('');
        await saveMessageToDB(aiMessage);

      } catch (err: any) {
        console.error('Failed to regenerate after edit:', err);
        // Add error handling/restoration if needed
      } finally {
        setIsLoading(false);
      }
    },
    switchVersion: async (messageId: string, versionIndex: number) => {
      setMessages(prev => {
        const next = prev.map(msg => {
          if (msg.id === messageId && msg.versions && msg.versions[versionIndex]) {
            return {
              ...msg,
              content: msg.versions[versionIndex].content,
              currentVersionIndex: versionIndex
            };
          }
          return msg;
        });
        // Updating DB here properly requires a full save or finding the item
        // For simplicity/perf, we trigger a full save or define a helper
        overwriteMessages(next); // This will save the entire array
        return next;
      });
    },
    regenerateMessage: async (messageId: string) => {
      // Find message to regenerate
      const index = messages.findIndex(m => m.id === messageId);
      if (index === -1) return;

      const targetMessage = messages[index];
      if (targetMessage.role !== 'assistant') return;

      // History is everything before this message
      const history = messages.slice(0, index);
      // The user message that prompted this response is the last one in history (usually)
      const lastUserMessage = history[history.length - 1];
      if (!lastUserMessage || lastUserMessage.role !== 'user') return;

      setIsLoading(true);
      setStreamingMessage('');

      try {
        // Create a new version entry
        // const newVersionIndex = (targetMessage.versions?.length || 1);

        // We need to stream the response, but we can't easily append to a version in real-time
        // without complex state logic. 
        // Strategy: Stream into `streamingMessage` (visual overlay), then finalize into version.

        // Temporarily remove the assistant message from view or show it as loading?
        // Actually, typical UI shows the *new* generation in progress.
        // We can use the existing `streamingMessage` state which hides the last message?
        // No, `streamingMessage` is usually appended. 

        // Better: Update the message to point to a new empty version, and stream into that.

        const { textStream } = await streamChatResponse([lastUserMessage]); // Send context? actually API needs full history or just last message? 
        // `streamChatResponse` currently takes `messages[]` but implementation uses `lastMessage`.
        // It ONLY uses the last message content. It relies on backend for session? 
        // "Backend handles session + context internally" - YES.

        let fullResponse = '';
        for await (const chunk of textStream) {
          fullResponse += chunk;
          setStreamingMessage(fullResponse);
        }

        setMessages(prev => {
          const next = prev.map(msg => {
            if (msg.id === messageId) {
              const versions = msg.versions || [{ content: msg.content, timestamp: msg.timestamp }];
              const newVersions = [
                ...versions,
                { content: fullResponse, timestamp: new Date() }
              ];
              return {
                ...msg,
                content: fullResponse, // Update main content to latest
                versions: newVersions,
                currentVersionIndex: newVersions.length - 1
              };
            }
            return msg;
          });
          overwriteMessages(next); // Persist
          return next;
        });

        setStreamingMessage('');

      } catch (err: any) {
        console.error('Failed to regenerate:', err);
        setError({
          type: 'unknown',
          message: err.message || 'Failed to regenerate',
          empathyMessage: 'I had trouble coming up with a new response.'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
}
