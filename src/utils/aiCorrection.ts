import type { SentenceCorrectionResult } from '../types';

export const correctSentence = async (sentence: string): Promise<SentenceCorrectionResult> => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `You are an English grammar expert. Correct the following sentence and provide a brief explanation if there are errors. If the sentence is already correct, just say "Correct!".

Sentence: "${sentence}"

Respond in this exact JSON format (no markdown, no backticks):
{
  "corrected": "the corrected sentence here",
  "explanation": "brief explanation of changes or 'Correct!' if no changes needed"
}`
          }
        ],
      })
    });

    const data = await response.json();
    const textContent = data.content.find((item: any) => item.type === "text");
    
    if (!textContent) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const cleanText = textContent.text.trim();
    const parsed = JSON.parse(cleanText);

    return {
      original: sentence,
      corrected: parsed.corrected,
      explanation: parsed.explanation
    };
  } catch (error) {
    console.error('Sentence correction error:', error);
    throw new Error('Failed to correct sentence');
  }
};
