/**
 * AI Service - Main interface for AI features
 *
 * Manages AI provider plugins and provides a unified interface
 * for AI-powered features throughout the application.
 */

import type { AIProvider, AIMessage, AIRequestOptions, AIResponse } from './types';
import { OpenRouterProvider } from './providers/openrouter';

class AIService {
  private providers: Map<string, AIProvider> = new Map();
  private activeProvider: string | null = null;

  constructor() {
    this.initializeProviders();
  }

  /**
   * Initialize available AI providers from environment variables
   */
  private initializeProviders(): void {
    // Initialize OpenRouter if API key is available
    const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (openRouterApiKey) {
      const openRouter = new OpenRouterProvider({
        apiKey: openRouterApiKey,
        defaultModel: 'deepseek/deepseek-chat-v3.1:free',
      });
      this.providers.set('openrouter', openRouter);

      // Set as active provider if none is set
      if (!this.activeProvider) {
        this.activeProvider = 'openrouter';
      }
    }
  }

  /**
   * Register a new AI provider plugin
   */
  registerProvider(provider: AIProvider): void {
    this.providers.set(provider.name, provider);

    // Set as active if it's the first configured provider
    if (!this.activeProvider && provider.isConfigured()) {
      this.activeProvider = provider.name;
    }
  }

  /**
   * Get a specific provider by name
   */
  getProvider(name: string): AIProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Get the active provider
   */
  getActiveProvider(): AIProvider | undefined {
    return this.activeProvider ? this.providers.get(this.activeProvider) : undefined;
  }

  /**
   * Set the active provider
   */
  setActiveProvider(name: string): void {
    if (!this.providers.has(name)) {
      throw new Error(`Provider '${name}' is not registered`);
    }
    this.activeProvider = name;
  }

  /**
   * Check if any AI provider is configured and ready
   */
  isAvailable(): boolean {
    const provider = this.getActiveProvider();
    return provider ? provider.isConfigured() : false;
  }

  /**
   * Get list of all registered providers
   */
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Send a chat request to the active provider
   */
  async chat(
    messages: AIMessage[],
    options?: AIRequestOptions
  ): Promise<AIResponse> {
    const provider = this.getActiveProvider();

    if (!provider) {
      throw new Error('No AI provider is configured');
    }

    if (!provider.isConfigured()) {
      throw new Error(`Provider '${provider.name}' is not properly configured`);
    }

    return provider.chat(messages, options);
  }

  /**
   * Simple helper to send a single message and get a response
   */
  async ask(
    prompt: string,
    systemPrompt?: string,
    options?: AIRequestOptions
  ): Promise<string> {
    const messages: AIMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    const response = await this.chat(messages, options);
    return response.content;
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export class for testing or custom instances
export { AIService };
