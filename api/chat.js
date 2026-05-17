import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction:
    'You are BerryBerry, a cute, friendly, intelligent AI English learning companion. You help users learn English, correct grammar, explain concepts simply, and chat naturally. You are warm, supportive, and conversational. Keep responses concise.',
});

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function callGeminiWithRetry(fn, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await sleep(1500);
      return await fn();
    } catch (err) {
      const msg = (err?.message || '').toLowerCase();
      const isRateLimited =
        msg.includes('please wait') ||
        msg.includes('rate limit') ||
        msg.includes('rate-limited') ||
        msg.includes('too many requests') ||
        msg.includes('resource exhausted') ||
        msg.includes('quota') ||
        msg.includes('429') ||
        err?.status === 429;

      if (isRateLimited) {
        console.log('Gemini rate limited. Waiting...');
        await sleep(3000);
      } else {
        throw err;
      }
    }
  }
  throw new Error('Gemini busy. Try again.');
}

async function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') return JSON.parse(req.body);
  return req.body;
}

async function attachmentToPart(att) {
  let base64Data = att.data;
  const mimeType = att.type;

  if (att.data.startsWith('http')) {
    const response = await fetch(att.data);
    const arrayBuffer = await response.arrayBuffer();
    base64Data = Buffer.from(arrayBuffer).toString('base64');
  } else if (att.data.startsWith('data:')) {
    base64Data = att.data.split(',')[1];
  }

  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  try {
    const { prompt, history = [], attachments = [] } = await parseBody(req);

    const formattedHistory = history
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: msg.content ? [{ text: msg.content }] : [],
      }))
      .filter((msg) => msg.parts.length > 0);

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const msgParts = [];
    for (const att of attachments) {
      try {
        msgParts.push(await attachmentToPart(att));
      } catch (error) {
        console.error('Error processing attachment for Gemini', error);
      }
    }

    if (prompt) {
      msgParts.push({ text: prompt });
    }

    const result = await callGeminiWithRetry(() => chat.sendMessage(msgParts));
    return res.status(200).json({ text: result.response.text() });
  } catch (error) {
    console.error('Error calling Gemini:', error);
    return res.status(500).json({ error: error.message || 'Failed to process chat' });
  }
}
