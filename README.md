# QuickCalc Tools - Monetizable Calculator Website

A high-traffic, SEO-optimized calculator and converter website built with React, TypeScript, Vite, Tailwind CSS, and Shadcn UI. Designed to drive organic traffic through search engines and generate revenue via advertising.

## Features

- **8 Popular Calculators**: Tip, Loan, Pregnancy, BMI, Discount, Age, Split Bill, and Unit Converter
- **AI-Powered Insights**: Agentic AI integration with OpenRouter for personalized recommendations
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, sitemap, and robots.txt
- **Ad-Ready**: Google AdSense integration points throughout
- **Mobile Responsive**: Works perfectly on all devices
- **Fast & Lightweight**: Built with Vite for optimal performance
- **Easy to Extend**: Config-driven architecture for adding new tools and AI providers

## Tech Stack

- **React 19** - Modern UI library
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - High-quality components
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit http://localhost:5173

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Deploy to Netlify

1. **Connect to Netlify**:
   - Push your code to GitHub
   - Go to https://app.netlify.com
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub repository
   - Netlify will auto-detect the build settings from `netlify.toml`

2. **Configure Analytics & Ads** (optional):
   - Get a Google Analytics tracking ID from https://analytics.google.com
   - Apply for Google AdSense at https://www.google.com/adsense
   - Add environment variables in Netlify:
     - Go to Site settings > Environment variables
     - Add `VITE_GA_MEASUREMENT_ID` with your Google Analytics ID
     - Add `VITE_ADSENSE_PUBLISHER_ID` with your AdSense publisher ID

3. **Custom Domain** (optional):
   - Go to Site settings > Domain management
   - Add your custom domain

## Environment Variables

This project uses environment variables for configuring third-party services like Google Analytics and AdSense.

### Quick Setup

1. **Copy the example file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Add your credentials** to `.env.local`:
   ```bash
   # Google Analytics (optional but recommended)
   VITE_GA_MEASUREMENT_ID=G-YOUR-MEASUREMENT-ID

   # Google AdSense (optional, for monetization)
   VITE_ADSENSE_PUBLISHER_ID=ca-pub-YOUR-PUBLISHER-ID

   # OpenRouter AI (optional, for AI-powered features)
   VITE_OPENROUTER_API_KEY=sk-or-v1-YOUR-API-KEY
   ```

