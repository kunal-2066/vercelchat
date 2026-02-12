import React from 'react';
import { clearStoredUsername } from './UsernameEntry';

interface HeaderProps {
  displayName: string;
  onClearChat: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  displayName,
  onClearChat,
  isSoundEnabled,
  onToggleSound,
  onOpenSettings,
}) => {
  const handleSignOut = () => {
    clearStoredUsername();
    localStorage.removeItem('mindpex_intro_completed');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-mindpex-dark-warm/80 backdrop-blur-md border-b border-amber/20">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-mindpex-dark-warm/80 border border-slate-700/50 hover:border-amber/50 transition-all btn-warm-glow"
            title={isSoundEnabled ? 'Disable ambient sound' : 'Enable ambient sound'}
          >
            {isSoundEnabled ? (
              <svg className="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM10 2a8 8 0 110 16 8 8 0 010-16zm0 4a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold gradient-text-warm tracking-tight">
              Mindpex
            </h1>
            <p className="text-sm text-slate-400"></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {displayName && (
            <span className="text-sm text-slate-300 font-medium">
              {displayName}
            </span>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-400 hover:text-amber
                       border border-slate-600 hover:border-amber/50
                       transition-colors duration-200 btn-warm-glow"
            aria-label="Settings"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-amber
                       border border-slate-600 hover:border-amber/50
                       rounded-lg transition-colors duration-200 btn-warm-glow"
            aria-label="Sign out"
          >
            Sign Out
          </button>

          <button
            onClick={onClearChat}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-amber
                       border border-slate-600 hover:border-amber/50
                       rounded-lg transition-colors duration-200 btn-warm-glow"
            aria-label="Clear conversation"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </header>
  );
};
