import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { askHF } from './lib/hf.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

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

app.post('/api/chat', async (req, res) => {
  const { message, prompt, history = [], attachments = [] } = req.body;
  const userMessage = message || prompt;

  if (!userMessage) {
    return res.status(400).json({ error: 'Missing message' });
  }

  try {
    const reply = await askHF(buildPrompt(userMessage, history, attachments));
    return res.json({ text: reply, reply });
  } catch (error) {
    console.error('Error calling Hugging Face:', error);
    return res.status(500).json({ error: error.message || 'AI error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
