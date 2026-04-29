export interface LLMProvider {
  id: string;
  name: string;
  models: LLMModel[];
}

export interface LLMModel {
  id: string;
  name: string;
  contextWindow: number;
  costPer1kTokens?: number;
}

export interface UserLLMConfig {
  providerId: string;
  apiKey: string;
  endpoint?: string; // For Azure/internal gateways
}

export const PROVIDERS: Record<string, LLMProvider> = {
  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    models: [
      { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet", contextWindow: 200000 },
      { id: "claude-3-opus-latest", name: "Claude 3 Opus", contextWindow: 200000 },
    ],
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    models: [
      { id: "gpt-4o", name: "GPT-4o", contextWindow: 128000 },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", contextWindow: 128000 },
    ],
  },
  google: {
    id: "google",
    name: "Google",
    models: [
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", contextWindow: 2000000 },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", contextWindow: 1000000 },
    ],
  },
  groq: {
    id: "groq",
    name: "Groq",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", contextWindow: 128000 },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7b", contextWindow: 32768 },
    ],
  },
};
