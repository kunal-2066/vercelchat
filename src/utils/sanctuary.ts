/**
 * Sanctuary experience utilities for emotional ambience
 * Handles day/night modes, ambient soundscape, and timing
 */

export type TimeMode = 'morning' | 'day' | 'evening' | 'night';

/**
 * Get current time mode for emotional color adaptation
 */
export function getTimeMode(): TimeMode {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

/**
 * Get sanctuary background classes based on time
 */
export function getSanctuaryBackground(): string {
  const mode = getTimeMode();
  
  switch (mode) {
    case 'morning':
      return 'bg-sanctuary-day';
    case 'day':
      return 'bg-sanctuary-day';
    case 'evening':
      return 'bg-sanctuary-night';
    case 'night':
      return 'bg-sanctuary-night';
    default:
      return 'bg-sanctuary';
  }
}

/**
 * Ambient soundscape manager
 */
export class AmbientSound {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  /**
   * Start playing subtle ambient hum
   */
  start() {
    if (this.isPlaying) return;

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator for low-frequency hum
      this.oscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();
      
      // Set frequency to warm, calming low tone (around 60-80Hz)
      this.oscillator.frequency.value = 70;
      this.oscillator.type = 'sine';
      
      // Very subtle volume
      this.gainNode.gain.value = 0.015;
      
      // Connect nodes
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      
      // Start playing
      this.oscillator.start();
      this.isPlaying = true;
      
      // Add gentle modulation for organic feel
      this.addModulation();
    } catch (error) {
      console.warn('Ambient sound not available:', error);
    }
  }

  /**
   * Add subtle frequency modulation for organic warmth
   */
  private addModulation() {
    if (!this.audioContext || !this.oscillator) return;

    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    
    lfo.frequency.value = 0.5; // Very slow modulation
    lfoGain.gain.value = 2; // Subtle frequency variation
    
    lfo.connect(lfoGain);
    lfoGain.connect(this.oscillator.frequency);
    lfo.start();
  }

  /**
   * Stop playing ambient hum
   */
  stop() {
    if (!this.isPlaying) return;

    try {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
      }
      if (this.audioContext) {
        this.audioContext.close();
      }
      
      this.isPlaying = false;
      this.oscillator = null;
      this.gainNode = null;
      this.audioContext = null;
    } catch (error) {
      console.warn('Error stopping ambient sound:', error);
    }
  }

  /**
   * Check if ambient sound is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Toggle ambient sound on/off
   */
  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }
}

/**
 * Get random micro-delay for wabi-sabi imperfection (50-150ms)
 */
export function getOrganicDelay(): number {
  return Math.floor(Math.random() * 100) + 50;
}

/**
 * Get random slight offset for message alignment (-2 to 2px)
 */
export function getOrganicOffset(): number {
  return Math.floor(Math.random() * 5) - 2;
}
