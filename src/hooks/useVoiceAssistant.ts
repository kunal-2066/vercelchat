/**
 * Voice Assistant Mode Hook
 * Combines speech recognition (STT) and speech synthesis (TTS)
 * for full voice conversation experience
 */

import { useState, useRef, useCallback } from 'react';
import { VoiceRecognition } from '../utils/voiceRecognition';
import { VoiceSynthesis } from '../utils/voiceSynthesis';

export function useVoiceAssistant() {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const voiceRecognition = useRef(new VoiceRecognition());
  const voiceSynthesis = useRef(new VoiceSynthesis());

  /**
   * Toggle voice assistant mode on/off
   */
  const toggleVoiceMode = useCallback(() => {
    const newMode = !isVoiceMode;
    setIsVoiceMode(newMode);
    
    if (!newMode) {
      // Turning off - stop everything
      stopListening();
      stopSpeaking();
    }
    
    return newMode;
  }, [isVoiceMode]);

  /**
   * Start listening for voice input with auto-stop
   */
  const startListening = useCallback((onAutoSend?: (text: string) => void) => {
    if (!voiceRecognition.current.isSupported()) {
      setError('Voice input not supported in this browser');
      return;
    }

    setError(null);
    setTranscript('');

    voiceRecognition.current.start(
      (text) => {
        setTranscript(text);
      },
      () => {
        setIsListening(false);
      },
      (errorMsg) => {
        setError(errorMsg);
        setIsListening(false);
      },
      (finalText) => {
        // Auto-stop triggered by silence detection
        setIsListening(false);
        if (onAutoSend && finalText.trim()) {
          onAutoSend(finalText);
        }
      }
    );

    setIsListening(true);
  }, []);

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    voiceRecognition.current.stop();
    setIsListening(false);
  }, []);

  /**
   * Speak text response
   */
  const speak = useCallback((text: string) => {
    setIsSpeaking(true);
    voiceSynthesis.current.enable();
    voiceSynthesis.current.speak(text);
    
    // Monitor speaking status
    const checkSpeaking = setInterval(() => {
      if (!voiceSynthesis.current.isSpeaking()) {
        setIsSpeaking(false);
        clearInterval(checkSpeaking);
      }
    }, 100);
  }, []);

  /**
   * Stop speaking
   */
  const stopSpeaking = useCallback(() => {
    voiceSynthesis.current.stop();
    setIsSpeaking(false);
  }, []);

  /**
   * Get final transcript and clear
   */
  const getFinalTranscript = useCallback(() => {
    const final = transcript.trim();
    setTranscript('');
    return final;
  }, [transcript]);

  return {
    isVoiceMode,
    isListening,
    isSpeaking,
    transcript,
    error,
    toggleVoiceMode,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    getFinalTranscript,
  };
}
