import React from 'react';
import { clearStoredUsername } from './UsernameEntry';

interface HeaderProps {
  displayName: string;
  onClearChat: () => void;
  onSignOut: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  displayName,
  onClearChat,
  onSignOut,
  isSoundEnabled,
  onToggleSound,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-mindpex-dark-warm/80 backdrop-blur-md border-b border-amber/20 h-14 md:h-auto flex items-center">
      <div className="w-full max-w-4xl mx-auto px-4 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">


          {/* Sound button for mobile (if not hidden above). Actually spec says "Left: Sound". So I'll make sure it's visible. */}

          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            {/* Center Title for Mobile? Spec says "Center: Mindpex". The current layout is Flex Justify-Between.
                 To center title on mobile, we might need absolute positioning or flex modifications. 
                 For now, let's stick to standard flex logic but ensure visibility.
             */}
            <h1 className="text-xl md:text-2xl font-bold gradient-text-warm tracking-tight">
              Mindpex
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {displayName && (
            <span className="text-sm text-slate-300 font-medium hidden md:block">
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
            onClick={onSignOut}
            className="hidden md:block px-4 py-2 text-sm font-medium text-slate-300 hover:text-amber
                       border border-slate-600 hover:border-amber/50
                       rounded-lg transition-colors duration-200 btn-warm-glow"
            aria-label="Sign out"
          >
            Sign Out
          </button>

          <button
            onClick={onClearChat}
            className="hidden md:block px-4 py-2 text-sm font-medium text-slate-300 hover:text-amber
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
