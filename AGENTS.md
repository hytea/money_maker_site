# Agent Development Guide

This document provides comprehensive guidance for AI agents (like Claude) working on the QuickCalc Tools project. It covers the testing system, development workflows, and best practices.

## Table of Contents

- [Testing System](#testing-system)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Adding New Features](#adding-new-features)
- [AI Search Optimization](#ai-search-optimization)
- [Best Practices](#best-practices)

---

## Testing System

### Overview

QuickCalc Tools uses **Playwright** for end-to-end testing. Tests run automatically on every pull request via GitHub Actions, ensuring code quality and preventing regressions.

### Technology Stack

- **Test Framework**: Playwright (@playwright/test)
- **Browser**: Chromium (can be extended to Firefox and WebKit)
- **CI/CD**: GitHub Actions
- **Language**: TypeScript

### Running Tests Locally

#### Prerequisites

Ensure all dependencies are installed:

```bash
npm install
```

#### Test Commands

```bash
# Run all tests
npm test

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests with Playwright Inspector
npm run test:debug

# View last test report
npm run test:report
```

#### First Time Setup

If you haven't installed Playwright browsers yet:

```bash
npx playwright install chromium
```

### Test Structure

Tests are organized in the `tests/` directory:

```
tests/
├── home.spec.ts                    # Home page tests
├── navigation.spec.ts              # Navigation and routing tests
├── about.spec.ts                   # About page tests
└── calculators/
    ├── tip-calculator.spec.ts      # Tip calculator tests
    ├── loan-calculator.spec.ts     # Loan calculator tests
    ├── bmi-calculator.spec.ts      # BMI calculator tests
    ├── pregnancy-calculator.spec.ts # Pregnancy calculator tests
    ├── discount-calculator.spec.ts  # Discount calculator tests
    ├── age-calculator.spec.ts       # Age calculator tests
    └── unit-converter.spec.ts       # Unit converter tests
```

### Test Coverage

Current test coverage includes:

1. **Home Page**
   - Page loads successfully
   - Main heading displays
   - All calculator cards are visible
   - Navigation menu is present
   - Calculator links work
   - Responsive design on mobile

2. **Navigation**
   - Home navigation from logo
   - About page navigation
   - Analytics dashboard navigation
   - Browser back/forward buttons

3. **Calculator Pages** (All calculators)
   - Page loads with correct title
   - Input fields are present
   - Basic calculations work
   - Invalid input handling
   - Responsive design on mobile

4. **About Page**
   - Page loads correctly
   - Content displays properly
   - Responsive design

### GitHub Actions CI/CD

Tests run automatically on:
- Pull requests to `main` or `master` branches
- Pushes to `main` or `master` branches

#### Workflow Configuration

The GitHub Actions workflow is defined in `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps chromium
    - name: Run Playwright tests
      run: npm test
    - name: Upload test report
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

#### Viewing Test Reports in CI

If tests fail in CI:
1. Go to the GitHub Actions tab
2. Click on the failed workflow run
3. Download the `playwright-report` artifact
4. Extract and open `index.html` to view the detailed report

---

## Development Workflow

### For AI Agents

When working on this project, follow this workflow:

#### 1. Pull Latest Changes

```bash
git pull origin claude/add-playwright-testing-01QqfXidTQVjF8woLh2Fw74N
```

#### 2. Make Your Changes

- Add new features
- Fix bugs
- Update documentation

#### 3. Run Tests Locally

```bash
npm test
```

Ensure all tests pass before committing.

#### 4. Add New Tests (If Applicable)

If you added new features, write corresponding tests. See [Adding New Tests](#adding-new-tests) below.

#### 5. Commit and Push

```bash
git add .
git commit -m "Description of changes"
git push -u origin claude/add-playwright-testing-01QqfXidTQVjF8woLh2Fw74N
```

#### 6. Create Pull Request

Tests will run automatically on the PR. Ensure they pass before merging.

---

## Project Structure

### Key Files and Directories

```
money_maker_site/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions workflow
├── src/
│   ├── components/                 # Reusable React components
│   │   ├── ui/                     # Shadcn UI components
│   │   ├── Layout.tsx              # Main layout wrapper
│   │   ├── SEO.tsx                 # SEO meta tags
│   │   ├── AdSense.tsx             # Ad integration
│   │   └── ABTest.tsx              # A/B testing component
│   ├── config/
│   │   ├── tools.tsx               # Tool registry
│   │   └── abTests.ts              # A/B test configurations
│   ├── context/
│   │   └── ABTestingContext.tsx    # A/B testing state
│   ├── hooks/
│   │   └── useAnalytics.ts         # Analytics hook
│   ├── lib/
│   │   ├── analytics.ts            # Analytics utilities
│   │   └── utils.ts                # General utilities
│   ├── pages/                      # Page components
│   │   ├── Home.tsx
│   │   ├── TipCalculator.tsx
│   │   ├── LoanCalculator.tsx
│   │   ├── BMICalculator.tsx
│   │   ├── PregnancyCalculator.tsx
│   │   ├── DiscountCalculator.tsx
│   │   ├── AgeCalculator.tsx
│   │   ├── SplitBillCalculator.tsx
│   │   ├── UnitConverter.tsx
│   │   └── AnalyticsDashboard.tsx
│   ├── App.tsx                     # Main app component
│   └── main.tsx                    # Entry point
├── tests/                          # Playwright tests
│   ├── home.spec.ts
│   ├── navigation.spec.ts
│   ├── about.spec.ts
│   └── calculators/
│       └── *.spec.ts
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Dependencies and scripts
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS config
├── tsconfig.json                   # TypeScript config
├── README.md                       # Project documentation
└── AGENTS.md                       # This file
```

---

## Adding New Features

### Adding a New Calculator

When adding a new calculator, follow these steps:

#### 1. Create the Calculator Component

Create a new file in `src/pages/YourCalculator.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdPlaceholder } from '@/components/AdSense';

export function YourCalculator() {
  useEffect(() => {
    document.title = 'Your Calculator - Description | QuickCalc Tools';
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Calculator</h1>
      {/* Add your calculator UI here */}
      <AdPlaceholder label="Calculator Ad" />
    </div>
  );
}
```

#### 2. Register in Tool Config

Edit `src/config/tools.tsx`:

```tsx
import { YourCalculator } from '@/pages/YourCalculator';

// Add to tools array:
{
  name: 'Your Calculator',
  path: '/your-calculator',
  component: YourCalculator,
  description: 'Brief description',
  icon: Calculator,
  color: 'text-blue-600',
  bgColor: 'bg-blue-50',
  title: 'Your Calculator - SEO Title | QuickCalc Tools',
  metaDescription: 'SEO meta description',
  keywords: ['keyword1', 'keyword2'],
  searchVolume: 'high'
}
```

#### 3. Add Tests

Create `tests/calculators/your-calculator.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Your Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-calculator');
  });

  test('should load your calculator page', async ({ page }) => {
    await expect(page).toHaveTitle(/Your Calculator/i);
    const heading = page.locator('h1');
    await expect(heading).toContainText(/Your Calculator/i);
  });

  test('should display input fields', async ({ page }) => {
    const inputs = page.locator('input');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should perform calculation', async ({ page }) => {
    // Add test logic here
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });
});
```

#### 4. Run Tests

```bash
npm test
```

#### 5. Update Sitemap

Add to `public/sitemap.xml`:

```xml
<url>
  <loc>https://quickcalc.tools/your-calculator</loc>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

