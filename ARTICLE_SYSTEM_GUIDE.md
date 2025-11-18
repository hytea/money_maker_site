# SEO Article System Guide

This guide explains how to use the new SEO article system to create trending topic articles that drive organic traffic to your calculator website.

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Getting Started](#getting-started)
4. [Creating Articles](#creating-articles)
5. [Trending Topics Discovery](#trending-topics-discovery)
6. [SEO Best Practices](#seo-best-practices)
7. [AI-Assisted Writing](#ai-assisted-writing)
8. [Firestore Setup](#firestore-setup)
9. [Advanced Features](#advanced-features)

---

## Overview

The SEO Article System helps you:

- **Create SEO-optimized articles** that rank in search engines
- **Discover trending topics** related to your calculators
- **Generate AI writing prompts** for article creation
- **Manage and publish** articles from an admin dashboard
- **Track article performance** with view counts and analytics

### Key Features

✅ Full CRUD article management
✅ Trending topic discovery (Google Trends integration)
✅ AI-powered article generation prompts
✅ SEO guidelines and checklist
✅ Markdown content editor
✅ Related articles suggestions
✅ Category-based organization
✅ Tag and keyword management
✅ View tracking
✅ Featured articles

---

## System Architecture

### Frontend Pages

**Public Pages:**
- `/articles` - Article list page (browse all published articles)
- `/articles/:slug` - Individual article page

**Admin Pages (Protected):**
- `/admin/articles` - Article management dashboard
- `/admin/articles/create` - Create new article
- `/admin/articles/edit/:id` - Edit existing article
- `/admin/articles/trending` - Trending topics discovery

### Database Structure (Firestore)

**Collection:** `articles`

```typescript
{
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown format
  excerpt: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  focusKeyword: string;

  // Organization
  category: CalculatorCategory;
  relatedTools: string[];
  tags: string[];

  // Trending
  trendingTopics: TrendingTopic[];
  targetSearchQueries: string[];

  // Meta
  author: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  views: number;
  featured: boolean;

  // AI
  aiGenerated: boolean;
  aiPrompt: string;
  aiModel: string;
}
```

---

## Getting Started

### 1. Enable Firestore

You need to enable Firestore in your Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on "Firestore Database" in the left menu
4. Click "Create database"
5. Choose production mode (or test mode for development)
6. Select your database location
7. Click "Enable"

### 2. Set Firestore Security Rules

In the Firebase Console, go to Firestore Database > Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Articles collection
    match /articles/{articleId} {
      // Anyone can read published articles
      allow read: if resource.data.status == 'published' || request.auth != null;

      // Only authenticated users can write
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

### 3. Access the Admin Panel

1. Navigate to `/login`
2. Sign in with Google
3. You'll be redirected to `/admin`
4. Click on "Article Management"

---

## Creating Articles

### Method 1: Manual Creation

1. **Go to Article Management**
   - Navigate to `/admin/articles`
   - Click "New Article"

2. **Fill in Basic Information**
   - **Title**: Your article title (e.g., "How to Calculate Restaurant Tips in 2025")
   - **Slug**: Auto-generated URL-friendly slug
   - **Excerpt**: 140-160 character summary
   - **Category**: Select related calculator category

3. **Write Content**
   - Write your article in **Markdown format**
   - Use headings (H1, H2, H3) for structure
   - Add bullet points and numbered lists
   - Include links to related calculators

4. **SEO Settings**
   - **Focus Keyword**: Main keyword to target
   - **Keywords**: Additional related keywords
   - **Meta Title**: 50-60 characters (optional, defaults to title)
   - **Meta Description**: 140-160 characters (optional, defaults to excerpt)

5. **Related Content**
   - **Related Tools**: Link to calculator pages (e.g., `/tip-calculator`)
   - **Tags**: Add relevant tags

6. **Publish**
   - Click "Save Draft" to save without publishing
   - Click "Publish" to make the article live

### Method 2: AI-Assisted Creation

1. **Generate Article Suggestions**
   - Go to `/admin/articles/trending`
   - Select a calculator category
   - Click "Generate Suggestions"
   - Browse suggested article ideas

2. **Create from Suggestion**
   - Click "Create Article" on a suggestion
   - Basic fields will be pre-filled
   - Click "Show AI Prompt" in the sidebar

3. **Use AI to Write Content**
   - Copy the generated AI prompt
   - Paste into ChatGPT, Claude, or your preferred AI
   - Copy the AI-generated markdown content
   - Paste into the Content field
   - Review and edit as needed

4. **Optimize and Publish**
   - Check the SEO Checklist in the sidebar
   - Make any necessary adjustments
   - Publish when ready

---

## Trending Topics Discovery

The trending topics feature helps you identify high-value article opportunities.

### Automated Discovery

1. **Navigate to Trending Topics**
   - Go to `/admin/articles/trending`

2. **Select Category**
   - Choose a calculator category (e.g., "tip-calculator")
   - The system will use pre-configured keywords for that category

3. **Add Custom Keywords** (Optional)
   - Enter additional keywords separated by commas
   - Click "Generate Suggestions"

4. **Review Suggestions**
   - Suggestions are organized by urgency:
     - **High Priority**: Time-sensitive topics
     - **Medium Priority**: Evergreen opportunities
     - **Low Priority**: Consider for content calendar

5. **Create Article**
   - Click "Create Article" on any suggestion
   - The article editor will open with pre-filled data

### Manual Topic Entry

If you've researched topics on Google Trends manually:

1. **Enter Topic Details**
   - Keyword: The trending search term
   - Search Volume: Interest score (0-100 from Google Trends)
   - Trend: Rising, Steady, or Declining

2. **Add to List**
   - Click "Add Topic" to save
   - Use these topics for article planning

### Research Resources

The system provides quick links to:
- **Google Trends** - Discover what people are searching for
- **AnswerThePublic** - Find question-based searches
- **Ahrefs Keyword Generator** - Keyword research tool

---

## SEO Best Practices

### Content Structure

✅ **Title**: Include focus keyword, 50-60 characters
✅ **First Paragraph**: Mention focus keyword in first 100 words
✅ **Headings**: Use H2 for main sections, H3 for subsections
✅ **Word Count**: Aim for 1,200-1,800 words
✅ **Paragraphs**: Keep to 2-4 sentences each

### Keyword Usage

✅ **Keyword Density**: 1-2% of total content
✅ **Variations**: Use related terms and synonyms
✅ **Natural Integration**: Don't force keywords
✅ **Headings**: Include keyword in at least one H2

### Internal Linking

✅ **Minimum 3 Internal Links**: Link to related calculators
✅ **Descriptive Anchor Text**: Use meaningful link text
✅ **Related Tools**: Always link to the calculator the article relates to

### External Linking

✅ **1-2 Authoritative Sources**: Link to .gov, .edu, or industry sites
✅ **Open in New Tab**: External links should open in new tab
✅ **Credibility**: Only link to trustworthy sources

### Meta Information

✅ **Meta Title**: 50-60 characters, includes focus keyword
✅ **Meta Description**: 140-160 characters, compelling summary
✅ **URL Slug**: Short, keyword-rich, readable

---

## AI-Assisted Writing

### Using the AI Prompt Generator

1. **Fill in Article Details**
   - Complete the basic information fields
   - Add focus keyword and category
   - Add any keywords or tags

2. **Generate Prompt**
   - Click "Show AI Prompt" in the sidebar
   - Review the generated prompt
   - Click "Copy Prompt"

3. **Use with AI Tool**
   - Paste into ChatGPT (GPT-4 recommended)
   - Or use Claude, Gemini, or other AI
   - The AI will generate SEO-optimized content

4. **Review and Edit**
   - Copy the AI-generated content
   - Paste into the Content field
   - Review for accuracy and brand voice
   - Add any missing information
   - Verify all links work

### AI Prompt Template

The system generates a comprehensive prompt that includes:

- **SEO Requirements**: Focus keyword, density, structure
- **Content Quality Guidelines**: Tone, length, readability
- **Trending Topic Integration**: Current trends to mention
- **Internal/External Linking**: What to link to
- **Search Intent**: What users are looking for
- **Writing Style**: Voice and formatting preferences

### Best Practices

✅ **Always Review AI Content**: Don't publish without editing
✅ **Verify Facts**: Check statistics and claims
✅ **Add Personal Touch**: Customize to your brand voice
✅ **Check Links**: Ensure all links are correct
✅ **Mark as AI-Generated**: Enable the "AI Generated" checkbox

---

## Firestore Setup

### Environment Variables

Ensure your `.env` file has these Firebase variables:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Firestore Indexes

For optimal performance, create these composite indexes:

1. **Published Articles by Category**
   - Collection: `articles`
   - Fields: `status` (Ascending), `category` (Ascending), `createdAt` (Descending)

2. **Featured Articles**
   - Collection: `articles`
   - Fields: `status` (Ascending), `featured` (Ascending), `publishedAt` (Descending)

To create indexes:
1. Go to Firebase Console > Firestore Database > Indexes
2. Click "Add Index"
3. Add the fields as specified above

---

## Advanced Features

### Google Trends API Integration (Optional)

For automated trending topic discovery, you can integrate with Google Trends via SerpApi:

1. **Get SerpApi Key**
   - Sign up at [SerpApi](https://serpapi.com/)
   - Get your API key

2. **Add to Environment**
   ```env
   VITE_SERPAPI_KEY=your-serpapi-key
   ```

3. **Use Automated Trending**
   - The system will automatically fetch real Google Trends data
   - No manual entry needed

### Article Templates

The system includes pre-built templates:

- **How-To Guide**: Step-by-step instructions
- **Ultimate Guide**: Comprehensive coverage
- **Trending Topic**: Capitalize on current trends
- **Comparison**: Compare different approaches
- **Listicle**: Numbered list articles

### Bulk Operations

For managing multiple articles:

1. Use the search feature on `/admin/articles`
2. Filter by category or status
3. Delete multiple articles (one at a time for safety)

### SEO Checklist

Every article editor includes a built-in SEO checklist with 25+ items to verify:

- ✓ Focus keyword placement
- ✓ Title optimization
- ✓ Content structure
- ✓ Internal/external links
- ✓ Meta information
- ✓ Readability
- And more...

---

## Workflow Example

Here's a complete workflow for creating a trending article:

### Day 1: Research

1. Visit Google Trends
2. Search for "tip calculator" + current date
3. Find rising topics (e.g., "2025 tipping etiquette changes")
4. Note the search volume and related queries

### Day 2: Create Article

1. Go to `/admin/articles/trending`
2. Enter trending topic manually or generate suggestions
3. Click "Create Article" on top suggestion
4. Fill in all SEO fields
5. Click "Show AI Prompt"
6. Copy prompt to ChatGPT

### Day 3: AI Generation

1. Paste prompt into ChatGPT (GPT-4)
2. Review the generated content
3. Copy markdown output
4. Paste into article content field

### Day 4: Review & Optimize

1. Review AI content for accuracy
2. Add your brand voice
3. Verify all calculator links work
4. Check SEO checklist
5. Add 2-3 related articles
6. Add high-quality tags

### Day 5: Publish & Monitor

1. Click "Publish"
2. Share on social media
3. Monitor views in Article Management
4. Track performance in Analytics

---

## Tips for Success

### Content Creation

✅ **Publish Consistently**: Aim for 1-2 articles per week
✅ **Focus on Trends**: Capitalize on rising search terms
✅ **Link Internally**: Every article should link to 3+ calculators
✅ **Update Regularly**: Refresh old articles annually

### SEO Optimization

✅ **Target Long-Tail Keywords**: Specific phrases with less competition
✅ **Answer Questions**: Focus on "how to" and "what is" queries
✅ **Use Rich Formatting**: Headers, lists, bold text
✅ **Mobile-Friendly**: Keep paragraphs short

### Performance Tracking

✅ **Monitor Views**: Check which articles perform best
✅ **Analyze Traffic**: Use Google Analytics
✅ **Update Winners**: Improve high-performing articles
✅ **Archive Losers**: Remove or update underperforming content

---

## Troubleshooting

### Firestore Permission Denied

**Problem**: Can't create/edit articles
**Solution**: Check Firebase security rules, ensure you're logged in

### Slug Conflicts

**Problem**: "Slug already exists" error
**Solution**: Change the slug to make it unique

### AI Prompt Not Working

**Problem**: AI generates poor content
**Solution**: Add more specific keywords and category information

### Articles Not Showing

**Problem**: Published articles don't appear
**Solution**: Verify status is "published", check Firestore rules

---

## Next Steps

1. **Enable Firestore** in your Firebase project
2. **Create your first article** manually to understand the system
3. **Explore trending topics** for your calculator categories
4. **Set up a content calendar** for regular publishing
5. **Monitor performance** and iterate

For questions or issues, refer to the codebase documentation or Firebase Console.

---

## File Structure

```
src/
├── types/
│   └── article.ts              # Article type definitions
├── config/
│   └── seoGuidelines.ts        # SEO templates and guidelines
├── lib/
│   ├── articleService.ts       # Firestore CRUD operations
│   └── trendingTopics.ts       # Trending topic discovery
├── pages/
│   ├── ArticleList.tsx         # Public article listing
│   ├── ArticlePage.tsx         # Public article detail
│   ├── ArticleManagement.tsx   # Admin article dashboard
│   ├── ArticleEditor.tsx       # Admin article editor
│   └── TrendingTopicsDiscovery.tsx  # Trending topic tool
└── config/
    └── firebase.ts             # Firebase/Firestore config
```

---

**Happy Writing! 🚀**
