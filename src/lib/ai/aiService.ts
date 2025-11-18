/**
 * AI Service - Main interface for AI features
 *
 * Manages AI provider plugins and provides a unified interface
 * for AI-powered features throughout the application.
 *
 * SECURITY: Uses Firebase Functions proxy by default to keep API keys server-side.
 * Falls back to direct OpenRouter calls for local development only.
 */

import type { AIProvider, AIMessage, AIRequestOptions, AIResponse } from './types';
import { OpenRouterProvider } from './providers/openrouter';
import { FirebaseProvider } from './providers/firebase';

class AIService {
  private providers: Map<string, AIProvider> = new Map();
  private activeProvider: string | null = null;

  constructor() {
    this.initializeProviders();
  }

  /**
   * Initialize available AI providers from environment variables
   *
   * Priority:
   * 1. Firebase Functions (production - secure, API key server-side)
   * 2. OpenRouter (local development only - API key exposed)
   */
  private initializeProviders(): void {
    // Initialize Firebase provider (RECOMMENDED for production)
    const firebaseFunctionUrl = import.meta.env.VITE_FIREBASE_FUNCTION_URL;
    if (firebaseFunctionUrl) {
      const firebase = new FirebaseProvider({
        firebaseFunctionUrl,
        userId: this.generateUserId(),
      });
      this.providers.set('firebase', firebase);

      // Set Firebase as active provider (secure, production-ready)
      if (!this.activeProvider) {
        this.activeProvider = 'firebase';
      }
    }

    // Initialize OpenRouter as fallback (LOCAL DEVELOPMENT ONLY)
    // WARNING: This exposes the API key client-side. Only use for local testing!
    const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (openRouterApiKey && !this.activeProvider) {
      console.warn(
        '⚠️ Using direct OpenRouter provider. API key is exposed client-side!\n' +
        '   For production, use Firebase Functions proxy instead.'
      );

      const openRouter = new OpenRouterProvider({
        apiKey: openRouterApiKey,
        defaultModel: 'deepseek/deepseek-chat-v3.1:free',
      });
      this.providers.set('openrouter', openRouter);

      // Only set as active if Firebase is not available
      if (!this.activeProvider) {
        this.activeProvider = 'openrouter';
      }
    }
  }

  /**
   * Generate a unique user ID for rate limiting
   * Uses localStorage to persist across sessions
   */
  private generateUserId(): string {
    const STORAGE_KEY = 'ai-user-id';
    let userId = localStorage.getItem(STORAGE_KEY);

    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(STORAGE_KEY, userId);
    }

    return userId;
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
