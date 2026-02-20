import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-mindpex-dark z-50 flex items-center justify-center">
      {/* Ambient sanctuary background */}
      <div className="absolute inset-0 bg-gradient-to-b from-mindpex-dark via-mindpex-dark-warm to-mindpex-dark"></div>

      {/* Warm glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-amber/5 rounded-full blur-3xl"></div>
      </div>

      {/* Logo container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Mindpex logo with sanctuary animation */}
        <h1 className="text-5xl font-bold tracking-tight logo-sanctuary-reveal">
          <span className="gradient-text-warm">Mindpex</span>
        </h1>

        {/* Subtle tagline */}
        <p className="text-slate-400 text-sm mt-4 opacity-0 tagline-fade-in">


        </p>
      </div>
    </div>
  );
};
