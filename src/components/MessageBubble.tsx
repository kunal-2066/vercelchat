import React, { useState, useEffect } from 'react';
import { Message } from '../utils/types';
import { getOrganicOffset } from '../utils/sanctuary';

interface MessageBubbleProps {
  message: Message;
  onEdit?: (id: string, newContent: string) => void;
  onSwitchVersion?: (id: string, index: number) => void;
  onRegenerate?: (id: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onEdit,
  onSwitchVersion,
  onRegenerate
}) => {
  const isUser = message.role === 'user';
  const isWelcome = message.type === 'welcome';
  const [organicOffset] = useState(getOrganicOffset());
  const [isSettling, setIsSettling] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const versions = message.versions || [];
  const currentVersion = message.currentVersionIndex ?? 0;
  const hasMultipleVersions = versions.length > 1;

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

  const handleSaveEdit = () => {
    if (editContent.trim() !== message.content) {
      onEdit?.(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handlePrevVersion = () => {
    if (currentVersion > 0 && onSwitchVersion) {
      onSwitchVersion(message.id, currentVersion - 1);
    }
  };

  const handleNextVersion = () => {
    if (currentVersion < versions.length - 1 && onSwitchVersion) {
      onSwitchVersion(message.id, currentVersion + 1);
    }
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
        className={`max-w-[80%] ${isUser
          ? 'bg-mindpex-dark-warm border-l-4 border-amber'
          : 'bg-mindpex-dark-gray-light border border-slate-700/50 message-glow breathing-presence'
          } rounded-2xl md:rounded-lg px-4 py-3 shadow-lg group relative hover-organic ${isSettling ? 'message-settle' : ''
          }`}
      >
        {isEditing ? (
          <div className="w-full min-w-[200px]">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-black/20 text-slate-200 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber/50 resize-none mb-2"
              rows={Math.max(2, Math.min(10, editContent.split('\n').length))}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 rounded hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 rounded hover:bg-white/5 transition-colors"
                title="Save changes"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Message content */}
            <p className="text-slate-200 whitespace-pre-wrap leading-relaxed mb-2">
              {message.content}
            </p>

            {/* Timestamp and actions */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                {formatTime(message.timestamp)}
              </span>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Version Switcher (All messages) */}
                {hasMultipleVersions && (
                  <div className="flex items-center gap-1 mr-2 select-none">
                    <button
                      onClick={handlePrevVersion}
                      disabled={currentVersion === 0}
                      className={`text-slate-400 hover:text-white transition-colors ${currentVersion === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="text-xs text-slate-400 font-mono">
                      {currentVersion + 1} / {versions.length}
                    </span>
                    <button
                      onClick={handleNextVersion}
                      disabled={currentVersion === versions.length - 1}
                      className={`text-slate-400 hover:text-white transition-colors ${currentVersion === versions.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                )}

                {/* Regenerate button (Assistant only) */}
                {!isUser && onRegenerate && (
                  <button
                    onClick={() => onRegenerate(message.id)}
                    className="text-xs text-slate-400 hover:text-mindpex-gold mr-1"
                    aria-label="Regenerate response"
                    title="Regenerate"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}

                {/* Edit button (User only) */}
                {isUser && onEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-slate-400 hover:text-amber transition-colors"
                    aria-label="Edit message"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}

                {/* Copy button */}
                <button
                  onClick={copyToClipboard}
                  className="text-xs text-slate-400 hover:text-mindpex-gold"
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
            </div>
          </>
        )}

        {/* Golden glow effect for AI messages */}
        {!isUser && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-mindpex-gold/0 via-mindpex-gold/5 to-mindpex-gold/0 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
        )}
      </div>
    </div>
  );
};
