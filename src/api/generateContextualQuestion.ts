import { Message } from '../utils/types';

/**
 * Generate a contextual sentiment question based on the conversation
 * TODO: Replace with your own AI model integration
 */
export async function generateContextualQuestion(messages: Message[]): Promise<{
  question: string;
  options: { emoji: string; label: string; value: number }[];
}> {
  try {
    // Analyze recent messages for context
    const recentMessages = messages.slice(-6);
    const lastUserMessage = recentMessages.filter(m => m.role === 'user').pop()?.content.toLowerCase() || '';
    
    // Generate contextual question based on keywords
    let question = "How are you feeling right now?";
    let options = getDefaultOptions();
    
    if (lastUserMessage.includes('stress') || lastUserMessage.includes('anxious')) {
      question = "How would you describe your stress level right now?";
      options = [
        { emoji: "😌", label: "Very calm", value: 5 },
        { emoji: "🙂", label: "Manageable", value: 4 },
        { emoji: "😐", label: "Moderate", value: 3 },
        { emoji: "😰", label: "High stress", value: 2 },
        { emoji: "😫", label: "Overwhelmed", value: 1 }
      ];
    } else if (lastUserMessage.includes('tired') || lastUserMessage.includes('energy')) {
      question = "How's your energy level today?";
      options = [
        { emoji: "⚡", label: "Energized", value: 5 },
        { emoji: "😊", label: "Good energy", value: 4 },
        { emoji: "😐", label: "Okay", value: 3 },
        { emoji: "😴", label: "Low energy", value: 2 },
        { emoji: "😫", label: "Exhausted", value: 1 }
      ];
    } else if (lastUserMessage.includes('work') || lastUserMessage.includes('job')) {
      question = "How do you feel about work right now?";
      options = [
        { emoji: "🎉", label: "Really positive", value: 5 },
        { emoji: "😊", label: "Pretty good", value: 4 },
        { emoji: "😐", label: "Neutral", value: 3 },
        { emoji: "😟", label: "Challenging", value: 2 },
        { emoji: "😞", label: "Struggling", value: 1 }
      ];
    }

    return { question, options };

  } catch (err: any) {
    console.error('❌ Error generating contextual question:', err);
    
    // Fallback to generic question
    return {
      question: "How are you feeling right now?",
      options: getDefaultOptions()
    };
  }
}

/**
 * Get default sentiment options
 */
function getDefaultOptions() {
  return [
    { emoji: "😊", label: "Really good", value: 5 },
    { emoji: "🙂", label: "Pretty good", value: 4 },
    { emoji: "😐", label: "Okay", value: 3 },
    { emoji: "😟", label: "Not great", value: 2 },
    { emoji: "😞", label: "Struggling", value: 1 }
  ];
}
