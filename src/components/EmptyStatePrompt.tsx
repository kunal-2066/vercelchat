import React, { useState, useEffect } from 'react';

export const EmptyStatePrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Tiny delay to ensure the browser registers the initial opacity-0 state before transitioning
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`flex justify-center px-4 overflow-hidden transition-all duration-[1500ms] ease-in-out ${
        isVisible ? 'opacity-100 max-h-[300px] mb-[18px] translate-y-0' : 'opacity-0 max-h-0 mb-0 -translate-y-4'
      }`}
    >
      <div className="max-w-[520px] text-center pb-2">
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
