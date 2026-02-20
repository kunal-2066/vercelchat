import React from 'react';

export interface EmojiOption {
  emoji: string;
  label: string;
  value: number; // 1-5 valence scale
}

interface EmojiSentimentTapProps {
  question: string;
  options: EmojiOption[]; // Now accepts dynamic options from parent
  onSubmit: (sentiment: number, emoji: string) => void;
  onDismiss: () => void;
  onResponse: (responseText: string) => void;
}

export const EmojiSentimentTap: React.FC<EmojiSentimentTapProps> = ({ question, options, onSubmit, onDismiss, onResponse }) => {
  const emojiOptions = options;

  const handleEmojiClick = (option: EmojiOption) => {
    // Save sentiment data
    onSubmit(option.value, option.emoji);
    
    // Generate conversational response based on selection
    const responses: Record<number, string[]> = {
      5: [
        "That's great to hear! What went well today?",
        "I'm really glad you're feeling good. What's been working for you?",
        "That's wonderful. What made today feel manageable?"
      ],
      4: [
        "It sounds like you're doing okay. Anything on your mind?",
        "Good to hear you're handling things. How can I support you today?",
        "Glad you're keeping it together. Want to talk about anything?"
      ],
      3: [
        "Things feel heavy, don't they? What's been weighing on you?",
        "I hear you. What's making today feel hard?",
        "It sounds tough. Want to talk about what's going on?"
      ],
      2: [
        "I'm sorry it's been rough. What's been the hardest part?",
        "That sounds really difficult. What's been overwhelming you?",
        "I can tell you're struggling. What's weighing you down most?"
      ],
      1: [
        "I'm so sorry you're going through this. What's been crushing you?",
        "That sounds incredibly hard. Do you want to tell me what happened?",
        "I'm here for you. What's making everything feel impossible right now?"
      ]
    };
    
    const responseOptions = responses[option.value] || responses[3];
    const response = responseOptions[Math.floor(Math.random() * responseOptions.length)];
    
    // Add as assistant message (bot asking the question)
    onResponse(response);
    
    // Dismiss sentiment prompt immediately
    onDismiss();
  };

  // No need for submitted state - we immediately trigger conversation

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-fade-in-gentle">
      {/* Warm liquid glass container - sanctuary aesthetic */}
      <div className="relative max-w-sm">
        {/* Warm glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber/5 via-amber-glow/5 to-amber/5 rounded-3xl blur-2xl"></div>
        
        {/* Liquid glass surface */}
        <div className="relative backdrop-blur-xl bg-mindpex-dark-warm/40 
                        border border-amber/20 rounded-3xl px-6 py-5 
                        shadow-[0_8px_32px_0_rgba(217,119,6,0.15)]
                        before:absolute before:inset-0 
                        before:rounded-3xl before:p-[1px]
                        before:bg-gradient-to-br before:from-amber/30 before:via-transparent before:to-amber-glow/20
                        before:-z-10
                        breathing-presence">
          
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber/5 to-transparent rounded-3xl pointer-events-none"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-amber/90 font-medium text-base leading-relaxed pr-4">{question}</h3>
              <button
                onClick={onDismiss}
                className="text-slate-400/60 hover:text-slate-300/80 transition-all duration-300 
                           hover:scale-110 flex-shrink-0"
                aria-label="Dismiss"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            {/* Confession buttons - warm liquid glass surfaces */}
            <div className="flex flex-col gap-2.5">
              {emojiOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleEmojiClick(option)}
                  className="group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left
                             backdrop-blur-md bg-white/5
                             border border-white/10
                             hover:bg-amber/10 hover:border-amber/30
                             transition-all duration-300
                             hover:shadow-[0_4px_16px_0_rgba(217,119,6,0.15)]
                             hover:scale-[1.02]
                             overflow-hidden"
                  aria-label={option.label}
                >
                  {/* Warm glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber/0 via-amber/5 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <span className="text-2xl flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-200">
                    {option.emoji}
                  </span>
                  <span className="text-sm text-slate-200/80 group-hover:text-amber-glow/90 
                                 transition-colors duration-300 leading-relaxed relative z-10">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Subtext - soft and warm */}
            <p className="text-center text-slate-400/60 text-xs mt-4 leading-relaxed">
              Just one tap • Completely anonymous • Your feelings matter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
