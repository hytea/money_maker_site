import { SEOGuidelines, ArticleTemplate } from '../types/article';

/**
 * SEO Guidelines for AI-Generated Articles
 *
 * These guidelines ensure all articles follow SEO best practices
 * and are optimized for search engine visibility.
 */
export const defaultSEOGuidelines: SEOGuidelines = {
  // Content Structure
  minWordCount: 800,
  maxWordCount: 2500,
  optimalWordCount: 1500,

  // Keyword Usage
  keywordDensity: {
    min: 0.5, // 0.5% minimum
    max: 2.5, // 2.5% maximum
    optimal: 1.5, // 1.5% optimal
  },

  // Headings
  requireH1: true,
  minH2Count: 3,
  maxH2Count: 8,

  // Links
  minInternalLinks: 3,
  minExternalLinks: 1,

  // Readability
  maxParagraphLength: 150, // words
  targetReadingLevel: 'Grade 8-10',

  // Meta
  metaTitleLength: { min: 50, max: 60 },
  metaDescriptionLength: { min: 140, max: 160 },
};

/**
 * AI Prompt Template for Article Generation
 *
 * This template guides the AI to create SEO-optimized content
 * that aligns with our calculator tools.
 */
export const aiArticlePromptTemplate = `
# Article Generation Guidelines

You are writing an SEO-optimized article for QuickCalc, a website offering free online calculators.

## CRITICAL SEO Requirements:

1. **Focus Keyword**: {focusKeyword}
   - Use in: Title (beginning preferred), first paragraph, at least one H2, URL slug, meta description
   - Keyword density: 1-2% (naturally incorporated)
   - Use variations and related terms

2. **Article Structure**:
   - Title: Compelling, includes focus keyword, 50-60 characters
   - Introduction: Hook reader, state the problem/question, preview solution (150-200 words)
   - Body: 3-6 main sections with H2 headings
   - Conclusion: Summarize key points, call-to-action
   - FAQ section (optional but recommended)

3. **Content Quality**:
   - Word count: 1,200-1,800 words
   - Write for humans first, search engines second
   - Use short paragraphs (2-4 sentences)
   - Include bullet points and numbered lists
   - Write in active voice
   - Use conversational tone but remain professional

4. **Internal Linking**:
   - Link to related calculator: {relatedCalculator}
   - Link to at least 2 other relevant calculators
   - Use descriptive anchor text (not "click here")

5. **External Linking**:
   - Include 1-2 authoritative external sources
   - Link to .gov, .edu, or industry-leading sites
   - Open in new tab

6. **Trending Topic Integration**:
   - Current trending topic: {trendingTopic}
   - Related searches: {relatedSearches}
   - Naturally weave trending angle into content
   - Address why this topic is relevant NOW

7. **Meta Information**:
   - Meta Title: {focusKeyword} + benefit/year (55-60 chars)
   - Meta Description: Compelling summary with keyword and CTA (140-160 chars)

8. **Search Intent**:
   - Primary intent: {searchIntent} (informational/transactional/navigational)
   - Address the user's question directly
   - Provide actionable information

## Article Topic:
{articleTopic}

## Related Calculator:
{relatedCalculator}

## Target Audience:
{targetAudience}

## Trending Keywords to Include:
{trendingKeywords}

## Required Sections:
1. Introduction (hook + problem statement)
2. {section1Title}
3. {section2Title}
4. {section3Title}
5. Practical Examples
6. Common Mistakes to Avoid
7. Conclusion with CTA
8. FAQ (3-5 questions)

## Writing Style Guidelines:
- Use "you" to address reader
- Include real-world examples
- Add statistics when relevant (cite sources)
- Use transition words between sections
- Break up text with subheadings (H3)
- Include actionable tips
- End with a clear call-to-action (use our calculator)

## What NOT to Do:
- Don't keyword stuff
- Don't use jargon without explanation
- Don't write walls of text
- Don't make unsupported claims
- Don't forget to proofread
- Don't use passive voice excessively
- Don't ignore the trending topic angle

## Output Format:
Return the article in markdown format with:
- H1 title
- H2 for main sections
- H3 for subsections
- Bullet points where appropriate
- Bold for emphasis
- Internal links in format: [anchor text](/calculator-url)
- External links in format: [anchor text](https://example.com)

Remember: Write content that genuinely helps users while naturally incorporating SEO best practices.
`;