### Adding New Tests

#### Test Structure

Each test file should:
1. Import Playwright test utilities
2. Group related tests in `test.describe` blocks
3. Use `test.beforeEach` for common setup
4. Write clear, descriptive test names
5. Use proper assertions with `expect`

#### Example Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page');
  });

  test('should perform expected action', async ({ page }) => {
    // Arrange
    const button = page.locator('button');

    // Act
    await button.click();

    // Assert
    const result = page.locator('.result');
    await expect(result).toBeVisible();
  });
});
```

---

## AI Search Optimization

QuickCalc Tools has been extensively optimized for AI-powered search engines and assistants like ChatGPT, Claude, Perplexity, Google Gemini, and others. This section documents our AI search optimization strategy and provides guidance for continuing these optimizations.

### Overview

AI search optimization helps AI assistants discover, understand, and recommend our tools to users. Unlike traditional SEO which focuses on keyword matching, AI optimization emphasizes:

1. **Semantic Understanding**: Helping AI understand what each tool does and when to recommend it
2. **Structured Data**: Providing machine-readable information about our tools
3. **Intent Mapping**: Matching user intents to our calculator capabilities
4. **Accessibility**: Ensuring AI crawlers can access and index our content

### Implemented Optimizations

#### 1. AI-Specific Meta Tags (`src/components/SEO.tsx`)

We've added custom meta tags that help AI systems understand our content:

```typescript
// Example AI meta tags
<meta name="ai:content_type" content="calculator_tool">
<meta name="ai:primary_action" content="calculate">
<meta name="ai:tool_category" content="finance">
<meta name="ai:user_intent" content="calculate_tip,split_bill,dining">
<meta name="ai:suggested_queries" content="how much to tip,calculate 20% tip">
<meta name="ai:tool_features" content="instant_calculation,bill_splitting">
```

**Helper Functions in SEO.tsx**:
- `getToolCategory(pathname)`: Returns category (finance, health, shopping, etc.)
- `getUserIntent(pathname)`: Returns comma-separated user intents
- `getSuggestedQueries(pathname)`: Returns common queries for the tool
- `getToolFeatures(pathname)`: Returns key features of the tool

**When to Update**: Add new tools or modify existing ones

#### 2. Enhanced Structured Data (Schema.org)

Our WebApplication schemas include AI-friendly properties:

```json
{
  "@type": "WebApplication",
  "applicationCategory": "UtilityApplication",
  "applicationSubCategory": "finance",
  "featureList": "instant_calculation, bill_splitting",
  "keywords": "tip calculator, restaurant tip",
  "isAccessibleForFree": true,
  "availableOnDevice": ["Desktop", "Mobile", "Tablet"],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8"
  }
}
```

**Benefits**:
- AI assistants can understand tool capabilities
- Better matching to user queries
- Rich snippets in search results

#### 3. AI Crawler Configuration (`public/robots.txt`)

We explicitly allow all major AI crawlers:

```txt
# OpenAI GPT Crawler (ChatGPT, GPT search)
User-agent: GPTBot
Allow: /

