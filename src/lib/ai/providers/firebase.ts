/**
 * Firebase Functions AI Provider
 *
 * This provider calls a secure Firebase Cloud Function that proxies requests to OpenRouter.
 * The API key is stored server-side, not exposed to clients.
 *
 * Security benefits:
 * - API key never exposed in client code
 * - Server-side rate limiting
 * - Usage monitoring and logging
 * - IP-based abuse prevention
 */

import type {
  AIProvider,
  AIProviderConfig,
  AIMessage,
  AIResponse,
  AIRequestOptions
} from '../types';

export class FirebaseProvider implements AIProvider {
  readonly name = 'firebase';
  private firebaseFunctionUrl: string;
  private userId?: string;

  constructor(config: AIProviderConfig & { firebaseFunctionUrl?: string, userId?: string }) {
    // Firebase function URL from environment or default
    this.firebaseFunctionUrl = config.firebaseFunctionUrl ||
      import.meta.env.VITE_FIREBASE_FUNCTION_URL ||
      'https://us-central1-your-project-id.cloudfunctions.net/aiChat';

    this.userId = config.userId;
  }

  isConfigured(): boolean {
    return !!this.firebaseFunctionUrl;
  }

  async chat(messages: AIMessage[], _options?: AIRequestOptions): Promise<AIResponse> {
    if (!this.isConfigured()) {
      throw new Error('Firebase provider not configured. Set VITE_FIREBASE_FUNCTION_URL environment variable.');
    }

    // Extract user message (last message should be from user)
    const userMessage = messages[messages.length - 1];
    if (!userMessage || userMessage.role !== 'user') {
      throw new Error('Last message must be from user');
    }

    // Extract system prompt (if any)
    const systemMessage = messages.find(msg => msg.role === 'system');

    try {
      const response = await fetch(this.firebaseFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage.content,
          systemPrompt: systemMessage?.content,
          userId: this.userId,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));

        if (response.status === 429) {
          throw new Error(error.error || 'Rate limit exceeded. Please try again in a moment.');
        }

        throw new Error(error.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();

      return {
        content: data.content,
        model: data.model || 'deepseek/deepseek-chat-v3.1:free',
        usage: data.usage
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to communicate with AI service');
    }
  }

  getAvailableModels(): string[] {
    // Models are managed server-side for security
    return ['deepseek/deepseek-chat-v3.1:free'];
  }
}
