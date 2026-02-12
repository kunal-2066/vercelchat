import { useState, useEffect } from 'react';
import { generateContextualQuestion } from '../api/generateContextualQuestion';
import { Message } from '../utils/types';
import { EmojiOption } from '../components/EmojiSentimentTap';

interface SentimentRecord {
  timestamp: number;
  sentiment: number;
  emoji: string;
  weekNumber: number;
  questionId: string;
  questionText: string;
  category: string;
}

interface ContextualQuestion {
  question: string;
  options: EmojiOption[];
}

const PROMPT_INTERVAL = 0; // TEST MODE: 0 = always show (production: 7 * 24 * 60 * 60 * 1000)
const SENTIMENT_KEY = 'mindpex_sentiment_records';

/**
 * Hook to manage contextual emoji sentiment tap feature
 * Generates questions based on conversation context
 * TODO: Replace localStorage with backend when project is complete
 */
export const useEmojiSentiment = (messages: Message[]) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [sentimentRecords, setSentimentRecords] = useState<SentimentRecord[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<ContextualQuestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get current week number
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Load sentiment records from localStorage
  useEffect(() => {
    const loadSentimentRecords = () => {
      try {
        const stored = localStorage.getItem(SENTIMENT_KEY);
        if (stored) {
          const records: SentimentRecord[] = JSON.parse(stored);
          setSentimentRecords(records);
        }
      } catch (err) {
        console.error('Failed to load sentiment records:', err);
      }
    };
    
    loadSentimentRecords();
  }, []);

  // Check if we should show the prompt and generate contextual question
  useEffect(() => {
    // Only generate question if we have some conversation context
    if (messages.length < 2) return;
    
    // Show prompt if:
    // 1. TEST MODE: PROMPT_INTERVAL = 0 means always show (bypass week check)
    // 2. Production: User hasn't responded this week
    const currentWeek = getWeekNumber(new Date());
    const hasRespondedThisWeek = sentimentRecords.some(
      (record) => record.weekNumber === currentWeek
    );

    // In test mode (PROMPT_INTERVAL = 0), ignore week check
    const shouldShow = PROMPT_INTERVAL === 0 
      ? true 
      : !hasRespondedThisWeek;

    if (shouldShow && !isGenerating && !currentQuestion) {
      // Generate contextual question based on conversation after delay
      const timer = setTimeout(async () => {
        setIsGenerating(true);
        try {
          const contextualQuestion = await generateContextualQuestion(messages);
          setCurrentQuestion(contextualQuestion);
          setShowPrompt(true);
        } catch (err) {
          console.error('Failed to generate contextual question:', err);
        } finally {
          setIsGenerating(false);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [messages, sentimentRecords, isGenerating, currentQuestion]);

  const submitSentiment = async (sentiment: number, emoji: string) => {
    const now = Date.now();
    const currentWeek = getWeekNumber(new Date());

    const newRecord: SentimentRecord = {
      timestamp: now,
      sentiment,
      emoji,
      weekNumber: currentWeek,
      questionId: 'contextual-' + now,
      questionText: currentQuestion?.question || 'How are you feeling?',
      category: 'contextual',
    };

    const updatedRecords = [...sentimentRecords, newRecord];
    setSentimentRecords(updatedRecords);
    
    // Save to localStorage
    try {
      localStorage.setItem(SENTIMENT_KEY, JSON.stringify(updatedRecords));
    } catch (err) {
      console.error('Failed to save sentiment to localStorage:', err);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  const getSentimentTrend = (): number[] => {
    // Return last 4 weeks of sentiment data for trend analysis
    return sentimentRecords.slice(-4).map((record) => record.sentiment);
  };

  const getAverageSentiment = (): number => {
    if (sentimentRecords.length === 0) return 0;
    const sum = sentimentRecords.reduce((acc, record) => acc + record.sentiment, 0);
    return sum / sentimentRecords.length;
  };

  return {
    showPrompt,
    currentQuestion,
    submitSentiment,
    dismissPrompt,
    sentimentRecords,
    getSentimentTrend,
    getAverageSentiment,
  };
};