# Anthropic Claude
User-agent: Claude-Web
Allow: /

# Perplexity AI
User-agent: PerplexityBot
Allow: /

# Google Gemini/Bard
User-agent: Google-Extended
Allow: /

# ... and many more
```

**Current AI Crawlers Supported**:
- GPTBot (OpenAI)
- Claude-Web, anthropic-ai (Anthropic)
- PerplexityBot (Perplexity)
- Google-Extended (Google Gemini)
- CCBot (Common Crawl - used by many AI models)
- FacebookBot, Meta-ExternalAgent (Meta AI)
- Applebot (Apple Intelligence)
- cohere-ai (Cohere)
- YouBot (You.com)
- Diffbot, AI2Bot, and more

#### 4. AI Tools Catalog (`public/ai-tools-catalog.json`)

A machine-readable JSON file that provides complete information about all our tools in one place:

```json
{
  "tools": [
    {
      "@type": "WebApplication",
      "name": "Tip Calculator",
      "category": "finance",
      "features": ["instant_calculation", "bill_splitting"],
      "userIntents": ["calculate_tip", "split_bill"],
      "suggestedQueries": ["how much to tip"],
      "isAccessibleForFree": true,
      "requiresSignup": false
    }
  ]
}
```

**Purpose**:
- Single source of truth for AI systems
- Faster tool discovery
- Batch processing by AI indexers
- API-like access to our catalog

#### 5. AI-Friendly HTML Meta Tags (`index.html`)

Global meta tags that describe the entire site:

```html
<meta name="ai:content_type" content="web_application">
<meta name="ai:site_purpose" content="provide free online calculators">
<meta name="ai:cost" content="free">
<meta name="ai:signup_required" content="no">
```

### Best Practices for AI Search Optimization

#### 1. Semantic HTML Structure

- Use proper heading hierarchy (h1, h2, h3)
- Semantic elements (`<article>`, `<section>`, `<nav>`)
- Descriptive ARIA labels
- Clear, natural language content

#### 2. Content Optimization

**DO**:
- Write in natural, conversational language
- Answer common questions directly
- Provide context and explanations
- Use real-world examples
- Structure content with clear sections

**DON'T**:
- Keyword stuff
- Use jargon without explanation
- Hide content from users
- Duplicate content across pages
- Use misleading descriptions

#### 3. Intent Mapping

When adding new tools, map user intents carefully:

```typescript
// Good: Specific, actionable intents
'calculate_tip,split_bill,dining,restaurant_expenses'

