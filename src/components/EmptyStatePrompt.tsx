import React from 'react';

export const EmptyStatePrompt: React.FC = () => {
  return (
    <div className="flex justify-center mb-[18px] animate-fade-in px-4">
      <div className="max-w-[520px] text-center">
        <h3 className="text-white/85 font-medium mb-3">Not sure where to start?</h3>
        <p className="text-[14px] leading-[1.6] text-white/65">
          Many people open Mindpex after:<br />
          • a meeting that didn’t go as expected<br />
          • feedback that left them second-guessing<br />
          • not being sure what to do next<br />
          • feeling that something at work is off<br />
          • feeling overwhelmed with tasks
        </p>
      </div>
    </div>
  );
};
