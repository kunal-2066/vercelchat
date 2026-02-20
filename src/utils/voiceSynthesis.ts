/**
 * Voice synthesis utility for emotional sanctuary experience
 * Uses Web Speech API for natural, calming voice output
 */

export class VoiceSynthesis {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isEnabled: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();

    // Handle voice list changes (some browsers load voices asynchronously)
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  /**
   * Load available voices and auto-select recommended one
   */
  private loadVoices() {
    this.voices = this.synth.getVoices();

    // Auto-select recommended voice (English Female for warm, empathetic tone)
    if (!this.selectedVoice && this.voices.length > 0) {
      this.selectedVoice = this.findRecommendedVoice();
    }
  }

  /**
   * Find the best voice for emotional support (prefer natural English Female)
   */
  private findRecommendedVoice(): SpeechSynthesisVoice {
    // Priority list of most natural-sounding voices
    const preferredVoices = [
      'Google UK English Female',
      'Google US English Female',
      'Microsoft Zira Desktop',
      'Samantha',
      'Victoria', 
      'Karen',
      'Moira',
      'Fiona'
    ];
    
    // Try preferred voices first
    for (const voiceName of preferredVoices) {
      const voice = this.voices.find(v => v.name === voiceName);
      if (voice) {
        // console.log('🎤 Selected voice:', voiceName);
        return voice;
      }
    }
    
    // Try to find any English female voice
    const englishFemale = this.voices.find(
      (voice) =>
        voice.lang.startsWith('en') &&
        (voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('samantha'))
    );

    if (englishFemale) {
      // console.log('🎤 Selected voice:', englishFemale.name);
      return englishFemale;
    }

    // Fallback to any English voice
    const englishVoice = this.voices.find((voice) =>
      voice.lang.startsWith('en')
    );

    if (englishVoice) {
      console.log('🎤 Selected voice:', englishVoice.name);
      return englishVoice;
    }

    // Last resort: first available voice
    console.log('🎤 Selected voice:', this.voices[0]?.name || 'default');
    return this.voices[0];
  }

  /**
   * Speak text with calm emotional settings
   */
  speak(text: string) {
    if (!this.isEnabled || !text.trim()) return;

    // Cancel any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set selected voice
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // Calm emotional settings for sanctuary experience
    utterance.rate = 0.9; // Slower = soothing, present
    utterance.pitch = 1.0; // Neutral, warm, not robotic
    utterance.volume = 0.85; // Softer voice for intimate feel

    // Track current utterance
    this.currentUtterance = utterance;

    // Clear reference when done
    utterance.onend = () => {
      this.currentUtterance = null;
    };

    // Handle errors gracefully
    utterance.onerror = (event) => {
      console.warn('Speech synthesis error:', event);
      this.currentUtterance = null;
    };

    // Speak
    this.synth.speak(utterance);
  }

  /**
   * Stop current speech
   */
  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Pause current speech
   */
  pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Enable voice synthesis
   */
  enable() {
    this.isEnabled = true;
  }

  /**
   * Disable voice synthesis
   */
  disable() {
    this.isEnabled = false;
    this.stop();
  }

  /**
   * Toggle voice synthesis on/off
   */
  toggle(): boolean {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.stop();
    }
    return this.isEnabled;
  }

  /**
   * Check if voice is currently enabled
   */
  getIsEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  /**
   * Get all available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  /**
   * Get current selected voice
   */
  getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice;
  }

  /**
   * Set voice by name
   */
  setVoiceByName(name: string) {
    const voice = this.voices.find((v) => v.name === name);
    if (voice) {
      this.selectedVoice = voice;
    }
  }

  /**
   * Get recommended voice name for display
   */
  getRecommendedVoiceName(): string {
    const voice = this.selectedVoice || this.findRecommendedVoice();
    return voice ? `${voice.name} (${voice.lang})` : 'Default';
  }
}
