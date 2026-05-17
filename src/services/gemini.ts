import type { Message } from '../types/chat';

// ─── Main API call ───────────────────────────────────────

export async function sendToGemini(
  userMessage: string,
  chatHistory: Message[],
  attachments?: import('../types/chat').Attachment[]
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: userMessage,
      history: chatHistory,
      attachments,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.text) {
    throw new Error('Empty response from backend');
  }

  return data.text;
}

// ─── Error formatting ────────────────────────────────────

export function formatGeminiError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    if (msg.includes('api key') || msg.includes('not configured')) {
      return "Hmm, I can't connect right now — my API key might not be set up. Please check the `.env` file. 🔧";
    }
    if (msg.includes('quota') || msg.includes('rate') || msg.includes('429')) {
      return "I'm getting a lot of questions right now! 😅 Please wait a moment and try again.";
    }
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed')) {
      return "Looks like there's a network issue. Check your internet connection or make sure the backend is running. 🌐";
    }
    if (msg.includes('blocked') || msg.includes('safety')) {
      return "I wasn't able to respond to that one — it may have triggered a safety filter. Try rephrasing your question! 🛡️";
    }

    return `Oops, something went wrong: ${error.message} 😔`;
  }

  return "Something unexpected happened. Please try again! 🍓";
}