/**
 * Article Templates for Different Calculator Categories
 */
export const articleTemplates: Record<string, ArticleTemplate> = {
  'how-to-guide': {
    id: 'how-to-guide',
    name: 'How-To Guide',
    description: 'Step-by-step guide on using a calculator or solving a problem',
    structure: [
      {
        type: 'heading',
        title: 'Introduction',
        placeholder: 'Explain what this guide covers and who it\'s for',
        required: true,
      },
      {
        type: 'heading',
        title: 'What You Need to Know',
        placeholder: 'Prerequisites or background information',
        required: true,
      },
      {
        type: 'heading',
        title: 'Step-by-Step Instructions',
        placeholder: 'Detailed steps with examples',
        required: true,
      },
      {
        type: 'heading',
        title: 'Common Mistakes',
        placeholder: 'What to avoid',
        required: false,
      },
      {
        type: 'heading',
        title: 'Tips & Tricks',
        placeholder: 'Pro tips for better results',
        required: false,
      },
      {
        type: 'faq',
        title: 'Frequently Asked Questions',
        placeholder: '3-5 common questions with answers',
        required: true,
      },
    ],
    seoGuidelines: defaultSEOGuidelines,
    aiPromptTemplate: aiArticlePromptTemplate,
  },

  'ultimate-guide': {
    id: 'ultimate-guide',
    name: 'Ultimate Guide',
    description: 'Comprehensive guide covering all aspects of a topic',
    structure: [
      {
        type: 'heading',
        title: 'Introduction',
        required: true,
      },
      {
        type: 'heading',
        title: 'What Is [Topic]?',
        required: true,
      },
      {
        type: 'heading',
        title: 'Why [Topic] Matters',
        required: true,
      },
      {
        type: 'heading',
        title: 'How to [Action]',
        required: true,
      },
      {
        type: 'heading',
        title: 'Best Practices',
        required: true,
      },
      {
        type: 'heading',
        title: 'Real-World Examples',
        required: true,
      },
      {
        type: 'heading',
        title: 'Common Pitfalls',
        required: false,
      },
      {
        type: 'faq',
        title: 'FAQ',
        required: true,
      },
    ],
    seoGuidelines: {
      ...defaultSEOGuidelines,
      minWordCount: 1500,
      optimalWordCount: 2200,
      maxWordCount: 3000,
    },
    aiPromptTemplate: aiArticlePromptTemplate,
  },

  'trending-topic': {
    id: 'trending-topic',
    name: 'Trending Topic Article',
    description: 'Capitalize on current trending topics related to calculators',
    structure: [
      {
        type: 'heading',
        title: 'Why [Trending Topic] Is Everywhere Right Now',
        required: true,
      },
      {
        type: 'heading',
        title: 'How [Trending Topic] Affects You',
        required: true,
      },
      {
        type: 'heading',
        title: 'What You Need to Calculate',
        required: true,
      },
      {
        type: 'heading',
        title: 'Step-by-Step Guide',
        required: true,
      },
      {
        type: 'heading',
        title: 'Expert Tips',
        required: false,
      },
      {
        type: 'faq',
        title: 'FAQ',
        required: true,
      },
    ],
    seoGuidelines: {
      ...defaultSEOGuidelines,
      minWordCount: 900,
      optimalWordCount: 1300,
      maxWordCount: 2000,
    },
    aiPromptTemplate: aiArticlePromptTemplate,
  },

  'comparison': {
    id: 'comparison',
    name: 'Comparison Article',
    description: 'Compare different approaches or methods',
    structure: [
      {
        type: 'heading',
        title: 'Introduction',
        required: true,
      },
      {
        type: 'heading',
        title: 'Option A: [Name]',
        required: true,
      },
      {
        type: 'heading',
        title: 'Option B: [Name]',
        required: true,
      },
      {
        type: 'table',
        title: 'Side-by-Side Comparison',
        required: true,
      },
      {
        type: 'heading',
        title: 'Which One Should You Choose?',
        required: true,
      },
      {
        type: 'faq',
        title: 'FAQ',
        required: true,
      },
    ],
    seoGuidelines: defaultSEOGuidelines,
    aiPromptTemplate: aiArticlePromptTemplate,
  },

  'listicle': {
    id: 'listicle',
    name: 'Listicle',
    description: 'Numbered list article (e.g., "10 Tips for...")',
    structure: [
      {
        type: 'heading',
        title: 'Introduction',
        required: true,
      },
      {
        type: 'heading',
        title: '1. [First Item]',
        required: true,
      },
      {
        type: 'heading',
        title: '2. [Second Item]',
        required: true,
      },
      {
        type: 'heading',
        title: '3. [Third Item]',
        required: true,
      },
      {
        type: 'heading',
        title: 'Conclusion',
        required: true,
      },
    ],
    seoGuidelines: {
      ...defaultSEOGuidelines,
      minWordCount: 800,
      optimalWordCount: 1200,
      maxWordCount: 1800,
    },
    aiPromptTemplate: aiArticlePromptTemplate,
  },
};

