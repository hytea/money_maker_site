/**
 * AI-Powered Insights Component
 *
 * Provides intelligent, personalized insights using AI
 * for calculator results and user data.
 */

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

interface AIInsightsProps {
  /** Context data to send to AI (e.g., BMI, age, goals) */
  context: Record<string, unknown>;
  /** Type of calculator/tool (e.g., 'bmi', 'loan', 'tip') */
  toolType: string;
  /** Optional custom prompt template */
  customPrompt?: string;
}

export function AIInsights({ context, toolType, customPrompt }: AIInsightsProps) {
  const { ask, response, loading, error, isAvailable, clear } = useAI({
    temperature: 0.7,
    maxTokens: 500,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const generateInsights = async () => {
    setIsExpanded(true);

    // Create a context-aware prompt
    const contextStr = Object.entries(context)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    const systemPrompt = customPrompt || `You are a helpful AI assistant providing personalized insights for a ${toolType} calculator.
Be concise, practical, and encouraging. Focus on actionable advice.
Keep your response to 2-3 short paragraphs maximum.`;

    const userPrompt = `Based on this ${toolType} calculation data: ${contextStr}

Please provide personalized insights and recommendations. Be specific and helpful.`;

    try {
      await ask(userPrompt, systemPrompt);
    } catch (err) {
      console.error('Error generating AI insights:', err);
    }
  };

  if (!isAvailable) {
    return null; // Don't show component if AI is not configured
  }

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI-Powered Insights
          <span className="ml-auto text-xs font-normal text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
            Beta
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isExpanded ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Get personalized AI-powered recommendations based on your results
            </p>
            <Button
              onClick={generateInsights}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Insights
            </Button>
          </div>
        ) : (
          <div>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <span className="ml-3 text-gray-600">Analyzing your data...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {response && !loading && (
              <div className="bg-white border border-purple-200 rounded-lg p-4">
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {response}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-200 flex gap-2">
                  <Button
                    onClick={generateInsights}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    Regenerate
                  </Button>
                  <Button
                    onClick={() => {
                      clear();
                      setIsExpanded(false);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          Powered by AI • Results may vary • Always consult professionals for important decisions
        </div>
      </CardContent>
    </Card>
  );
}
