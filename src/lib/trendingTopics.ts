import {
  TrendingTopic,
  TrendingTopicRequest,
  TrendingTopicResponse,
  ArticleSuggestion,
  CalculatorCategory,
} from '../types/article';
import { calculatorKeywords } from '../config/seoGuidelines';

/**
 * Trending Topics Service
 *
 * This service aggregates trending topics from various sources
 * to help identify high-value article opportunities.
 *
 * Data Sources:
 * - Google Trends (via API or manual input)
 * - Google Search Console (if connected)
 * - Manual trending topic entry
 */

interface GoogleTrendsData {
  keyword: string;
  value: number; // Interest over time (0-100)
  relatedQueries?: Array<{
    query: string;
    value: number;
  }>;
}

export class TrendingTopicsService {
  /**
   * Fetch trending topics for a specific calculator category
   */
  async fetchTrendingTopics(
    request: TrendingTopicRequest
  ): Promise<TrendingTopicResponse> {
    const { category, keywords, location = 'US', timeframe = 'now 7-d' } = request;

    // Get base keywords for this category
    const baseKeywords = calculatorKeywords[category] || [];
    const allKeywords = [...new Set([...baseKeywords, ...keywords])];

    // In production, this would call Google Trends API
    // For now, we'll provide a structure for manual entry
    const topics: TrendingTopic[] = [];

    // NOTE: To integrate with Google Trends API, use one of these options:
    // 1. SerpApi (https://serpapi.com/google-trends-api)
    // 2. google-trends-api npm package (unofficial)
    // 3. Manual CSV export from trends.google.com

    // For manual implementation:
    console.log('Fetching trends for:', {
      category,
      keywords: allKeywords,
      location,
      timeframe,
    });

    // Generate article suggestions based on keywords
    const suggestions = this.generateArticleSuggestions(category, allKeywords);

    return {
      topics,
      suggestions,
      fetchedAt: new Date(),
    };
  }

  /**
   * Generate article suggestions based on trending topics
   */
  private generateArticleSuggestions(
    category: CalculatorCategory,
    keywords: string[]
  ): ArticleSuggestion[] {
    const suggestions: ArticleSuggestion[] = [];

    // Template-based suggestions
    const templates = [
      {
        template: 'How to Calculate {keyword} in {year}',
        urgency: 'medium' as const,
        reason: 'Evergreen "how-to" content with year for freshness',
      },
      {
        template: '{keyword}: Complete Guide for Beginners',
        urgency: 'low' as const,
        reason: 'Comprehensive guide targets broad search intent',
      },
      {
        template: '{keyword} vs {alternative}: Which is Better?',
        urgency: 'medium' as const,
        reason: 'Comparison content targets decision-making searches',
      },
      {
        template: '10 Tips for Accurate {keyword}',
        urgency: 'low' as const,
        reason: 'Listicle format is shareable and engaging',
      },
      {
        template: 'Common {keyword} Mistakes and How to Avoid Them',
        urgency: 'medium' as const,
        reason: 'Problem-solving content addresses pain points',
      },
    ];

    // Generate suggestions for top keywords
    keywords.slice(0, 5).forEach((keyword) => {
      templates.forEach((template) => {
        const year = new Date().getFullYear();
        const title = template.template
          .replace('{keyword}', keyword)
          .replace('{year}', year.toString())
          .replace('{alternative}', this.getAlternativeKeyword(keyword));

        suggestions.push({
          title,
          suggestedKeywords: [keyword, ...this.getRelatedKeywords(keyword)],
          estimatedSearchVolume: this.estimateSearchVolume(keyword),
          relevanceScore: this.calculateRelevanceScore(keyword, category),
          urgency: template.urgency,
          reason: template.reason,
        });
      });
    });

    // Sort by urgency and relevance
    return suggestions
      .sort((a, b) => {
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        const urgencyDiff =
          urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        if (urgencyDiff !== 0) return urgencyDiff;
        return b.relevanceScore - a.relevanceScore;
      })
      .slice(0, 10); // Return top 10 suggestions
  }

  /**
   * Manual trending topic entry
   * Use this when manually researching Google Trends
   */
  createManualTrendingTopic(
    keyword: string,
    searchVolume: number,
    trend: 'rising' | 'steady' | 'declining',
    relatedQueries: string[] = []
  ): TrendingTopic {
    return {
      keyword,
      searchVolume,
      trend,
      relatedQueries,
      source: 'manual',
      fetchedAt: new Date(),
      location: 'US',
    };
  }

  /**
   * Analyze Google Trends CSV export
   * Download CSV from trends.google.com and parse it here
   */
  parseGoogleTrendsCSV(csvContent: string): TrendingTopic[] {
    const topics: TrendingTopic[] = [];

    try {
      const lines = csvContent.split('\n');
      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [keyword, value] = line.split(',');
        if (keyword && value) {
          topics.push({
            keyword: keyword.trim(),
            searchVolume: parseInt(value) || 0,
            trend: this.determineTrend(parseInt(value)),
            relatedQueries: [],
            source: 'google-trends',
            fetchedAt: new Date(),
            location: 'US',
          });
        }
      }
    } catch (error) {
      console.error('Error parsing Google Trends CSV:', error);
    }