// Bad: Generic, vague intents
'calculate,money,numbers'
```

**Think about**:
- What problem does this tool solve?
- What would users say to an AI assistant?
- What are related tasks/questions?
- What's the user's end goal?

#### 4. Suggested Queries

Provide natural language queries that users might ask:

```typescript
// Good: Natural questions
'how much to tip,calculate 20% tip,split restaurant bill'

// Bad: Robotic keywords
'tip,calculator,percentage'
```

#### 5. Feature Descriptions

Be specific and actionable:

```typescript
// Good: Descriptive features
'instant_calculation,bill_splitting,customizable_tip_percentage,pdf_export'

// Bad: Generic features
'fast,good,useful'
```

### Adding AI Optimization to New Tools

When creating a new calculator, follow these steps:

#### Step 1: Update Helper Functions in `src/components/SEO.tsx`

```typescript
function getToolCategory(pathname: string): string {
  const categories: Record<string, string> = {
    // ... existing categories
    '/your-calculator': 'your_category', // ADD THIS
  };
  return categories[pathname] || 'utility';
}

function getUserIntent(pathname: string): string {
  const intents: Record<string, string> = {
    // ... existing intents
    '/your-calculator': 'intent1,intent2,intent3', // ADD THIS
  };
  return intents[pathname] || 'calculate,utility';
}

function getSuggestedQueries(pathname: string): string {
  const queries: Record<string, string> = {
    // ... existing queries
    '/your-calculator': 'query1,query2,query3', // ADD THIS
  };
  return queries[pathname] || 'online calculator';
}

