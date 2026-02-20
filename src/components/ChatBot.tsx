import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../hooks/useChat';
import { Message } from '../utils/types';
import { Header } from './Header';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { StreamingText } from './StreamingText';
import { Settings } from './Settings';
import { exportConversation } from '../utils/storage';
import { AmbientSound, getSanctuaryBackground } from '../utils/sanctuary';
import { MoodChips } from './MoodChips';

interface ChatBotProps {
  username: string | null;
}

export const ChatBot: React.FC<ChatBotProps> = ({ username }) => {
  const {
    messages,
    streamingMessage,
    isLoading,
    sendMessage,
    clearMessages,
    retryLastMessage,
    voiceAssistant,
    addLocalMessage,
    editMessage,
    switchVersion,
    regenerateMessage,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [ambientSound] = useState(() => new AmbientSound());
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [sanctuaryBg] = useState(getSanctuaryBackground());
  const [showSettings, setShowSettings] = useState(false);

  const displayName = username || '';

  useEffect(() => {
    return () => {
      ambientSound.stop();
    };
  }, [ambientSound]);

  const toggleAmbientSound = () => {
    ambientSound.toggle();
    setIsSoundEnabled(!isSoundEnabled);
  };

  useEffect(() => {
    if (messages.length > 0 || streamingMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }, [messages, streamingMessage]);

  const handleClearChat = () => {
    if (
      messages.length > 0 &&
      window.confirm('Clear this conversation?')
    ) {
      clearMessages();
    }
  };

  const handleExport = () => {
    if (messages.length > 0) {
      exportConversation(messages);
    }
  };

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  const handleMoodSelect = async (mood: string) => {
    // 1. Add User Mood
    await addLocalMessage({
      id: Date.now().toString(),
      role: 'user',
      content: mood,
      timestamp: new Date()
    });

    // 2. Add AI Acknowledgement (Immediate)
    await addLocalMessage({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: "Got it. Want to say anything about that, or we can leave it there.",
      timestamp: new Date()
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem('mindpex_username');
    localStorage.removeItem('user_display_name');
    localStorage.removeItem('mindpex_intro_completed');
    window.location.reload();
  };

  return (
    <div className={`app-shell flex flex-col ${sanctuaryBg} theme-transition relative overflow-hidden`}>
      <div className="ambient-layer" />

      <div className="relative z-10">
        <Header
          displayName={displayName}
          onClearChat={handleClearChat}
          onSignOut={handleSignOut}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={toggleAmbientSound}
          onOpenSettings={() => setShowSettings(true)}
        />
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 pt-24 md:pt-6 relative z-10 chat-scroll-safe"
      >
        <div className="max-w-4xl mx-auto sanctuary-glow">
          {messages.length === 0 && !streamingMessage && (
            <MoodChips onSelect={handleMoodSelect} />
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onEdit={editMessage}
              onSwitchVersion={switchVersion}
              onRegenerate={regenerateMessage}
            />
          ))}

          {streamingMessage && (
            <div className="flex justify-start mb-4 animate-fade-in">
              <div className="max-w-[80%] bg-mindpex-dark-gray-light border border-slate-700/50 rounded-lg px-4 py-3 shadow-lg">
                <StreamingText text={streamingMessage} />
              </div>
            </div>
          )}

          {isLoading && !streamingMessage && <TypingIndicator />}

          <div ref={messagesEndRef} />

          {messages.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleExport}
                className="px-4 py-2 text-sm text-slate-400 hover:text-amber
                           border border-slate-700 hover:border-amber/50
                           rounded-lg transition-colors duration-200 btn-warm-glow"
              >
                Export Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {(messages.length > 0 || streamingMessage) && (
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          voiceAssistant={voiceAssistant}
          disabled={false}
        />
      )}

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSignOut={handleSignOut}
        onClearChat={handleClearChat}
      />
    </div>
  );
};
