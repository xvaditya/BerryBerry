import { askHF } from '../lib/hf.js';

async function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') return JSON.parse(req.body);
  return req.body;
}

function buildPrompt(message, history = [], attachments = []) {
  const recentHistory = history
    .slice(-8)
    .map((msg) => `${msg.role === 'assistant' ? 'Assistant' : 'User'}: ${msg.content}`)
    .join('\n');

  const attachmentNote = attachments.length
    ? '\n\nNote: The user attached files, but this text model cannot inspect attachments directly.'
    : '';

  return [
    'You are BerryBerry, a cute, friendly, intelligent AI English learning companion.',
    'Help users learn English, correct grammar, explain concepts simply, and chat naturally.',
    'Keep responses concise, warm, supportive, and conversational.',
    recentHistory ? `\nConversation so far:\n${recentHistory}` : '',
    `\nUser: ${message}`,
    attachmentNote,
  ].join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, prompt, history = [], attachments = [] } = await parseBody(req);
    const userMessage = message || prompt;

    if (!userMessage) {
      return res.status(400).json({ error: 'Missing message' });
    }

    const reply = await askHF(buildPrompt(userMessage, history, attachments));
    return res.status(200).json({ text: reply, reply });
  } catch (error) {
    console.error('Error calling Hugging Face:', error);
    return res.status(500).json({ error: error.message || 'AI error' });
  }
}
