/**
 * React Hook for AI Features
 *
 * Provides easy access to AI capabilities in React components
 */

import { useState, useCallback } from 'react';
import { aiService } from '../lib/ai/aiService';
import type { AIRequestOptions } from '../lib/ai/types';

interface UseAIResult {
  /** Send a question/prompt to AI */
  ask: (prompt: string, systemPrompt?: string) => Promise<string>;
  /** Current response from AI */
  response: string | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Check if AI is available */
  isAvailable: boolean;
  /** Clear the current response and error */
  clear: () => void;
}

/**
 * Hook to interact with AI service
 */
export function useAI(options?: AIRequestOptions): UseAIResult {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAvailable = aiService.isAvailable();

  const ask = useCallback(
    async (prompt: string, systemPrompt?: string): Promise<string> => {
      if (!isAvailable) {
        const errorMsg = 'AI service is not available. Please configure an API key.';
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      setLoading(true);
      setError(null);

      try {
        const result = await aiService.ask(prompt, systemPrompt, options);
        setResponse(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAvailable, options]
  );

  const clear = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return {
    ask,
    response,
    loading,
    error,
    isAvailable,
    clear,
  };
}
