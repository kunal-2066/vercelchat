import React from 'react';

interface StreamingTextProps {
  text: string;
}

export const StreamingText: React.FC<StreamingTextProps> = ({ text }) => {
  return (
    <div className="relative">
      <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
        {text}
        <span className="inline-block w-1 h-4 ml-1 bg-mindpex-gold animate-pulse" />
      </p>
    </div>
  );
};
