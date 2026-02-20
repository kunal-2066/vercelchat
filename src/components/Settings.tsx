import React, { useState, useEffect } from 'react';
import { getStoredUsername } from './UsernameEntry';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  onClearChat: () => void;
}

const SETTINGS_KEY = 'mindpex_user_settings';

interface UserSettings {
  nickname: string;
  soundEnabled: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, onSignOut, onClearChat }) => {
  const [nickname, setNickname] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        try {
          const settings: UserSettings = JSON.parse(stored);
          setNickname(settings.nickname || '');
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    setSaving(true);

    const settings: UserSettings = {
      nickname: nickname.trim(),
      soundEnabled: false,
    };

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    localStorage.setItem('user_display_name', nickname.trim() || getStoredUsername() || '');

    window.dispatchEvent(new CustomEvent('settingsUpdated'));

    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 300);
  };

  const handleSignOutClick = () => {
    onClose();
    onSignOut();
  };

  const handleClearChatClick = () => {
    onClose();
    onClearChat();
  };

  if (!isOpen) return null;

  const username = getStoredUsername();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-mindpex-dark/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-br from-amber/10 via-transparent to-amber-glow/10 rounded-3xl blur-2xl" />

        <div className="relative backdrop-blur-2xl bg-mindpex-dark-warm/90
                      border border-amber/30 rounded-3xl p-6 shadow-2xl">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-200">Settings</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-amber transition-colors"
              aria-label="Close settings"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <div className="px-4 py-2.5 bg-mindpex-dark/50 border border-slate-700 rounded-lg text-slate-400 text-sm">
                {username || '—'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter a display name"
                className="w-full px-4 py-2.5 bg-mindpex-dark/50 border border-amber/20
                         rounded-lg text-slate-200 placeholder-slate-500
                         focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/50
                         transition-all"
                maxLength={30}
              />
              <p className="text-xs text-slate-500 mt-1.5">
                This is how Mindpex will address you
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-2 px-6 py-3 rounded-xl
                       bg-gradient-to-r from-amber to-amber-glow
                       text-mindpex-dark font-semibold text-lg
                       hover:opacity-90 transition-opacity
                       shadow-lg shadow-amber/20
                       disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>

            {/* Actions for Mobile mostly, but available everywhere */}
            <div className="pt-6 mt-6 border-t border-slate-700/50 space-y-3">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Actions</h3>

              <button
                onClick={handleClearChatClick}
                className="w-full px-4 py-2.5 rounded-lg text-left text-sm font-medium 
                         text-slate-300 hover:text-white hover:bg-slate-700/50 
                         transition-colors flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Conversation
              </button>

              <button
                onClick={handleSignOutClick}
                className="w-full px-4 py-2.5 rounded-lg text-left text-sm font-medium 
                         text-red-400 hover:text-red-300 hover:bg-red-500/10 
                         transition-colors flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
