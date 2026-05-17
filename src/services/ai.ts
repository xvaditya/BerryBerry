import type { Attachment, Message } from '../types/chat';

export async function sendToAI(
  userMessage: string,
  chatHistory: Message[],
  attachments?: Attachment[]
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: userMessage,
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

export function formatAIError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    if (msg.includes('token') || msg.includes('api key') || msg.includes('not configured')) {
      return "I can't connect to the AI backend right now. Restart the server after updating `.env`, or set `HF_TOKEN` in Vercel.";
    }
    if (msg.includes('quota') || msg.includes('rate') || msg.includes('429')) {
      return "I'm getting a lot of questions right now. Please wait a moment and try again.";
    }
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed')) {
      return 'Looks like there is a network issue. Check your internet connection or make sure the backend is running.';
    }
    if (msg.includes('blocked') || msg.includes('safety')) {
      return "I wasn't able to respond to that one. Try rephrasing your question.";
    }

    return `Oops, something went wrong: ${error.message}`;
  }

  return 'Something unexpected happened. Please try again.';
}