function getToolFeatures(pathname: string): string {
  const features: Record<string, string> = {
    // ... existing features
    '/your-calculator': 'feature1,feature2,feature3', // ADD THIS
  };
  return features[pathname] || 'free,fast,accurate';
}
```

#### Step 2: Add FAQs in `generateFAQs()` function

```typescript
function generateFAQs(pathname: string): any[] {
  const faqMap: Record<string, any[]> = {
    // ... existing FAQs
    '/your-calculator': [
      {
        '@type': 'Question',
        'name': 'Common question about your tool?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Clear, helpful answer...',
        },
      },
      // Add 2-4 FAQs per tool
    ],
  };
  return faqMap[pathname] || [];
}
```

#### Step 3: Update AI Tools Catalog (`public/ai-tools-catalog.json`)

Add your tool to the `tools` array:

```json
{
  "@type": "WebApplication",
  "name": "Your Calculator",
  "url": "https://quickcalc.tools/your-calculator",
  "description": "Clear description of what it does",
  "category": "category_name",
  "subcategory": "subcategory_name",
  "features": ["feature1", "feature2"],
  "userIntents": ["intent1", "intent2"],
  "suggestedQueries": ["query1", "query2"],
  "keywords": ["keyword1", "keyword2"],
  "searchVolume": "high|medium|low",
  "isAccessibleForFree": true,
  "requiresSignup": false
}
```

#### Step 4: Verify SEO Component Usage

Ensure your page component is wrapped by the SEO component (this should be automatic via Layout.tsx).

### Testing AI Optimization

#### Manual Testing

1. **Test with AI Assistants**:
   - Ask ChatGPT: "I need to calculate a tip for a $50 meal"
   - Ask Claude: "Help me calculate my BMI"
   - Ask Perplexity: "What's a good loan calculator?"

   Monitor if they recommend QuickCalc Tools.

2. **Check Structured Data**:
   - Use [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Validate JSON-LD schemas
   - Ensure no errors or warnings

3. **Verify Meta Tags**:
   - View page source
   - Check all AI meta tags are present
   - Confirm values are accurate

#### Automated Testing

Consider adding tests for:

```typescript
test('should have AI meta tags', async ({ page }) => {
  await page.goto('/tip-calculator');

  const contentType = await page.locator('meta[name="ai:content_type"]').getAttribute('content');
  expect(contentType).toBe('calculator_tool');

  const category = await page.locator('meta[name="ai:tool_category"]').getAttribute('content');
  expect(category).toBeTruthy();
});
```

### Monitoring AI Search Performance

Track these metrics:

1. **Referral Sources**:
   - Monitor traffic from AI assistants
   - Check referrer headers for AI platforms
   - Use UTM parameters when possible

2. **Search Queries**:
   - Review Google Search Console queries
   - Identify AI-like natural language queries
   - Track "how to", "calculate", question-based queries

3. **User Behavior**:
   - Lower bounce rates (AI-referred users are often more targeted)
   - Higher engagement (AI pre-qualifies intent)
   - Tool completion rates

### Future AI Optimization Opportunities

#### Short Term (Next 3-6 months)

1. **Enhanced Content**:
   - Add "How It Works" sections to each calculator
   - Create "Common Use Cases" sections
   - Add worked examples with real numbers
   - Include tips and best practices

2. **More Structured Data**:
   - Add HowTo schemas for each calculator
   - Implement VideoObject schemas if we add tutorials
   - Add SoftwareSourceCode schemas for API documentation

3. **AI-Specific Features**:
   - Add a "Share with AI" button (generates AI-friendly summaries)
   - Create calculation result templates for easy copying
   - Implement AI-readable result formats

4. **Content Optimization**:
   - Add more natural language explanations
   - Create comparison guides (e.g., "Tip Calculator vs. Split Bill Calculator")
   - Write educational content about calculations

#### Medium Term (6-12 months)

1. **AI API Integration**:
   - Create a public API for AI assistants to access our calculators
   - Implement OpenAPI/Swagger documentation
   - Add rate limiting and usage tracking
   - Consider AI-specific endpoints

2. **Voice Assistant Optimization**:
   - Add SSML (Speech Synthesis Markup Language) support
   - Create voice-friendly result formats
   - Optimize for voice queries ("Hey Siri, calculate my tip")

3. **Multilingual Support**:
   - Add translations for major languages
   - Implement hreflang tags
   - Create language-specific structured data
   - Support international AI assistants

4. **Enhanced Analytics**:
   - Track AI crawler visits
   - Monitor AI-specific referrers
   - A/B test AI-optimized content
   - Measure AI search conversion rates

#### Long Term (12+ months)

1. **AI-First Features**:
   - Natural language input ("I ate at a restaurant and spent $50")
   - Conversational interfaces
   - AI-powered recommendations
   - Smart defaults based on user context

2. **Knowledge Graph Integration**:
   - Submit to Google Knowledge Graph
   - Create Wikipedia pages for calculator types
   - Build backlinks from authoritative sources
   - Engage with AI training data providers

3. **Specialized AI Crawlers**:
   - Monitor new AI crawler user agents
   - Adapt to new AI platforms (e.g., new search engines)
   - Optimize for vertical AI assistants (finance AI, health AI, etc.)
   - Create partnerships with AI platforms

4. **User-Generated Content**:
   - Allow users to share calculations
   - Create a community of calculator use cases
   - Build a knowledge base of common scenarios
   - Implement social proof and testimonials

### Common Issues and Solutions

#### Issue: AI assistants not recommending our tools

**Solutions**:
- Ensure robots.txt allows the specific AI crawler
- Verify structured data is valid
- Check that content matches user intents
- Add more natural language content
- Include more FAQs and use cases

#### Issue: Wrong tool being recommended

**Solutions**:
- Review and refine user intent mappings
- Make tool descriptions more specific
- Add negative keywords (what the tool is NOT for)
- Improve suggested queries
- Add more distinguishing features

#### Issue: Low engagement from AI referrals

**Solutions**:
- Ensure landing page matches AI's description
- Add clear CTAs immediately visible
- Reduce cognitive load (simplify interface)
- Pre-fill sensible defaults
- Add "As seen on ChatGPT" badge for social proof

#### Issue: Structured data errors

**Solutions**:
- Use Google's Rich Results Test tool
- Validate JSON-LD syntax
- Ensure all required fields are present
- Check for typos in @type values
- Test across different calculators

### Resources

#### Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Documentation](https://schema.org/)
- [OpenGraph Protocol](https://ogp.me/)
- [JSON-LD Playground](https://json-ld.org/playground/)
- [Robots.txt Validator](https://www.google.com/webmasters/tools/robots-testing-tool)

#### AI Crawler Documentation

- [OpenAI GPTBot](https://platform.openai.com/docs/gptbot)
- [Anthropic Claude Web Crawler](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Google-Extended](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)
- [Common Crawl](https://commoncrawl.org/)
- [Perplexity Bot](https://docs.perplexity.ai/docs/perplexitybot)

#### Learning Resources

- [AI Search Optimization Guide](https://www.searchenginejournal.com/ai-search-optimization/)
- [Optimizing for AI-Powered Search](https://moz.com/blog/ai-search-optimization)
- [Schema.org for AI](https://schema.org/docs/gs.html)

### Maintenance Checklist

**Monthly**:
- [ ] Check for new AI crawler user agents
- [ ] Review AI-referred traffic in analytics
- [ ] Validate structured data (run Rich Results Test)
- [ ] Monitor for AI crawl errors in server logs

**Quarterly**:
- [ ] Update ai-tools-catalog.json with new tools
- [ ] Review and refresh suggested queries
- [ ] Test with major AI assistants manually
- [ ] Analyze top AI search queries
- [ ] Update FAQ schemas with new common questions

**Annually**:
- [ ] Comprehensive AI optimization audit
- [ ] Review and update all meta tags
- [ ] Benchmark against competitors
- [ ] Evaluate new AI search platforms
- [ ] Update this documentation

---

## Best Practices

### For AI Agents Working on This Project

#### 1. Always Run Tests

- Run tests before committing: `npm test`
- Fix failing tests immediately
- Don't skip or comment out failing tests

#### 2. Write Tests for New Features

- Every new calculator needs tests
- Every new page needs tests
- Test both happy paths and error cases

#### 3. Keep Tests Maintainable

- Use descriptive test names
- Avoid hardcoding values when possible
- Use page objects for complex pages
- Keep tests independent (no shared state)

#### 4. Follow TypeScript Best Practices

- Enable strict type checking
- Avoid `any` types
- Use proper type definitions

#### 5. Responsive Design

- Test on mobile viewports (375x667)
- Test on desktop viewports (1920x1080)
- Ensure all features work on both

#### 6. Performance

- Keep tests fast (avoid unnecessary waits)
- Use `waitForTimeout` sparingly
- Prefer `waitForSelector` or `waitForLoadState`

#### 7. Code Quality

- Follow existing code patterns
- Use ESLint configuration
- Format code consistently
- Add comments for complex logic

#### 8. Documentation

- Update README.md when adding features
- Update this file (AGENTS.md) when changing workflows
- Add JSDoc comments for complex functions

#### 9. Git Workflow

- Commit frequently with clear messages
- Push to the correct branch
- Create descriptive pull requests
- Link issues when applicable

#### 10. CI/CD

- Ensure GitHub Actions pass before merging
- Check test reports for failures
- Don't merge failing PRs

### Common Playwright Patterns

#### Waiting for Elements

```typescript
// Good
await page.waitForSelector('.result');
await expect(page.locator('.result')).toBeVisible();

