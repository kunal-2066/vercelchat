import React, { useState, useEffect } from 'react';

interface MoodChipsProps {
    onSelect: (mood: string) => void;
}

const MOODS = [
    "Stressed",
    "A bit tired",
    "Hard to tell",
    "Fine / steady",
    "Good, actually"
];

export const MoodChips: React.FC<MoodChipsProps> = ({ onSelect }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Slight delay for entrance animation
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-12 px-4 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-2xl font-medium text-white mb-12 text-center animate-fade-in-up">
                How are things feeling right now?
            </h2>

            <div className="flex flex-wrap justify-center gap-4 max-w-lg">
                {MOODS.map((mood, index) => (
                    <button
                        key={mood}
                        onClick={() => onSelect(mood)}
                        className={`
              px-6 py-3 rounded-full 
              border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm
              text-slate-300 hover:text-white
              hover:bg-slate-700/50 hover:border-amber/30
              transition-all duration-300 ease-out
              active:scale-95
              animate-fade-in-up
            `}
                        style={{
                            animationDelay: `${index * 100 + 200}ms`,
                            animationFillMode: 'both'
                        }}
                    >
                        {mood}
                    </button>
                ))}
            </div>
        </div>
    );
};
