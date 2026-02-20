import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface VoiceAssistant {
  isVoiceMode: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  toggleVoiceMode: () => boolean;
  startListening: (onAutoSend?: (text: string) => void) => void;
  stopListening: () => void;
  getFinalTranscript: () => string;
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  voiceAssistant: VoiceAssistant;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, voiceAssistant, disabled = false }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  // Detect typing pause for breathing effect
  useEffect(() => {
    if (input) {
      setIsTyping(true);
      setShowBreathing(false);

      // Clear existing timer
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }

      // Set breathing effect after 1.5s of no typing
      typingTimerRef.current = setTimeout(() => {
        setIsTyping(false);
        setShowBreathing(true);
      }, 1500);
    } else {
      setIsTyping(false);
      setShowBreathing(false);
    }

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleVoiceClick = () => {
    if (voiceAssistant.isListening) {
      // Stop listening and send message
      voiceAssistant.stopListening();
      const finalText = voiceAssistant.getFinalTranscript();
      if (finalText.trim()) {
        onSendMessage(finalText);
      }
    } else {
      // Enable voice mode if not already enabled
      if (!voiceAssistant.isVoiceMode) {
        voiceAssistant.toggleVoiceMode();
      }
      // Start listening with auto-send on silence detection
      voiceAssistant.startListening((text: string) => {
        if (text.trim()) {
          onSendMessage(text);
        }
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 pt-4 pb-2 relative">
      {/* Smooth gradient overlay - no harsh line */}
      <div className="absolute inset-0 bg-gradient-to-t from-mindpex-dark-warm via-mindpex-dark-warm/60 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div
          className={`flex items-center gap-3 bg-mindpex-dark-gray rounded-xl p-3
                      border-2 transition-all duration-300 shadow-lg ${isLoading || voiceAssistant.isSpeaking
              ? 'border-slate-700'
              : voiceAssistant.isListening
                ? 'border-amber animate-glow-pulse'
                : showBreathing
                  ? 'border-amber/50 input-breathing'
                  : 'border-transparent focus-within:border-amber/50'
            }`}
        >
          {/* Text input or transcript display */}
          {voiceAssistant.isVoiceMode && (voiceAssistant.isListening || voiceAssistant.isSpeaking) ? (
            <div className="flex-1 text-slate-200 min-h-[40px] flex items-center">
              {voiceAssistant.isListening ? (
                <span className="text-amber animate-pulse">
                  {voiceAssistant.transcript || 'Listening...'}
                </span>
              ) : voiceAssistant.isSpeaking ? (
                <span className="text-amber italic">Speaking response...</span>
              ) : null}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="How's work showing up for you today?"
              disabled={isLoading || voiceAssistant.isSpeaking || disabled}
              rows={1}
              className="flex-1 bg-transparent text-slate-200 placeholder-slate-500
                         resize-none outline-none max-h-[150px]
                         disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Message input"
            />
          )}

          {/* Voice button - starts recording immediately */}
          <button
            onClick={handleVoiceClick}
            disabled={isLoading || voiceAssistant.isSpeaking || disabled}
            className={`p-2.5 rounded-lg transition-all duration-200 flex-shrink-0
                       ${voiceAssistant.isListening
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white animate-breathing shadow-lg shadow-red-500/50'
                : isLoading || voiceAssistant.isSpeaking || disabled
                  ? 'bg-mindpex-dark-gray-light text-slate-600 cursor-not-allowed border border-slate-700'
                  : 'text-slate-500 hover:text-amber hover:bg-amber/10'
              }`}
            aria-label={voiceAssistant.isListening ? 'Listening (auto-stop on silence)' : 'Start voice recording'}
          >
            {voiceAssistant.isListening ? (
              <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Send button */}
          {!voiceAssistant.isListening && (
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading || disabled}
              className={`px-5 py-2.5 rounded-lg font-semibold
                         transition-all duration-200 flex-shrink-0
                         ${!input.trim() || isLoading || disabled
                  ? 'bg-mindpex-dark-gray-light text-slate-600 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber to-amber-glow text-white btn-warm-glow animate-breathing shadow-lg'
                }`}
              aria-label="Send message"
            >
              {isLoading ? (
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Helper text */}
        <div className="mt-2 text-center">
          {voiceAssistant.isListening ? (
            <p className="text-xs text-amber">
              Recording... Auto-stops after 2 seconds of silence
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Press Enter to send
            </p>
          )}
        </div>

        {/* Phase 4: Anti-ChatGPT microcopy */}

      </div>
    </div>
  );
};
