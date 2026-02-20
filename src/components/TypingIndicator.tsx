import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 px-4 py-3 spring-in">
      <div className="flex space-x-1.5">
        <div
          className="w-2.5 h-2.5 rounded-full bg-amber typing-dot"
          style={{ animationDelay: '0ms' }}
        />
        <div
          className="w-2.5 h-2.5 rounded-full bg-amber typing-dot"
          style={{ animationDelay: '0.2s' }}
        />
        <div
          className="w-2.5 h-2.5 rounded-full bg-amber typing-dot"
          style={{ animationDelay: '0.4s' }}
        />
      </div>
      <span className="text-sm text-slate-400 italic">Holding space...</span>
    </div>
  );
};
