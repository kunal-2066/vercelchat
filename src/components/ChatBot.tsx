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
import { EmptyStatePrompt } from './EmptyStatePrompt';

interface ChatBotProps {
  username: string | null;
}

const formatDateLabel = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (d.getTime() === today.getTime()) return 'TODAY';
  if (d.getTime() === yesterday.getTime()) return 'YESTERDAY';

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  }).toUpperCase();
};

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
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const displayName = username || '';

  const resetIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    setShowPrompt(false);

    if (messages.length === 0 && message.trim() === '') {
      idleTimerRef.current = setTimeout(() => {
        setShowPrompt(true);
      }, 4500);
    }
  };

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [messages.length, message]);

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

  const handleClearChat = async () => {
    if (messages.length === 0) return;

    if (window.confirm('Start a fresh conversation?')) {
      setIsResetting(true);
      // Wait for fade out
      await new Promise(resolve => setTimeout(resolve, 150));

      clearMessages();

      // Reset after a tiny delay to ensure first msg mounts if any
      setTimeout(() => {
        setIsResetting(false);
      }, 50);
    }
  };

  const handleExport = () => {
    if (messages.length > 0) {
      exportConversation(messages);
    }
  };

  const handleSendMessage = (msg: string) => {
    sendMessage(msg);
  };

  const handleMoodSelect = (mood: string) => {
    setMessage(mood);
  };

  const handleSignOut = () => {
    localStorage.removeItem('mindpex_username');
    localStorage.removeItem('user_display_name');
    localStorage.removeItem('mindpex_intro_completed');
    window.location.reload();
  };

  return (
    <div className={`flex flex-col h-screen ${sanctuaryBg} theme-transition relative overflow-hidden`}>
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
        onScroll={resetIdleTimer}
        className={`flex-1 overflow-y-auto px-2 md:px-4 py-4 md:py-6 pt-20 md:pt-6 relative z-10 transition-opacity duration-150 ${isResetting ? 'opacity-0 animate-fade-out-fast' : 'opacity-100'}`}
      >
        <div className={`max-w-4xl mx-auto sanctuary-glow ${!isResetting ? 'animate-fade-in-simple' : ''}`}>
          {messages.length === 0 && !streamingMessage && (
            <div className="flex flex-col items-center pt-8">
              {showPrompt && <EmptyStatePrompt />}
              <MoodChips onSelect={handleMoodSelect} showGuidedLine={showPrompt} />
            </div>
          )}

          {messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const showDivider = !prevMessage ||
              new Date(message.timestamp).toDateString() !== new Date(prevMessage.timestamp).toDateString();

            return (
              <React.Fragment key={message.id}>
                {showDivider && (
                  <div className="flex flex-col items-center my-8 animate-fade-in-simple">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-2">
                      {formatDateLabel(new Date(message.timestamp))}
                    </span>
                    <div className="w-full max-w-[200px] h-[1px] bg-slate-800" />
                  </div>
                )}
                <MessageBubble
                  message={message}
                  onEdit={editMessage}
                  onSwitchVersion={switchVersion}
                  onRegenerate={regenerateMessage}
                />
              </React.Fragment>
            );
          })}

          {streamingMessage && (
            <div className="flex justify-start mb-4 animate-fade-in-simple">
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

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        voiceAssistant={voiceAssistant}
        disabled={false}
        message={message}
        onMessageChange={setMessage}
      />

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSignOut={handleSignOut}
        onClearChat={handleClearChat}
      />
    </div>
  );
};
