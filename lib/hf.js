import axios from 'axios';

const HF_URL = 'https://router.huggingface.co/v1/chat/completions';
const HF_MODELS = [
  'meta-llama/Llama-3.1-8B-Instruct:fastest',
  'Qwen/Qwen2.5-7B-Instruct:fastest',
  'openai/gpt-oss-20b:fastest',
  'meta-llama/Meta-Llama-3-8B-Instruct:fastest',
];
const fallbackHFToken = 'REMOVED';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getErrorMessage(error) {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    ''
  );
}

function isRetryableHFError(error) {
  const status = error?.response?.status;
  const msg = getErrorMessage(error).toLowerCase();

  return (
    status === 429 ||
    status === 503 ||
    status === 504 ||
    msg.includes('rate') ||
    msg.includes('too many requests') ||
    msg.includes('busy') ||
    msg.includes('overloaded') ||
    msg.includes('temporarily unavailable') ||
    msg.includes('provider') ||
    msg.includes('not supported')
  );
}

async function callHFModel(prompt, model) {
  const hfToken = process.env.HF_TOKEN || fallbackHFToken;

  const res = await axios.post(
    HF_URL,
    {
      model,
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

export async function askHF(prompt) {
  const hfToken = process.env.HF_TOKEN || fallbackHFToken;

  if (!hfToken) {
    throw new Error('HF_TOKEN is not configured');
  }

  let lastError;

  for (const model of HF_MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await sleep(1200);
        return await callHFModel(prompt, model);
      } catch (error) {
        lastError = error;

        if (!isRetryableHFError(error)) {
          throw error;
        }

        console.log(`Hugging Face busy for ${model}. Retrying...`);
        await sleep(2500);
      }
    }
  }

  throw new Error(getErrorMessage(lastError) || 'Hugging Face is busy. Try again.');
}
