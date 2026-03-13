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
  private isManualStop: boolean = false;
  private readonly isMobile: boolean;
  private readonly isSecureContext: boolean;
  private onResultCallback: ((text: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private finalTranscript: string = '';

  constructor() {
    this.isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    this.isSecureContext = window.isSecureContext;

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
   * Setup speech recognition with optimal settings for continuous recording
   */
  private setupRecognition() {
    if (!this.recognition) return;

    // Enable continuous recording regardless of device
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    // Handle results
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
    };

    // Handle end
    this.recognition.onend = () => {
      this.isManualStop = false;
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
      } else if (event.error === 'service-not-allowed') {
        errorMessage = 'Speech service is blocked on this browser/device.';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'No microphone detected. Check your device microphone settings.';
      } else if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please try again.';
      } else if (event.error === 'aborted') {
        errorMessage = 'Voice recording stopped. Please tap the mic again.';
      }

      if (this.onErrorCallback) {
        this.onErrorCallback(errorMessage);
      }
    };
  }

  /**
   * Start listening for voice input
   */
  async start(
    onResult: (text: string) => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<boolean> {
    if (!this.recognition) {
      if (onError) {
        onError('Speech recognition not supported');
      }
      return false;
    }

    if (!this.isSecureContext) {
      if (onError) {
        onError('Microphone access requires a secure connection (HTTPS).');
      }
      return false;
    }

    this.onResultCallback = onResult;
    this.onEndCallback = onEnd || null;
    this.onErrorCallback = onError || null;
    this.finalTranscript = '';
    this.isManualStop = false;

    try {
      // Warm up mic permission on mobile before starting recognition.
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }

      this.recognition.start();
      this.isListening = true;

      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (onError) {
        onError('Failed to start recording');
      }
      this.isListening = false;
      return false;
    }
  }

  /**
   * Stop listening
   */
  stop() {
    if (this.recognition && this.isListening) {
      this.isManualStop = true;
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
