import React, { useState } from "react";

const USERNAME_KEY = "mindpex_username";

interface UsernameEntryProps {
  onComplete: (username: string) => void;
}

export const UsernameEntry: React.FC<UsernameEntryProps> = ({ onComplete }) => {
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = username.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);

    // Allow both returning and new users by the same username.
    // Chat history is isolated by username in chatDatabase.
    localStorage.setItem(USERNAME_KEY, trimmed);
    localStorage.setItem("user_display_name", trimmed);
    onComplete(trimmed);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
      <div className="relative z-10 w-full max-w-sm mx-4 pointer-events-auto">
        <div className="bg-mindpex-dark-warm/90 border border-amber/20 rounded-2xl p-8 shadow-2xl backdrop-blur-md animate-fade-in-static">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-slate-300/80 text-sm mb-2"
              >
                Choose a name you’re comfortable with
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                autoFocus
                autoComplete="off"
                minLength={2}
                maxLength={30}
                className="w-full px-4 py-3 rounded-lg
                           backdrop-blur-md bg-white/5
                           border border-white/10
                           text-slate-200 placeholder-slate-400/50
                           focus:bg-amber/5 focus:border-amber/30 focus:outline-none
                           transition-all"
                placeholder="Choose a username"
              />
            </div>

            <button
              type="submit"
              disabled={!username.trim() || submitting}
              className="w-full py-3 rounded-lg
                         backdrop-blur-md bg-amber/20
                         border border-amber/40
                         text-amber-glow font-medium
                         hover:bg-amber/30 hover:border-amber/60
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all"
            >
              {submitting ? "Checking..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export function getStoredUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function clearStoredUsername(): void {
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem("user_display_name");
}
