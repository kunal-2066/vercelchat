import React from 'react';

/**
 * Debug component - disabled (Supabase removed)
 * This was used for diagnosing authentication issues
 * TODO: Re-implement when backend is integrated
 */
export const AuthDebug: React.FC = () => {
  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-2">Debug Mode Disabled</h2>
      <p className="text-sm text-gray-400">
        Running in local mode. Authentication debugging is not available.
      </p>
    </div>
  );
};
