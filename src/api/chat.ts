import axios from 'axios';
import { Message } from '../utils/types';

const ENV_BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.trim();
const DEFAULT_ML_URL = 'https://mlmodelmp.onrender.com/chat';

function toChatEndpoint(base: string): string {
  return base.endsWith('/chat') ? base : `${base}/chat`;
}

function getChatEndpoints(): string[] {
  const endpoints = [toChatEndpoint(DEFAULT_ML_URL)];
  if (ENV_BACKEND_URL) {
    const envEndpoint = toChatEndpoint(ENV_BACKEND_URL);
    if (!endpoints.includes(envEndpoint)) endpoints.push(envEndpoint);
  }
  return endpoints;
}

interface ChatResponse {
  reply?: string;
  response?: string;
  answer?: string;
  message?: string;
  text?: string;
  emotion?: string;
  turn?: number;
  session_id?: string;
  source?: string;
}

export async function streamChatResponse(messages: Message[]) {
  const username = localStorage.getItem('mindpex_username');

  if (!username) {
    throw new Error('No username found. Please sign in again.');
  }

  const lastMessage = messages[messages.length - 1];

  let response;
  let lastError: any;
  const endpoints = getChatEndpoints();

  for (const endpoint of endpoints) {
    try {
      response = await axios.post<ChatResponse>(
        endpoint,
        {
          anon_userid: username,
          text: lastMessage.content,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      break;
    } catch (err: any) {
      lastError = err;
    }
  }

  if (!response) {
    const message =
      lastError?.response?.data?.error ||
      lastError?.response?.data?.detail ||
      lastError?.message ||
      'Failed to send chat message';
    throw new Error(message);
  }

  const data = response.data;
  const replyText =
    data.reply ||
    data.response ||
    data.answer ||
    data.message ||
    data.text ||
    '';

  return {
    textStream: replyText,
    emotion: data.emotion,
    turn: data.turn,
  };
}



