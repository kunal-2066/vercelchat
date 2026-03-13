import React, { useState } from 'react';

interface FirstOpenIntroProps {
  onComplete: () => void;
}

const INTRO_COMPLETED_KEY = 'mindpex_intro_completed';

/**
 * First-Open Intro Flow (3 steps)
 * Shown ONCE per user, BEFORE any sign-in UI.
 */
export const FirstOpenIntro: React.FC<FirstOpenIntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [transitionState, setTransitionState] = useState<'entering' | 'active' | 'exiting'>('entering');

  // Initial Entrance
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTransitionState('active');
    }, 230); // Match fade-in-rise duration
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    // 1. Fade Out Current Content
    setTransitionState('exiting');

    setTimeout(() => {
      if (step < 3) {
        // 2. Pause (step change happens here)
        setStep(prev => prev + 1);

        // 3. Wait for pause duration, then trigger entering
        setTimeout(() => {
          setTransitionState('entering');

          // 4. Wait for enter duration, then set active
          setTimeout(() => {
            setTransitionState('active');
          }, 230);
        }, 120); // Reduced pause duration
      } else {
        // Final step: Move to next phase
        // Wait for exit animation to finish before notifying parent
        localStorage.setItem(INTRO_COMPLETED_KEY, 'true');
        onComplete();
      }
    }, 230); // Match fade-out duration
  };

  const getAnimationClass = () => {
    switch (transitionState) {
      case 'entering':
        return 'animate-fade-in-rise';
      case 'exiting':
        return 'animate-fade-out';
      case 'active':
        return 'opacity-100'; // Static state
      default:
        return 'opacity-0';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative z-10 w-full max-w-lg">
        <div className={`
          bg-mindpex-dark-warm/90 border border-amber/20 rounded-2xl p-8 shadow-2xl backdrop-blur-md
          ${getAnimationClass()}
        `}>

          {step === 1 && (
            <div>
              <p className="text-white text-lg font-medium leading-relaxed mb-6">
                Before you start — just a quick note
              </p>
              <p className="text-slate-300 text-base leading-relaxed mb-4">
                This space is here whenever you need to think something through,
                so you don’t have to carry it quietly while work keeps moving.
              </p>
              <p className="text-slate-300 text-base leading-relaxed mb-4">
                There are no right answers, and no single response defines anything about you.
              </p>
              <p className="text-slate-300 text-base leading-relaxed">
                When I show up, just respond naturally and move on.
              </p>

              <div className="flex justify-end mt-10">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 text-sm font-semibold rounded-lg
                             transition-all duration-200 border
                             text-slate-400 bg-slate-800/40 border-slate-700/50
                             hover:text-white hover:bg-amber hover:border-amber hover:shadow-lg hover:shadow-amber/20"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-8">
                <h3 className="text-white text-base font-bold mb-6">How Mindpex fits into your day</h3>
                <div className="space-y-3">
                  <p className="text-slate-300 text-base leading-relaxed mb-4">
                    Mindpex is something you use briefly — a moment to think something through, then move on.
                  </p>
                  <p className="text-slate-300 text-base leading-relaxed mb-4">
                    You’ll usually open it after a meeting, a conversation,
                    or when something at work doesn’t quite sit right.
                  </p>
                  <p className="text-slate-300 text-base leading-relaxed mb-4">
                    There’s no need for long explanations.
                    Just respond naturally and continue with your day.
                  </p>
                  <p className="text-slate-300 text-base leading-relaxed mb-4">
                    It’s designed to stay in the background,
                  </p>
                  <p className="text-slate-300 text-base leading-relaxed mb-4">
                    ready when you need a moment of clarity.

                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-10">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 text-sm font-semibold rounded-lg
                             transition-all duration-200 border
                             text-slate-400 bg-slate-800/40 border-slate-700/50
                             hover:text-white hover:bg-amber hover:border-amber hover:shadow-lg hover:shadow-amber/20"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-8">
                <h3 className="text-white text-base font-bold mb-6">What you get from this</h3>
                <div className="space-y-3">
                  <p className="text-slate-300 text-base leading-relaxed">
                    This space is for you.
                  </p>
                  <p className="text-slate-300 text-base leading-relaxed">
                    If something at work ever feels a little heavy or just not quite right, you don’t have to carry it quietly or wait for it to turn into something bigger.
                  </p>
                  <p className="text-slate-300 text-base leading-relaxed">
                    You can respond in your own words, without overthinking it — that’s enough.
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-10">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 text-sm font-semibold rounded-lg
                             transition-all duration-200 border
                             text-slate-400 bg-slate-800/40 border-slate-700/50
                             hover:text-white hover:bg-amber hover:border-amber hover:shadow-lg hover:shadow-amber/20"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function hasCompletedIntro(): boolean {
  return localStorage.getItem(INTRO_COMPLETED_KEY) === 'true';
}
