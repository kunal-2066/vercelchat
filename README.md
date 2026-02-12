# Mindpex Emotional Companion Chatbot

An AI-powered emotional companion for employees, built with React, TypeScript, and Claude 3 Haiku. This chatbot creates a sanctuary where employees feel seen, heard, and emotionally held.

## Features

- **Empathetic AI Conversations**: Powered by Claude 3 Haiku with a comprehensive empathy system prompt
- **Streaming Responses**: Real-time word-by-word text streaming for engaging interactions
- **Mindpex UI Theme**: Dark theme with golden accents, pulse animations, and sanctuary-like aesthetics
- **Message Persistence**: Conversations automatically saved to localStorage
- **Export Functionality**: Download conversation transcripts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Emotional Mode Detection**: AI detects whether user needs emotional presence vs. solutions

## Core Empathy Principles

The chatbot implements the **5 Pillars of Empathy**:
1. **Mirroring**: Reflects emotional state back to the user
2. **Validation**: Affirms feelings are real and legitimate
3. **Containment**: Holds space for pain without immediate fixing
4. **Guided Clarity**: Helps see patterns after safety is built
5. **Empowerment**: Helps discover own strength

## Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env.local
```

3. **Add your Anthropic API key** to `.env.local`:
```
VITE_ANTHROPIC_API_KEY=your_actual_api_key_here
```

Get your API key from [Anthropic Console](https://console.anthropic.com/settings/keys)

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

Build the application:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── api/
│   └── chat.ts              # AI SDK streaming integration
├── components/
│   ├── ChatBot.tsx          # Main chatbot component
│   ├── ChatInput.tsx        # Input field with golden styling
│   ├── Header.tsx           # Mindpex branded header
│   ├── MessageBubble.tsx    # Message display with animations
│   ├── StreamingText.tsx    # Real-time streaming text display
│   └── TypingIndicator.tsx  # Loading state indicator
├── hooks/
│   ├── useChat.ts           # Chat state management
│   └── useLocalStorage.ts   # localStorage persistence
├── styles/
│   └── animations.css       # Custom Mindpex animations
├── utils/
│   ├── empathyPrompt.ts     # System prompt configuration
│   ├── storage.ts           # localStorage utilities
│   └── types.ts             # TypeScript interfaces
├── App.tsx
├── main.tsx
└── index.css
```

## Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling with custom Mindpex theme
- **AI SDK** - Streaming responses from Anthropic
- **Claude 3 Haiku** - Fast, empathetic AI model

## Mindpex Design System

### Color Palette
- **Primary Golden**: `#B58342` to `#d4a05a` (gradient)
- **Background**: Black to dark gray (`#000000`, `#1a1a1a`, `#2a2a2a`)
- **Text**: White for headings, slate-300/400 for body
- **Accent**: Golden glow effects with pulse animations

### Key Features
- Sanctuary-like calming aesthetic
- Subtle pulse animations on interactive elements
- Smooth fade-in for messages
- Golden gradient accents throughout
- Custom scrollbar with golden theme

## Usage

1. **Start a conversation**: Type your thoughts in the input field
2. **Watch streaming responses**: AI responds in real-time with empathetic guidance
3. **Clear chat**: Use the "Clear Chat" button to start fresh
4. **Export conversation**: Download your conversation as a text file

## Future Enhancements

- HR Dashboard integration for burnout signals
- Analytics backend for organizational insights
- User authentication for tracking individual journeys
- Voice input/output for hands-free support
- Conversation themes and mood tracking
- Manager blindspot detection across teams

## Security Note

⚠️ **Development Setup**: This implementation stores the API key in environment variables accessible to the frontend. For production use, implement a backend proxy to secure API keys.

## Support

For issues or questions, please contact the Mindpex team.

---

**Mindpex Intelligence Systems** © 2025
