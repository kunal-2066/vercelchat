import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

/**
 * Username + Password Authentication Modal
 *
 * - Username input
 * - Password input
 * - "I'm new here" checkbox for signup mode
 * - Confirm password shown only in signup mode
 */
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const { signUp, signIn } = useAuth();

  const [isNewUser, setIsNewUser] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isNewUser) {
        // Signup flow
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const { error: signUpError } = await signUp(username, password);

        if (signUpError) {
          if (signUpError.code === 'USERNAME_EXISTS') {
            setError('Username already taken');
          } else {
            setError(signUpError.message);
          }
        } else {
          onAuthSuccess();
          onClose();
        }
      } else {
        // Login flow
        const { error: signInError } = await signIn(username, password);

        if (signInError) {
          setError(signInError.message);
        } else {
          onAuthSuccess();
          onClose();
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-mindpex-dark/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-sm w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-amber/10 via-transparent to-amber/10 rounded-2xl blur-2xl" />

        <div className="relative backdrop-blur-xl bg-mindpex-dark-warm/80 border border-amber/20 rounded-2xl p-6 shadow-xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-amber/90 text-xl font-medium">
              {isNewUser ? 'Create account' : 'Sign in'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-slate-300/80 text-sm mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                minLength={2}
                className="w-full px-3 py-2.5 rounded-lg
                           backdrop-blur-md bg-white/5
                           border border-white/10
                           text-slate-200 placeholder-slate-400/50
                           focus:bg-amber/5 focus:border-amber/30 focus:outline-none
                           transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-slate-300/80 text-sm mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                minLength={4}
                className="w-full px-3 py-2.5 rounded-lg
                           backdrop-blur-md bg-white/5
                           border border-white/10
                           text-slate-200 placeholder-slate-400/50
                           focus:bg-amber/5 focus:border-amber/30 focus:outline-none
                           transition-all"
              />
            </div>

            {/* Confirm Password (signup only) */}
            {isNewUser && (
              <div>
                <label htmlFor="confirmPassword" className="block text-slate-300/80 text-sm mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  minLength={4}
                  className="w-full px-3 py-2.5 rounded-lg
                             backdrop-blur-md bg-white/5
                             border border-white/10
                             text-slate-200 placeholder-slate-400/50
                             focus:bg-amber/5 focus:border-amber/30 focus:outline-none
                             transition-all"
                />
              </div>
            )}

            {/* "I'm new here" checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="isNewUser"
                type="checkbox"
                checked={isNewUser}
                onChange={(e) => {
                  setIsNewUser(e.target.checked);
                  setError(null);
                  setConfirmPassword('');
                }}
                className="w-4 h-4 rounded border-slate-600 bg-white/5 text-amber focus:ring-amber/50 focus:ring-offset-0"
              />
              <label htmlFor="isNewUser" className="text-slate-300/70 text-sm cursor-pointer">
                I'm new here
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-400/90 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg
                         backdrop-blur-md bg-amber/20
                         border border-amber/40
                         text-amber-glow font-medium
                         hover:bg-amber/30 hover:border-amber/60
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all"
            >
              {loading ? 'Please wait...' : (isNewUser ? 'Create account' : 'Sign in')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
