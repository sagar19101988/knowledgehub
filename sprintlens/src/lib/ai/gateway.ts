import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { mistral } from '@ai-sdk/mistral';

// We map provider strings to the correct AI SDK module
export function getModel(providerId: string, modelId: string, apiKey?: string) {
  switch (providerId) {
    case 'anthropic':
      return anthropic(modelId); // API key usually picked up from process.env.ANTHROPIC_API_KEY
    case 'openai':
      return openai(modelId);
    case 'google':
      return google(modelId);
    case 'mistral':
      return mistral(modelId);
    case 'groq':
      const groqProvider = createGroq({
        apiKey: apiKey || process.env.GROQ_API_KEY,
      });
      return groqProvider(modelId);
    default:
      console.warn(`Provider ${providerId} not found, defaulting to OpenAI`);
      return openai('gpt-4o-mini');
  }
}
