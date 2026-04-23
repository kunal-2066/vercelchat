import React, { useState, useEffect } from 'react';

interface MoodChipsProps {
    onSelect: (mood: string) => void;
    showGuidedLine?: boolean;
}

const chipPool = [
    "That meeting felt tense",
    "I'm replaying a conversation",
    "Something about that felt unfair",
    "I wish I handled that differently",
    "I'm unsure how to respond",
    "Hard to tell",
    "Feeling a bit off",
    "I'm second guessing my response",
    "I want to prepare for a reply",
    "Just need to clear my head",
    "Stressed",
    "Frustrated",
    "Confused",
    "Thinking it through",
    "All good"
];

export const MoodChips: React.FC<MoodChipsProps> = ({ onSelect, showGuidedLine = true }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [randomChips, setRandomChips] = useState<string[]>([]);

    useEffect(() => {
        // Randomly pick 5 chips
        const shuffled = [...chipPool].sort(() => 0.5 - Math.random());
        setRandomChips(shuffled.slice(0, 5));

        // Slight delay for entrance animation
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-8 md:py-12 px-4 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-xl md:text-2xl font-medium text-white mb-6 md:mb-12 text-center animate-fade-in-up px-4">
                What situation is on your mind right now?
            </h2>

            <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full items-center">
                {randomChips.map((mood, index) => (
                    <MoodButton
                        key={mood}
                        mood={mood}
                        index={index}
                        onSelect={onSelect}
                    />
                ))}
            </div>
            <div className={`overflow-hidden transition-all text-center
                ${showGuidedLine 
                    ? 'duration-300 ease-out max-h-[50px] opacity-100 translate-y-0 mt-[18px] mb-[10px]' 
                    : 'duration-200 ease-in-out max-h-0 opacity-0 translate-y-2 mt-0 mb-0'}`}
            >
                <p className="text-[13px] text-white/55">
                    Take a moment — let's sort through what happened.
                </p>
            </div>
        </div>
    );
};

const MoodButton = ({ mood, index, onSelect }: { mood: string, index: number, onSelect: (m: string) => void }) => (
    <button
        onClick={() => onSelect(mood)}
        className={`
            px-4 py-2.5 md:px-6 md:py-3 rounded-full 
            text-sm md:text-base
            border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm
            text-slate-300 hover:text-white
            hover:bg-slate-700/50 hover:border-amber/30
            transition-all duration-150 ease-out
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
);
