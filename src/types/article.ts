export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;

  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  focusKeyword: string;

  // Categorization
  category: CalculatorCategory;
  relatedTools: string[]; // Tool IDs this article relates to
  tags: string[];

  // Trending Topic Data
  trendingTopics?: TrendingTopic[];
  targetSearchQueries?: string[];

  // Author & Status
  author: string;
  status: 'draft' | 'published' | 'archived';

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;

  // Analytics
  views: number;
  featured: boolean;

  // AI Generation Metadata
  aiGenerated: boolean;
  aiPrompt?: string;
  aiModel?: string;
}

export type CalculatorCategory =
  | 'tip-calculator'
  | 'loan-calculator'
  | 'pregnancy-calculator'
  | 'bmi-calculator'
  | 'discount-calculator'
  | 'age-calculator'
  | 'split-bill-calculator'
  | 'unit-converter'
  | 'general';

export interface TrendingTopic {
  keyword: string;
  searchVolume: number;
  trend: 'rising' | 'steady' | 'declining';
  relatedQueries: string[];
  source: 'google-trends' | 'manual';
  fetchedAt: Date;
  location?: string;
}

export interface SEOGuidelines {
  // Content Structure
  minWordCount: number;
  maxWordCount: number;
  optimalWordCount: number;

  // Keyword Usage
  keywordDensity: {
    min: number;
    max: number;
    optimal: number;
  };

  // Headings
  requireH1: boolean;
  minH2Count: number;
  maxH2Count: number;

  // Links
  minInternalLinks: number;
  minExternalLinks: number;

  // Readability
  maxParagraphLength: number;
  targetReadingLevel: string;

  // Meta
  metaTitleLength: { min: number; max: number };
  metaDescriptionLength: { min: number; max: number };
}

export interface ArticleTemplate {
  id: string;
  name: string;
  description: string;
  structure: ArticleSection[];
  seoGuidelines: SEOGuidelines;
  aiPromptTemplate: string;
}

export interface ArticleSection {
  type: 'heading' | 'paragraph' | 'list' | 'table' | 'callout' | 'faq';
  title?: string;
  content?: string;
  placeholder?: string;
  required: boolean;
}

export interface TrendingTopicRequest {
  category: CalculatorCategory;
  keywords: string[];
  location?: string;
  timeframe?: 'now 1-d' | 'now 7-d' | 'today 1-m' | 'today 3-m' | 'today 12-m';
}

export interface TrendingTopicResponse {
  topics: TrendingTopic[];
  suggestions: ArticleSuggestion[];
  fetchedAt: Date;
}

export interface ArticleSuggestion {
  title: string;
  suggestedKeywords: string[];
  estimatedSearchVolume: number;
  relevanceScore: number;
  urgency: 'high' | 'medium' | 'low';
  reason: string;
}
