/**
 * Supabase Client - DISABLED (Local Mode)
 * This file is kept as a stub to avoid import errors
 * TODO: Re-implement when backend is integrated
 */

// Export stub types for compatibility
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Session {
  user: User;
}

// Stub client - not functional
export const supabase: any = null;

// Stub helper functions
export const getCurrentUser = async (): Promise<User | null> => {
  console.warn('getCurrentUser called in local mode - returning null');
  return null;
};

export const getCurrentSession = async (): Promise<Session | null> => {
  console.warn('getCurrentSession called in local mode - returning null');
  return null;
};

export const isAuthenticated = async (): Promise<boolean> => {
  // In local mode, always return true (user is "authenticated" locally)
  return true;
};

// Database interface (not used in local mode)
export interface Database {
  // Stub type
}

export default supabase;
