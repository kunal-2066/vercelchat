# Voice Synthesis Feature

## Overview
The Mindpex chatbot now includes a calming voice synthesis feature using the Web Speech API. This creates a more immersive emotional sanctuary experience by speaking AI responses in a warm, soothing voice.

## Features

### 🎙️ Voice Synthesis
- **Automatic Voice Selection**: Preferentially selects English female voices for warm, empathetic tone
- **Calm Speech Settings**:
  - Rate: 0.9 (slightly slower for soothing effect)
  - Pitch: 1.0 (neutral, warm, not robotic)
  - Volume: 0.85 (softer for intimate sanctuary feel)

### 🎚️ Controls
- **Voice Toggle Button**: Located in top-left corner next to ambient sound toggle
- **Visual Indicators**:
  - 🟠 Amber icon when voice is enabled
  - ⚫ Gray icon when voice is disabled
- **Automatic Stop**: Voice stops when disabled or when new message begins

### 🔊 Recommended Voices
The system automatically selects the best available voice based on:
1. English female voices (preferred for warmth)
2. Voices with names containing: "Female", "Woman", "Zira", "Samantha"
3. Fallback to any English voice
4. Last resort: first available system voice

## Usage

### For Users
1. Click the voice icon (🔊) in the top-left corner to enable voice output
2. AI responses will be spoken automatically after they finish streaming
3. Click the icon again to disable voice output
4. Voice stops automatically when you disable it or send a new message

### For Developers

#### Voice Synthesis Utility
```typescript
import { VoiceSynthesis } from '../utils/voiceSynthesis';

const voice = new VoiceSynthesis();

// Enable voice
voice.enable();

// Speak text with calm emotional settings
voice.speak("Your message here");

// Stop current speech
voice.stop();

// Toggle on/off
const isEnabled = voice.toggle();
```

#### Integration with useChat Hook
```typescript
const {
  isVoiceEnabled,
  toggleVoice,
  stopVoice,
} = useChat();

// Toggle voice synthesis
const handleToggleVoice = () => {
  toggleVoice();
};

// Stop any ongoing speech
const handleStopVoice = () => {
  stopVoice();
};
```

## Browser Compatibility
The Web Speech API is supported in:
- ✅ Chrome/Edge (full support)
- ✅ Safari (full support)
- ⚠️ Firefox (limited voice selection)
- ❌ IE (not supported)

## Voice Configuration

### Default Settings (Emotional Sanctuary)
```typescript
utterance.rate = 0.9;    // Slower = soothing, present
utterance.pitch = 1.0;   // Neutral, warm, not robotic
utterance.volume = 0.85; // Softer voice for intimate feel
```

### Customization
You can adjust these settings in `src/utils/voiceSynthesis.ts`:
- **Rate**: 0.1 (slowest) to 10 (fastest) - default 0.9
- **Pitch**: 0 (lowest) to 2 (highest) - default 1.0
- **Volume**: 0 (silent) to 1 (full) - default 0.85

## Design Philosophy
The voice feature is designed to enhance the emotional sanctuary experience:
- **Calm and Present**: Slower speech rate creates presence
- **Warm and Natural**: Neutral pitch avoids robotic feel
- **Intimate and Soft**: Lower volume creates safe space
- **Female Preference**: Research shows female voices are perceived as more empathetic

## Accessibility
- Screen reader friendly with proper ARIA labels
- Keyboard accessible toggle button
- Visual state indicators (color changes)
- Graceful fallback if browser doesn't support speech

## Privacy
- All speech synthesis happens locally in the browser
- No audio data is sent to external servers
- Uses built-in Windows/system voices only

## Troubleshooting

### Voice Not Working
1. Check browser compatibility
2. Ensure system has TTS voices installed
3. Check browser permissions (some browsers may require user interaction first)
4. Try refreshing the page

### Voice Sounds Robotic
- The speech quality depends on your system's installed voices
- Windows users: Install Microsoft voices from Settings > Time & Language > Speech
- Mac users: Install voices from System Preferences > Accessibility > Speech

### Voice Cuts Off
- This is normal - voice stops when new message begins
- Click voice toggle to restart if needed

## Future Enhancements
- [ ] Voice selection dropdown for user preference
- [ ] Adjustable speed/pitch controls
- [ ] Voice memory (remember user's voice preference)
- [ ] Highlight text as it's being spoken
- [ ] Pause/resume controls
