/**
 * Proactive greeting hook - Neutral, brief greeting for work memory context
 * No coaching, no therapy language, no encouragement to elaborate
 */

import { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/storage';

const LAST_VISIT_KEY = 'mindpex_last_visit';
const PROACTIVE_GREETING_SHOWN_KEY = 'mindpex_greeting_shown';

export interface ProactiveGreeting {
  message: string;
}

// Neutral, brief greetings - no coaching or therapeutic language
const RETURNING_USER_GREETINGS = [
  "Checking in.",
  "Back again.",
  "Here when you need.",
];

const FIRST_TIME_GREETING = "Ready when you are.";

/**
 * Hook to determine if a brief greeting should show
 */
export function useProactiveGreeting(hasMessages: boolean): ProactiveGreeting {
  const [greeting, setGreeting] = useState<ProactiveGreeting>({
    message: '',
  });

  useEffect(() => {
    // Don't generate if conversation already started
    if (hasMessages) {
      return;
    }

    // Check if greeting already shown this session
    const greetingShown = sessionStorage.getItem(PROACTIVE_GREETING_SHOWN_KEY);
    if (greetingShown) {
      return;
    }

    const initializeGreeting = () => {
      const lastVisit = getFromLocalStorage<number>(LAST_VISIT_KEY, 0);
      const now = Date.now();
      const isReturningUser = lastVisit > 0;

      // Select appropriate greeting - simple and neutral
      const greetingMessage = isReturningUser
        ? RETURNING_USER_GREETINGS[Math.floor(Math.random() * RETURNING_USER_GREETINGS.length)]
        : FIRST_TIME_GREETING;

      // Set greeting after brief delay
      const timer = setTimeout(() => {
        setGreeting({
          message: greetingMessage,
        });

        // Mark greeting as shown for this session
        sessionStorage.setItem(PROACTIVE_GREETING_SHOWN_KEY, 'true');
      }, 1500);

      // Update last visit time
      saveToLocalStorage(LAST_VISIT_KEY, now);

      return () => clearTimeout(timer);
    };

    initializeGreeting();
  }, [hasMessages]);

  return greeting;
}
