// Vercel Serverless Function: Grammar Correction via Hugging Face
// This runs server-side, avoiding CORS and keeping API keys secure

const HF_MODELS = [
  'grammarly/coedit-large',
  'pszemraj/flan-t5-large-grammar-synthesis',
  'vennify/t5-base-grammar-correction',
];

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing "text" field' });
  }

  const original = text.trim();

  // Try each HF model
  for (const model of HF_MODELS) {
    try {
      const hfRes = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Use HF token from env if available (optional, increases rate limits)
            ...(process.env.HF_TOKEN
              ? { Authorization: `Bearer ${process.env.HF_TOKEN}` }
              : {}),
          },
          body: JSON.stringify({
            inputs: model.includes('coedit')
              ? `Fix grammatical errors in this sentence: ${original}`
              : original,
            options: { wait_for_model: true },
          }),
          signal: AbortSignal.timeout(15000),
        }
      );

      if (!hfRes.ok) continue;

      const data = await hfRes.json();
      let corrected = original;

      if (Array.isArray(data) && data[0]) {
        corrected =
          data[0].generated_text || data[0].translation_text || original;
      }

      corrected = corrected.trim();
      if (
        corrected &&
        !corrected.endsWith('.') &&
        !corrected.endsWith('!') &&
        !corrected.endsWith('?')
      ) {
        corrected += '.';
      }

      return res.status(200).json({ corrected, model, source: 'ai' });
    } catch {
      continue;
    }
  }

  // All models failed — tell the client to use local fallback
  return res.status(200).json({ corrected: null, source: 'fallback' });
}
