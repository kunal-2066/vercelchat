import React, { useState, useEffect } from 'react';
import { ChatBot } from './components/ChatBot';
import { LoadingScreen } from './components/LoadingScreen';
import { FirstOpenIntro, hasCompletedIntro } from './components/FirstOpenIntro';
import { UsernameEntry, getStoredUsername } from './components/UsernameEntry';

type AppPhase = 'loading' | 'intro' | 'username' | 'chat';

function App() {
  const [phase, setPhase] = useState<AppPhase>('loading');
  const [showLoading, setShowLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Loading screen for 2.5 seconds
    const timer = setTimeout(() => {
      setShowLoading(false);

      // Determine next phase
      const introCompleted = hasCompletedIntro();
      const storedUsername = getStoredUsername();

      if (!introCompleted) {
        setPhase('intro');
      } else if (!storedUsername) {
        setPhase('username');
      } else {
        setUsername(storedUsername);
        setPhase('chat');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleIntroComplete = () => {
    setPhase('username');
  };

  const handleUsernameComplete = (name: string) => {
    setUsername(name);
    setPhase('chat');
  };

  return (
    <>
      {/* Static Background - Persists across all phases */}
      <div className="fixed inset-0 z-0 bg-mindpex-dark">
        <div className="absolute inset-0 bg-gradient-to-b from-mindpex-dark via-mindpex-dark-warm to-mindpex-dark" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-amber/5 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {showLoading && (
          <div className={`transition-opacity duration-500 ${phase === 'loading' ? 'opacity-100' : 'opacity-0'}`}>
            <LoadingScreen />
          </div>
        )}

        {phase === 'intro' && (
          <FirstOpenIntro onComplete={handleIntroComplete} />
        )}

        {phase === 'username' && (
          <UsernameEntry onComplete={handleUsernameComplete} />
        )}

        {phase === 'chat' && (
          <div className="animate-fade-in">
            <ChatBot username={username} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