// Avoid
await page.waitForTimeout(1000); // Only use when absolutely necessary
```

#### Locator Strategies

```typescript
// Prefer semantic locators
await page.locator('role=button[name="Submit"]').click();
await page.getByLabel('Email').fill('test@example.com');

// Fallback to CSS selectors
await page.locator('.submit-button').click();
await page.locator('input[type="email"]').fill('test@example.com');
```

#### Assertions

```typescript
// Use Playwright assertions
await expect(page).toHaveTitle(/Expected Title/);
await expect(element).toBeVisible();
await expect(element).toContainText('Expected text');

// Avoid generic assertions
expect(await element.isVisible()).toBe(true); // Less reliable
```

---

## Troubleshooting

### Tests Failing Locally

1. Ensure dev server is running on port 5173
2. Check Playwright browsers are installed: `npx playwright install chromium`
3. Run with UI mode to debug: `npm run test:ui`
4. Check test reports: `npm run test:report`

### Tests Failing in CI

1. Check GitHub Actions logs
2. Download playwright-report artifact
3. Review screenshots and traces
4. Ensure CI environment matches local setup

### Common Issues

#### Issue: "Page did not navigate to expected URL"

**Solution**: Check that routes are properly configured in `App.tsx`

#### Issue: "Element not found"

**Solution**:
- Verify the element exists on the page
- Check selector is correct
- Add proper wait conditions

#### Issue: "Tests timeout"

**Solution**:
- Increase timeout in playwright.config.ts
- Optimize slow operations
- Check for infinite loops or hanging promises

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [React Testing Guide](https://react.dev/learn/testing)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## Contact

For questions or issues:
- Open a GitHub issue
- Check existing documentation
- Review test examples in `tests/` directory

---

**Last Updated**: 2025-11-18
**Version**: 1.1.0 - Added AI Search Optimization section
