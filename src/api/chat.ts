import axios from "axios";
import { Message } from "../utils/types";

const API_URL = import.meta.env.VITE_BACKEND_URL;

interface ChatResponse {
  reply?: string;
  response?: string;
  answer?: string;
}

export async function streamChatResponse(messages: Message[]) {
  const username = localStorage.getItem("mindpex_username");

  if (!username) {
    throw new Error("No username found. Please sign in again.");
  }

  const lastMessage = messages[messages.length - 1];

  try {
    const response = await axios.post(
      `${API_URL}/chat`,
      {
        anon_userid: username,           // ✅ REQUIRED
        text: lastMessage.content        // ✅ REQUIRED
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    return {
      textStream: data.reply || data.response || data.answer || ""
    };

  } catch (err: any) {
    const message =
      err?.response?.data?.detail ||
      err?.message ||
      "ML API failed";

    throw new Error(message);
  }
}
