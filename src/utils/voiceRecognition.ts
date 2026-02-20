/**
 * Voice recognition utility for speech-to-text input
 * Uses Web Speech API for voice assistant functionality
 */

// Web Speech API types
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export class VoiceRecognition {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onAutoStopCallback: ((finalText: string) => void) | null = null;
  private silenceTimer: ReturnType<typeof setTimeout> | null = null;
  private finalTranscript: string = '';
  private SILENCE_THRESHOLD: number = 2000; // 2 seconds of silence triggers auto-stop

  constructor() {
    // Check if browser supports speech recognition
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      this.recognition = new SpeechRecognitionAPI();
      this.setupRecognition();
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  /**
   * Setup speech recognition with optimal settings and auto-stop
   */
  private setupRecognition() {
    if (!this.recognition) return;

    // Continuous listening with auto-stop on silence
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    // Handle results with silence detection
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Send result to callback
      if (this.onResultCallback) {
        this.onResultCallback(this.finalTranscript || interimTranscript);
      }

      // Reset silence timer - restart auto-stop countdown
      this.resetSilenceTimer();
    };

    // Handle end
    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };

    // Handle errors
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      // Provide user-friendly error messages
      let errorMessage = event.error;
      if (event.error === 'network') {
        errorMessage = 'Network error. Speech recognition requires an internet connection.';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'Microphone permission denied. Please allow microphone access.';
      } else if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please try again.';
      }
      
      if (this.onErrorCallback) {
        this.onErrorCallback(errorMessage);
      }
    };
  }

  /**
   * Reset silence detection timer
   */
  private resetSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }

    // Start new timer - auto-stop after silence threshold
    this.silenceTimer = setTimeout(() => {
      if (this.isListening && this.finalTranscript.trim()) {
        // User stopped speaking - auto-stop and send
        this.stopWithAutoSend();
      }
    }, this.SILENCE_THRESHOLD);
  }

  /**
   * Stop and trigger auto-send callback
   */
  private stopWithAutoSend() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    const textToSend = this.finalTranscript.trim();
    this.stop();

    // Trigger auto-stop callback with final text
    if (this.onAutoStopCallback && textToSend) {
      this.onAutoStopCallback(textToSend);
    }
  }

  /**
   * Start listening for voice input with auto-stop
   */
  start(
    onResult: (text: string) => void,
    onEnd?: () => void,
    onError?: (error: string) => void,
    onAutoStop?: (finalText: string) => void
  ) {
    if (!this.recognition) {
      if (onError) {
        onError('Speech recognition not supported');
      }
      return;
    }

    this.onResultCallback = onResult;
    this.onEndCallback = onEnd || null;
    this.onErrorCallback = onError || null;
    this.onAutoStopCallback = onAutoStop || null;
    this.finalTranscript = '';

    try {
      this.recognition.start();
      this.isListening = true;
      
      // Start silence detection timer
      this.resetSilenceTimer();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (onError) {
        onError('Failed to start recording');
      }
    }
  }

  /**
   * Stop listening
   */
  stop() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
    
    this.finalTranscript = '';
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Check if speech recognition is supported
   */
  isSupported(): boolean {
    return this.recognition !== null;
  }
}