/**
 * Calculator-Specific Keywords
 *
 * These are high-value keywords for each calculator category
 * to help AI generate targeted content.
 */
export const calculatorKeywords: Record<string, string[]> = {
  'tip-calculator': [
    'tip calculator',
    'how to calculate tip',
    'tipping guide',
    'gratuity calculator',
    'restaurant tip',
    'tip percentage',
    'how much to tip',
    'tipping etiquette',
    'server tip',
    'tip calculator app',
  ],
  'loan-calculator': [
    'loan calculator',
    'mortgage calculator',
    'personal loan',
    'interest rate',
    'monthly payment',
    'loan amortization',
    'APR calculator',
    'loan payment calculator',
    'refinance calculator',
    'debt payoff',
  ],
  'pregnancy-calculator': [
    'pregnancy calculator',
    'due date calculator',
    'conception calculator',
    'pregnancy week calculator',
    'how far along am I',
    'pregnancy timeline',
    'gestational age',
    'when did I conceive',
    'pregnancy due date',
    'baby due date',
  ],
  'bmi-calculator': [
    'BMI calculator',
    'body mass index',
    'ideal weight',
    'healthy weight',
    'BMI chart',
    'calculate BMI',
    'weight calculator',
    'obesity calculator',
    'underweight calculator',
    'BMI for adults',
  ],
  'discount-calculator': [
    'discount calculator',
    'percentage off',
    'sale price calculator',
    'savings calculator',
    'markdown calculator',
    'how to calculate discount',
    'coupon calculator',
    'price after discount',
    'discount percentage',
    'final price calculator',
  ],
  'age-calculator': [
    'age calculator',
    'calculate age',
    'how old am I',
    'age in days',
    'birthday calculator',
    'age difference calculator',
    'exact age',
    'age from date of birth',
    'age in years months days',
    'chronological age',
  ],
  'split-bill-calculator': [
    'split bill calculator',
    'bill splitter',
    'divide bill',
    'split check',
    'group payment',
    'shared expenses',
    'bill splitting app',
    'calculate split',
    'restaurant bill split',
    'tip split calculator',
  ],
  'unit-converter': [
    'unit converter',
    'metric conversion',
    'imperial to metric',
    'measurement converter',
    'length converter',
    'weight converter',
    'temperature converter',
    'currency converter',
    'conversion calculator',
    'unit conversion chart',
  ],
};

/**
 * SEO Best Practices Checklist
 *
 * Use this checklist when reviewing AI-generated articles
 */
export const seoChecklist = [
  '✓ Focus keyword in title (preferably at the beginning)',
  '✓ Focus keyword in first paragraph (within first 100 words)',
  '✓ Focus keyword in at least one H2 heading',
  '✓ Focus keyword in URL slug',
  '✓ Focus keyword in meta description',
  '✓ Meta title is 50-60 characters',
  '✓ Meta description is 140-160 characters',
  '✓ Article is 1,200+ words',
  '✓ At least 3 H2 headings used',
  '✓ Short paragraphs (2-4 sentences)',
  '✓ At least 3 internal links to other calculators',
  '✓ At least 1 external authoritative link',
  '✓ Images have alt text (if applicable)',
  '✓ Keyword density is 1-2%',
  '✓ Uses bullet points or numbered lists',
  '✓ Includes FAQ section',
  '✓ Has clear call-to-action',
  '✓ Written in active voice',
  '✓ Conversational tone maintained',
  '✓ No keyword stuffing',
  '✓ Mobile-friendly formatting',
  '✓ Addresses search intent',
  '✓ Trending topic naturally integrated',
  '✓ Provides actionable value',
  '✓ Proofread for errors',
];
