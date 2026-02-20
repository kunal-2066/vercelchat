import React, { useState } from 'react';

interface VoiceSettingsProps {
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  onRateChange: (rate: number) => void;
  onPitchChange: (pitch: number) => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({ 
  onVoiceChange, 
  onRateChange, 
  onPitchChange 
}) => {
  const [voices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1.0);
  const [isOpen, setIsOpen] = useState(false);

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      onVoiceChange(voice);
    }
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    onRateChange(newRate);
  };

  const handlePitchChange = (newPitch: number) => {
    setPitch(newPitch);
    onPitchChange(newPitch);
  };

  const testVoice = () => {};

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-6 z-50 p-3 rounded-full bg-mindpex-dark-warm/80 border border-amber/30 hover:bg-amber/20 transition-all backdrop-blur-md"
        title="Voice Settings"
      >
        <svg className="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"/>
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 left-6 z-50 w-80 backdrop-blur-xl bg-mindpex-dark-warm/90 border border-amber/30 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-amber font-medium">Voice Settings</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-amber transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
      </div>

      {/* Voice Selection */}
      <div className="mb-4">
        <label className="block text-slate-300 text-sm mb-2">Voice</label>
        <select
          value={selectedVoice}
          onChange={(e) => handleVoiceChange(e.target.value)}
          className="w-full bg-mindpex-dark/50 border border-amber/20 rounded-lg px-3 py-2 text-slate-200 focus:border-amber focus:outline-none"
        >
          <option value="">Auto (Recommended)</option>
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      {/* Speed */}
      <div className="mb-4">
        <label className="block text-slate-300 text-sm mb-2">
          Speed: {rate.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={rate}
          onChange={(e) => handleRateChange(parseFloat(e.target.value))}
          className="w-full accent-amber"
        />
      </div>

      {/* Pitch */}
      <div className="mb-4">
        <label className="block text-slate-300 text-sm mb-2">
          Pitch: {pitch.toFixed(1)}
        </label>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={pitch}
          onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
          className="w-full accent-amber"
        />
      </div>

      {/* Test Button */}
      <button
        onClick={testVoice}
        disabled
        className="w-full bg-amber/20 hover:bg-amber/30 text-amber border border-amber/30 rounded-lg py-2 transition-all"
      >
        Voice Output Disabled
      </button>
    </div>
  );
};
