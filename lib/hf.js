import axios from 'axios';

const HF_URL = 'https://router.huggingface.co/v1/chat/completions';
const HF_MODEL = 'meta-llama/Llama-3.1-8B-Instruct:fastest';

export async function askHF(prompt) {
  const hfToken = process.env.HF_TOKEN;

  if (!hfToken) {
    throw new Error('HF_TOKEN is not configured');
  }

  const res = await axios.post(
    HF_URL,
    {
      model: HF_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 700,
      temperature: 0.7,
      stream: false,
    },
    {
      headers: {
        Authorization: `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );

  const generatedText = res.data?.choices?.[0]?.message?.content;

  if (!generatedText) {
    throw new Error('Empty response from Hugging Face');
  }

  return generatedText.trim();
}
