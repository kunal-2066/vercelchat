// import {
//   ChatMessage,
//   ChatAPIResponse,
//   ChatHistoryResponse,
//   AnalyticsResponse,
//   RevealEmailResponse,
// } from "@/src/types/database.types";

// /**
//  * Client-side utility for chat API calls
//  */
// class ChatAPIClient {
//   private baseUrl = "/api/chat";

//   /**
//    * Send a chat message
//    */
//   async sendMessage(message: ChatMessage): Promise<ChatAPIResponse> {
//     const response = await fetch(`${this.baseUrl}/send`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(message),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || "Failed to send message");
//     }

//     return response.json();
//   }

//   /**
//    * Get chat history (HR/Admin only)
//    */
//   async getChatHistory(
//     anon_id?: string,
//     limit: number = 50,
//     offset: number = 0
//   ): Promise<ChatHistoryResponse> {
//     const params = new URLSearchParams({
//       limit: limit.toString(),
//       offset: offset.toString(),
//     });

//     if (anon_id) {
//       params.append("anon_id", anon_id);
//     }

//     const response = await fetch(`${this.baseUrl}/history?${params}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || "Failed to fetch chat history");
//     }

//     return response.json();
//   }

//   /**
//    * Get emotion analytics (HR/Admin only)
//    */
//   async getAnalytics(
//     period: "7d" | "30d" | "90d" = "7d"
//   ): Promise<AnalyticsResponse> {
//     const response = await fetch(`${this.baseUrl}/analytics?period=${period}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || "Failed to fetch analytics");
//     }

//     return response.json();
//   }

//   /**
//    * Reveal email from anonymous ID (HR/Admin only)
//    */
//   async revealEmail(anon_id: string): Promise<RevealEmailResponse> {
//     const response = await fetch(
//       `${this.baseUrl}/reveal-email?anon_id=${anon_id}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || "Failed to reveal email");
//     }

//     return response.json();
//   }
// }

// export const chatAPI = new ChatAPIClient();
