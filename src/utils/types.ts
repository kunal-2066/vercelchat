// Core message interface
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'welcome'; // Special styling for welcome messages
  versions?: { content: string; timestamp: Date }[];
  currentVersionIndex?: number;
}

// Chat state interface
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  streamingMessage: string;
  error: string | null;
}

// API message format (compatible with AI SDK)
export interface APIMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Error types
export type ErrorType = 'network' | 'rate_limit' | 'invalid_response' | 'timeout' | 'unknown';

export interface ChatError {
  type: ErrorType;
  message: string;
  empathyMessage: string;
}
