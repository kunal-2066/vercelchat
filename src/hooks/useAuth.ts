import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

interface User {
  id: string;
  username: string;
  display_name?: string;
  intro_completed: boolean;
  created_at: string;
}

interface Session {
  user: User;
  token: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAnonymous: boolean;
}

interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

interface UseAuthReturn extends AuthState {
  signUp: (username: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (username: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<void>;
  markIntroComplete: () => Promise<void>;
  updateProfile: (displayName: string) => Promise<void>;
}

const TOKEN_KEY = 'mindpex_auth_token';
const USER_KEY = 'mindpex_auth_user';

/**
 * Username + Password Authentication Hook
 */
export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAnonymous: true,
  });

  const initializeAuth = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAuthState({
            user: data.user,
            session: { user: data.user, token: storedToken },
            loading: false,
            isAnonymous: false,
          });
          return;
        } else {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    setAuthState({
      user: null,
      session: null,
      loading: false,
      isAnonymous: true,
    });
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const signUp = async (
    username: string,
    password: string
  ): Promise<{ user: User | null; error: AuthError | null }> => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          user: null,
          error: {
            message: data.error || 'Failed to create account',
            status: response.status,
            code: data.code,
          },
        };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem('user_display_name', data.user.display_name || username);

      setAuthState({
        user: data.user,
        session: { user: data.user, token: data.token },
        loading: false,
        isAnonymous: false,
      });

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        user: null,
        error: {
          message: 'Network error. Please check your connection.',
          status: 0,
        },
      };
    }
  };

  const signIn = async (
    username: string,
    password: string
  ): Promise<{ user: User | null; error: AuthError | null }> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          user: null,
          error: {
            message: data.error || 'Failed to sign in',
            status: response.status,
          },
        };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem('user_display_name', data.user.display_name || username);

      setAuthState({
        user: data.user,
        session: { user: data.user, token: data.token },
        loading: false,
        isAnonymous: false,
      });

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        user: null,
        error: {
          message: 'Network error. Please check your connection.',
          status: 0,
        },
      };
    }
  };

  const signOut = async (): Promise<void> => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('user_display_name');

    setAuthState({
      user: null,
      session: null,
      loading: false,
      isAnonymous: true,
    });
  };

  const markIntroComplete = async (): Promise<void> => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/auth/intro-complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        setAuthState(prev => ({
          ...prev,
          user: data.user,
          session: prev.session ? { ...prev.session, user: data.user } : null,
        }));
      }
    } catch (error) {
      console.error('Mark intro complete error:', error);
    }
  };

  const updateProfile = async (displayName: string): Promise<void> => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ display_name: displayName }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem('user_display_name', displayName);

      setAuthState(prev => ({
        ...prev,
        user: data.user,
        session: prev.session ? { ...prev.session, user: data.user } : null,
      }));

      window.dispatchEvent(new CustomEvent('settingsUpdated'));
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    markIntroComplete,
    updateProfile,
  };
};

export default useAuth;
