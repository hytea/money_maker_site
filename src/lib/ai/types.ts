/**
 * AI Plugin Architecture Types
 *
 * This module defines the plugin interface for AI providers.
 * Supports multiple AI providers through a common interface.
 */

/**
 * Message format for AI conversations
 */
export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Configuration options for AI requests
 */
export interface AIRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

/**
 * Response from AI provider
 */
export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Base interface that all AI providers must implement
 */
export interface AIProvider {
  /**
   * Provider name (e.g., 'openrouter', 'openai', 'anthropic')
   */
  readonly name: string;

  /**
   * Check if provider is configured and ready to use
   */
  isConfigured(): boolean;

  /**
   * Send a chat completion request
   */
  chat(
    messages: AIMessage[],
    options?: AIRequestOptions
  ): Promise<AIResponse>;

  /**
   * Get available models for this provider
   */
  getAvailableModels(): string[];
}

/**
 * Configuration for AI provider plugins
 */
export interface AIProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  defaultModel?: string;
  [key: string]: unknown;
}
