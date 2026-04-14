/**
 * LLM Client for Claude API
 */
export interface LLMRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  tokenUsage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export class LLMClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendRequest(request: LLMRequest): Promise<LLMResponse> {
    // TODO: Implement Claude API call
    return {
      content: '',
      tokenUsage: {
        inputTokens: 0,
        outputTokens: 0,
      },
    };
  }
}
