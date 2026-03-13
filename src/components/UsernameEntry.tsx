import React, { useState } from "react";

const USERNAME_KEY = "mindpex_username";

interface UsernameEntryProps {
  onComplete: (username: string) => void;
}

export const UsernameEntry: React.FC<UsernameEntryProps> = ({ onComplete }) => {
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUsernameAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      // Placeholder API call
      await fetch("/api/auth/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      }).catch(() => {}); // Swallow error for placeholder

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.setItem(USERNAME_KEY, trimmed);
      localStorage.setItem("user_display_name", trimmed);
      onComplete(trimmed);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      // Placeholder API call
      await fetch("/api/auth/google").catch(() => {});

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Placeholder success behavior
      const fakeGoogleUser = "Guest User";
      localStorage.setItem(USERNAME_KEY, fakeGoogleUser);
      localStorage.setItem("user_display_name", fakeGoogleUser);
      onComplete(fakeGoogleUser);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
      <div className="relative z-10 w-full max-w-sm mx-4 pointer-events-auto">
        <div className="bg-mindpex-dark-warm/90 border border-amber/20 rounded-2xl p-8 shadow-2xl backdrop-blur-md animate-fade-in-static">
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-white">
              Choose a name you're comfortable with
            </h2>
          </div>

          <form onSubmit={handleUsernameAuth} className="space-y-4">
            <div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(null);
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
              {error && (
                <p className="mt-2 text-sm text-red-400 animate-fade-in">
                  {error}
                </p>
              )}
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
                         transition-all flex items-center justify-center gap-2"
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-amber-glow/30 border-t-amber-glow rounded-full animate-spin" />
              )}
              {submitting ? "Checking..." : "Continue"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            onClick={handleGoogleAuth}
            disabled={submitting}
            className="w-full py-3 rounded-lg
                       border border-white/10
                       text-slate-300 font-medium
                       hover:bg-white/5 hover:text-white
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
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