    return topics;
  }

  /**
   * Get trending topics from Google Trends via SerpApi
   * Requires VITE_SERPAPI_KEY environment variable
   */
  async fetchGoogleTrendsSerpApi(
    keywords: string[],
    location = 'US'
  ): Promise<TrendingTopic[]> {
    const apiKey = import.meta.env.VITE_SERPAPI_KEY;

    if (!apiKey) {
      console.warn('SerpApi key not configured. Use manual trending topics instead.');
      return [];
    }

    const topics: TrendingTopic[] = [];

    try {
      for (const keyword of keywords) {
        const url = `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(
          keyword
        )}&geo=${location}&api_key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.interest_over_time?.timeline_data) {
          const latestValue =
            data.interest_over_time.timeline_data[
              data.interest_over_time.timeline_data.length - 1
            ]?.values?.[0]?.value || 0;

          const relatedQueries =
            data.related_queries?.rising?.map(
              (q: { query: string }) => q.query
            ) || [];

          topics.push({
            keyword,
            searchVolume: latestValue,
            trend: this.determineTrend(latestValue),
            relatedQueries,
            source: 'google-trends',
            fetchedAt: new Date(),
            location,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching from SerpApi:', error);
    }

    return topics;
  }

  /**
   * Get current trending searches (Google Trends Daily)
   * These are the "Trending Now" topics
   */
  async fetchDailyTrendingSearches(location = 'US'): Promise<string[]> {
    const apiKey = import.meta.env.VITE_SERPAPI_KEY;

    if (!apiKey) {
      return [];
    }

    try {
      const url = `https://serpapi.com/search.json?engine=google_trends_trending_now&geo=${location}&api_key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      return (
        data.daily_searches?.map(
          (item: { query: string }) => item.query
        ) || []
      );
    } catch (error) {
      console.error('Error fetching daily trends:', error);
      return [];
    }
  }

  // Helper methods

  private getRelatedKeywords(keyword: string): string[] {
    const related: string[] = [];

    // Add variations
    if (keyword.includes('calculator')) {
      related.push(
        keyword.replace('calculator', 'calculation'),
        keyword.replace('calculator', 'calc'),
        `how to ${keyword.replace(' calculator', '')}`
      );
    }

    return related.slice(0, 3);
  }

  private getAlternativeKeyword(keyword: string): string {
    const alternatives: Record<string, string> = {
      'tip calculator': 'gratuity calculator',
      'loan calculator': 'mortgage calculator',
      'BMI calculator': 'body fat calculator',
      'discount calculator': 'percentage off calculator',
    };

    return alternatives[keyword.toLowerCase()] || 'alternative method';
  }

  private estimateSearchVolume(keyword: string): number {
    // This would ideally use Google Keyword Planner API
    // For now, return estimated values based on keyword type
    const highVolume = [
      'calculator',
      'how to',
      'guide',
      'tips',
      'best',
    ];
    const score = highVolume.reduce(
      (acc, term) => acc + (keyword.toLowerCase().includes(term) ? 1000 : 0),
      500
    );

    return score;
  }

  private calculateRelevanceScore(
    keyword: string,
    category: CalculatorCategory
  ): number {
    const categoryKeywords = calculatorKeywords[category] || [];
    const keywordLower = keyword.toLowerCase();

    // Check if keyword is in category keywords
    const directMatch = categoryKeywords.some((ck) =>
      keywordLower.includes(ck.toLowerCase())
    );

    // Check for calculator-related terms
    const calculatorRelated = keywordLower.includes('calculat');

    let score = 50; // Base score

    if (directMatch) score += 30;
    if (calculatorRelated) score += 20;

    return Math.min(score, 100);
  }

  private determineTrend(value: number): 'rising' | 'steady' | 'declining' {
    // This is simplified - in production, compare with historical data
    if (value > 70) return 'rising';
    if (value < 30) return 'declining';
    return 'steady';
  }
}

// Export singleton instance
export const trendingTopicsService = new TrendingTopicsService();

/**
 * Helper function to format trending topics for display
 */
export function formatTrendingTopic(topic: TrendingTopic): string {
  const trendEmoji = {
    rising: '📈',
    steady: '➡️',
    declining: '📉',
  };

  return `${trendEmoji[topic.trend]} ${topic.keyword} (${topic.searchVolume})`;
}

/**
 * Get trending topics grouped by urgency
 */
export function groupSuggestionsByUrgency(suggestions: ArticleSuggestion[]) {
  return {
    high: suggestions.filter((s) => s.urgency === 'high'),
    medium: suggestions.filter((s) => s.urgency === 'medium'),
    low: suggestions.filter((s) => s.urgency === 'low'),
  };
}
