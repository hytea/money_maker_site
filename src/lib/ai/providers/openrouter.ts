/**
 * OpenRouter AI Provider Plugin
 *
 * Integrates with OpenRouter API to provide access to multiple AI models.
 * See: https://openrouter.ai/docs
 */

import type {
  AIProvider,
  AIProviderConfig,
  AIMessage,
  AIRequestOptions,
  AIResponse,
} from '../types';

export class OpenRouterProvider implements AIProvider {
  readonly name = 'openrouter';
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey || '';
    this.baseUrl = config.baseUrl || 'https://openrouter.ai/api/v1';
    this.defaultModel = config.defaultModel || 'deepseek/deepseek-chat-v3.1:free';
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  getAvailableModels(): string[] {
    return [
      'deepseek/deepseek-chat-v3.1:free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'google/gemini-2.0-flash-exp:free',
      'microsoft/phi-3-medium-128k-instruct:free',
    ];
  }

  async chat(
    messages: AIMessage[],
    options: AIRequestOptions = {}
  ): Promise<AIResponse> {
    if (!this.isConfigured()) {
      throw new Error(
        'OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY environment variable.'
      );
    }

    const model = options.model || this.defaultModel;
    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.maxTokens ?? 1000;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'QuickCalc Tools',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenRouter API error: ${response.status} - ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0]?.message) {
        throw new Error('Invalid response format from OpenRouter API');
      }

      return {
        content: data.choices[0].message.content,
        model: data.model || model,
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while calling OpenRouter API');
    }
  }
}
