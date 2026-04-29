export type LLMProvider = 'groq' | 'anthropic' | 'openai' | 'google' | 'mistral' | 'ollama';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;       // override for Ollama / custom endpoints
  temperature?: number;   // default 0.3
  maxTokens?: number;     // default 2000
  streaming?: boolean;    // default true
  fallbackProvider?: LLMProvider;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  text: string;
  provider: LLMProvider;
  model: string;
  tokensUsed: number;
  latencyMs: number;
}

export class LLMService {
  private config: LLMConfig;
  constructor(config: LLMConfig) {
    this.config = config;
  }

  async complete(messages: LLMMessage[]): Promise<LLMResponse> {
    try {
      return await this.callProvider(this.config, messages);
    } catch (err) {
      if (this.config.fallbackProvider) {
        // Auto-fallback to secondary provider (we'd need a way to fetch its config, but simplistic for now)
        // Here we just throw or ideally use the store, but LLMService is isolated. 
        // We can pass fallback configs logic upstream if needed.
        throw new Error(`Primary provider ${this.config.provider} failed and fallback not fully implemented. Error: ${(err as Error).message}`);
      }
      throw err;
    }
  }

  async *stream(messages: LLMMessage[]): AsyncGenerator<string> {
    // Basic implementation for standard OpenAI-like streaming
    const endpoint = this.getEndpoint();
    const payload = this.buildPayload(messages);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ ...payload, stream: true })
    });
    
    if (!response.ok) {
       throw new Error(`LLM Error: ${response.statusText}`);
    }

    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        let trimmed = line.trim();
        if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
          try {
            const data = JSON.parse(trimmed.slice(6));
            if (this.config.provider === 'anthropic') {
              if (data.type === 'content_block_delta' && data.delta?.text) {
                yield data.delta.text;
              }
            } else if (data.choices && data.choices.length > 0) {
              const content = data.choices[0].delta?.content;
              if (content) yield content;
            } else if (this.config.provider === 'ollama' && data.message?.content) {
              yield data.message.content;
            }
          } catch (e) {
            // Ignore incomplete JSON chunks gracefully
          }
        }
      }
    }
  }

  private async callProvider(config: LLMConfig, messages: LLMMessage[]): Promise<LLMResponse> {
    const start = Date.now();
    const endpoint = this.getEndpoint();
    const payload = this.buildPayload(messages);
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
       throw new Error(`Provider ${config.provider} returned ${res.status}: ${await res.text()}`);
    }
    
    const data = await res.json();
    const latencyMs = Date.now() - start;
    let text = '';
    let tokensUsed = 0;
    
    if (config.provider === 'anthropic') {
      text = data.content?.[0]?.text || '';
      tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);
    } else if (config.provider === 'google') {
      text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
       // Openai compliant (groq, mistral, ollama, openai)
       text = data.choices?.[0]?.message?.content || '';
       tokensUsed = data.usage?.total_tokens || 0;
    }
    
    return {
      text,
      provider: config.provider,
      model: config.model,
      tokensUsed,
      latencyMs
    };
  }

  private getEndpoint(): string {
    const endpoints: Record<LLMProvider, string> = {
      groq:      'https://api.groq.com/openai/v1/chat/completions',
      anthropic: 'https://api.anthropic.com/v1/messages',
      openai:    'https://api.openai.com/v1/chat/completions',
      google:    `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
      mistral:   'https://api.mistral.ai/v1/chat/completions',
      ollama:    `${this.config.baseUrl ?? 'http://localhost:11434'}/api/chat`,
    };
    return endpoints[this.config.provider];
  }

  private buildPayload(messages: LLMMessage[]): any {
    if (this.config.provider === 'anthropic') {
      const systemMessages = messages.filter(m => m.role === 'system');
      const otherMessages = messages.filter(m => m.role !== 'system');
      return {
        model: this.config.model,
        messages: otherMessages,
        system: systemMessages.map(m => m.content).join('\n'),
        max_tokens: this.config.maxTokens || 2000,
        temperature: this.config.temperature ?? 0.3
      };
    } else if (this.config.provider === 'google') {
       // Basic google payload
       const contents = messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{text: m.content}]
       }));
       return {
          contents,
          generationConfig: {
             temperature: this.config.temperature ?? 0.3,
             maxOutputTokens: this.config.maxTokens || 2000
          }
       };
    } else {
       // OpenAI payload
       return {
          model: this.config.model,
          messages,
          temperature: this.config.temperature ?? 0.3,
          max_tokens: this.config.maxTokens || 2000
       };
    }
  }

  private getHeaders(): HeadersInit {
    if (this.config.provider === 'google') {
       return { 'Content-Type': 'application/json' };
    }
    
    if (this.config.provider === 'ollama') {
       return { 'Content-Type': 'application/json' };
    }
    
    const h: Record<LLMProvider, HeadersInit> = {
      groq:      { 'Authorization': `Bearer ${this.config.apiKey}`, 'Content-Type': 'application/json' },
      anthropic: { 'x-api-key': this.config.apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      openai:    { 'Authorization': `Bearer ${this.config.apiKey}`, 'Content-Type': 'application/json' },
      mistral:   { 'Authorization': `Bearer ${this.config.apiKey}`, 'Content-Type': 'application/json' },
      google:    { 'Content-Type': 'application/json' },
      ollama:    { 'Content-Type': 'application/json' },
    };
    return h[this.config.provider];
  }
}
