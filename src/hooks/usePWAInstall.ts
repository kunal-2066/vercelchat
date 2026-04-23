import { useState, useEffect } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Global state to catch the event immediately regardless of React component mounts
let deferredPromptGlobal: BeforeInstallPromptEvent | null = null;
let isInstallableGlobal = false;

// Array of setter functions to update all instances of the hook when event arrives
const listeners: ((isInstallable: boolean, prompt: BeforeInstallPromptEvent | null) => void)[] = [];

// Attach to window immediately so we don't miss it during React loads
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPromptGlobal = e as BeforeInstallPromptEvent;
    isInstallableGlobal = true;
    listeners.forEach(listener => listener(true, deferredPromptGlobal));
  });
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(deferredPromptGlobal);
  const [isInstallable, setIsInstallable] = useState(isInstallableGlobal);

  useEffect(() => {
    // Initial sync in case it changed between module evaluation and component mount
    setIsInstallable(isInstallableGlobal);
    setDeferredPrompt(deferredPromptGlobal);

    const listener = (installable: boolean, prompt: BeforeInstallPromptEvent | null) => {
      setIsInstallable(installable);
      setDeferredPrompt(prompt);
    };
    
    // Register this instance
    listeners.push(listener);
    
    return () => {
      // Unregister
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt native sheet
    deferredPrompt.prompt();
    // Wait for the user to respond
    await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, so throw it away globally
    deferredPromptGlobal = null;
    isInstallableGlobal = false;
    listeners.forEach(listener => listener(false, null));
  };

  return { isInstallable, promptInstall };
};
