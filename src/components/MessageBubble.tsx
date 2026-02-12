import React, { useState, useEffect } from 'react';
import { Message } from '../utils/types';
import { getOrganicOffset } from '../utils/sanctuary';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isWelcome = message.type === 'welcome';
  const [organicOffset] = useState(getOrganicOffset());
  const [isSettling, setIsSettling] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSettling(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (timestamp: Date | number) => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  // Special rendering for welcome messages - lighter, no bubble, no timestamp
  if (isWelcome) {
    return (
      <div className="flex justify-start mb-8 animate-fade-in">
        <div className="max-w-[85%]">
          <p className="text-slate-300/90 text-[17px] leading-relaxed font-light tracking-wide">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 spring-in`}
      style={{ marginLeft: isUser ? 0 : `${organicOffset}px` }}
    >
      <div
        className={`max-w-[80%] ${
          isUser
            ? 'bg-mindpex-dark-warm border-l-4 border-amber'
            : 'bg-mindpex-dark-gray-light border border-slate-700/50 message-glow breathing-presence'
        } rounded-lg px-4 py-3 shadow-lg group relative hover-organic ${
          isSettling ? 'message-settle' : ''
        }`}
      >
        {/* Message content */}
        <p className="text-slate-200 whitespace-pre-wrap leading-relaxed mb-2">
          {message.content}
        </p>

        {/* Timestamp and actions */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {formatTime(message.timestamp)}
          </span>

          {/* Copy button (visible on hover) */}
          <button
            onClick={copyToClipboard}
            className="opacity-0 group-hover:opacity-100 transition-opacity
                       text-xs text-slate-400 hover:text-mindpex-gold"
            aria-label="Copy message"
            title="Copy to clipboard"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        {/* Golden glow effect for AI messages */}
        {!isUser && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-mindpex-gold/0 via-mindpex-gold/5 to-mindpex-gold/0 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
        )}
      </div>
    </div>
  );
};