3. **Where to get these values**:
   - **Google Analytics**: Get your measurement ID from [Google Analytics](https://analytics.google.com)
   - **AdSense**: Apply and get your publisher ID from [Google AdSense](https://www.google.com/adsense)
   - **OpenRouter**: Get your API key from [OpenRouter](https://openrouter.ai/keys) - supports free AI models

### What happens if I don't set them?

- **No Google Analytics ID**: Analytics will run in local-only mode (data stored in browser localStorage)
- **No AdSense ID**: Ad placeholders will be displayed instead of real ads
- **No OpenRouter API Key**: AI-powered features will be hidden from the UI

All features work without these variables - they're only needed for production analytics, monetization, and AI features!

### AI Integration

This project includes a plugin-based AI integration system. See [AI_INTEGRATION.md](./AI_INTEGRATION.md) for detailed documentation on:
- Using AI-powered features
- Adding new AI providers (OpenAI, Anthropic, etc.)
- Customizing AI behavior
- API reference

## Adding New Calculators/Tools

The website is designed for easy expansion. Here's how to add a new tool:

### Step 1: Create the Calculator Component

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

### Step 2: Register the Tool

Edit `src/config/tools.tsx` and:

1. Import your component:
```tsx
import { YourCalculator } from '@/pages/YourCalculator';
```

2. Add to the tools array:
```tsx
{
  name: 'Your Calculator',
  path: '/your-calculator',
  component: YourCalculator,
  description: 'Brief description for the home page',
  icon: Calculator, // Choose from lucide-react icons
  color: 'text-blue-600',
  bgColor: 'bg-blue-50',
  title: 'Your Calculator - SEO Title | QuickCalc Tools',
  metaDescription: 'SEO meta description with keywords',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  searchVolume: 'high' // high, medium, or low
}
```

### Step 3: Update Sitemap

Add your new tool to `public/sitemap.xml`:

```xml
<url>
  <loc>https://quickcalc.tools/your-calculator</loc>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

That's it! Your new calculator is now:
- ✅ Routed automatically
- ✅ SEO optimized with meta tags
- ✅ Listed on the home page
- ✅ Included in the sitemap

## SEO & Traffic Strategy

### Target Audience

Non-technical users who:
- Search for practical tools (tip calculator, pregnancy calculator, etc.)
- Are less likely to use ad blockers
- Return to use multiple tools
- Share links with friends and family

### High-Traffic Keywords Targeted

- "tip calculator" - 500K+ monthly searches
- "loan calculator" - 400K+ monthly searches
- "pregnancy calculator" - 300K+ monthly searches
- "bmi calculator" - 250K+ monthly searches
- "discount calculator" - 150K+ monthly searches

### Monetization Strategy

1. **Google AdSense**: Primary revenue source
   - Header banner ad (728x90 or responsive)
   - Sidebar ads on calculator pages
   - In-content ads between results

2. **Traffic Sources**:
   - Organic search (Google, Bing)
   - Social media shares
   - Direct/bookmark traffic (returning users)

3. **Scaling**:
   - Add more calculators targeting high-volume keywords
   - Create blog content around calculator topics
   - Build backlinks through guest posts and directories

## Optimization Tips

### For Better SEO

1. **Add Schema Markup**: Include structured data for calculators
2. **Create Calculator-Specific Content**: Add detailed guides below each calculator
3. **Internal Linking**: Link related calculators to each other
4. **Page Speed**: Already optimized, but compress images further if added

### For Higher Revenue

1. **A/B Test Ad Placements**: Try different ad positions
2. **Increase Session Duration**: Add related calculators section
3. **Reduce Bounce Rate**: Suggest other tools based on current calculator
4. **Enable Auto Ads**: Let Google optimize ad placement

## File Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components (Card, Input, Button, Label)
│   ├── AdSense.tsx  # Ad placement component
│   ├── Layout.tsx   # Main layout with header/footer
│   └── SEO.tsx      # Dynamic SEO meta tags
├── config/
│   └── tools.tsx    # Tool registry (add new tools here!)
├── lib/
│   └── utils.ts     # Utility functions
├── pages/
│   ├── Home.tsx
│   ├── TipCalculator.tsx
│   ├── LoanCalculator.tsx
│   ├── PregnancyCalculator.tsx
│   ├── BMICalculator.tsx
│   ├── DiscountCalculator.tsx
│   ├── AgeCalculator.tsx
│   ├── SplitBillCalculator.tsx
│   └── UnitConverter.tsx
├── App.tsx          # Router setup
└── main.tsx         # Entry point
```

## Revenue Potential

Based on industry averages:

- **Traffic Goal**: 10,000 daily visitors (achievable with good SEO)
- **Page Views**: ~3 pages per session = 30,000 page views/day
- **RPM (Revenue per 1000 views)**: $3-15 depending on niche
- **Estimated Monthly Revenue**: $2,700 - $13,500

**Note**: Actual revenue depends on ad placement, traffic quality, and geographic location.

## Future Enhancements

- [ ] Add more calculators (mortgage, retirement, GPA, etc.)
- [ ] Create blog section with calculator guides
- [ ] Add calculator comparison features
- [ ] Implement PWA for offline use
- [ ] Add dark mode
- [ ] Create calculator result sharing (social media)
- [ ] Add calculator history (localStorage)
- [ ] Multi-language support

## License

MIT - Feel free to use this project commercially!

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ to help you make money through organic traffic and advertising.
