# Google AdSense Setup Guide

This guide will help you set up Google AdSense on your QuickCalc Tools website to start monetizing your traffic.

## Overview

Your website is already configured with Google AdSense components. You just need to:
1. Get approved for Google AdSense
2. Create ad units
3. Configure your environment variables
4. Deploy your site

## Step 1: Apply for Google AdSense

1. Go to [https://www.google.com/adsense](https://www.google.com/adsense)
2. Sign in with your Google account
3. Click "Get Started" and follow the application process
4. Provide your website URL: `https://quickcalc.tools` (or your custom domain)
5. Accept the AdSense Terms and Conditions
6. Fill in your payment information

**Note:** Google AdSense approval can take anywhere from a few days to a few weeks. Your site needs to meet Google's program policies:
- Original, high-quality content
- Easy navigation
- Good user experience
- Compliance with Google's policies

## Step 2: Get Your Publisher ID

Once approved:

1. Log in to your [AdSense account](https://www.google.com/adsense)
2. Go to **Account** → **Settings** → **Account information**
3. Find your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)
4. Copy this ID - you'll need it in the next step

## Step 3: Create Ad Units

Create ad units for different placements on your site:

1. In your AdSense dashboard, go to **Ads** → **By ad unit** → **Display ads**
2. Create the following ad units:

### Recommended Ad Units:

| Ad Unit Name | Type | Size | Slot ID (you'll get this) |
|--------------|------|------|---------------------------|
| Header Banner | Display | Responsive / 728x90 | Copy the slot ID |
| Homepage Top | Display | Responsive | Copy the slot ID |
| Homepage Bottom | Display | Responsive | Copy the slot ID |
| Calculator Sidebar | Display | 300x250 or 300x600 | Copy the slot ID |

3. For each ad unit, **copy the Ad Slot ID** (format: `1234567890`)

## Step 4: Configure Your Environment

1. Create a `.env.local` file in your project root (if it doesn't exist):
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Publisher ID:
   ```env
   VITE_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```

   Replace `ca-pub-XXXXXXXXXXXXXXXX` with your actual Publisher ID from Step 2.

3. **(Optional)** Update ad slot IDs in the code for better tracking:
   - `src/components/Layout.tsx` - Header banner ad (line 88)
   - `src/pages/Home.tsx` - Homepage ads (lines 174, 292)
   - Calculator pages - Sidebar ads (all calculator pages)

   Replace the placeholder slot IDs (e.g., `"1234567890"`) with your actual ad slot IDs from AdSense.

## Step 5: Test in Development

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit your local site (usually `http://localhost:5173`)

3. You should see:
   - **Without Publisher ID configured:** Gray placeholder boxes with "AdSense Not Configured"
   - **With Publisher ID configured:** Actual Google Ads (or blank spaces if ads aren't ready yet)

**Note:** During development and testing:
- Ads may not always show immediately
- You might see blank ad spaces - this is normal
- **NEVER click your own ads** - this violates Google's policies

## Step 6: Deploy Your Site

1. Make sure your `.env.local` is NOT committed to git (it's already in `.gitignore`)

2. Configure your production environment variables:
   - **Netlify:** Go to Site Settings → Environment Variables → Add:
     ```
     VITE_ADSENSE_PUBLISHER_ID = ca-pub-XXXXXXXXXXXXXXXX
     ```
   - **Vercel:** Go to Project Settings → Environment Variables → Add the same
   - **Other platforms:** Add the environment variable according to your platform's documentation

3. Deploy your site:
   ```bash
   git add .
   git commit -m "Implement Google AdSense integration"
   git push
   ```

4. Your hosting platform will automatically rebuild and deploy with the new ads

## Step 7: Verify Ad Placement

After deployment:

1. Visit your live site
2. Open Developer Tools (F12)
3. Check the Console for any AdSense errors
4. Look for `<ins class="adsbygoogle">` elements in the HTML
5. Ads should appear within a few minutes to a few hours

**Important:** It can take up to 24-48 hours for ads to start showing consistently after initial setup.

## Current Ad Placements

Your site has ads configured in these locations:

### Header Banner
- **Location:** Top of every page (desktop only)
- **File:** `src/components/Layout.tsx:88`
- **Format:** Horizontal banner (728x90 or responsive)
- **Current Slot:** `1234567890` (replace with your slot ID)

### Homepage Ads
- **Top Ad:** After hero section (desktop only)
  - File: `src/pages/Home.tsx:174`
  - Slot: `2345678901`
- **Bottom Ad:** After calculator grid (desktop only)
  - File: `src/pages/Home.tsx:292`
  - Slot: `3456789012`

### Calculator Pages
- **Sidebar Ad:** Right side of each calculator (desktop only)
  - Files: All calculator pages in `src/pages/*Calculator.tsx`
  - Slot: `4567890123`

**Note:** Ads are hidden on mobile devices to maintain a good user experience. This is intentional and follows Google's mobile-friendly best practices.

## Troubleshooting

### Ads Not Showing

1. **Check Publisher ID:**
   - Verify `VITE_ADSENSE_PUBLISHER_ID` is set correctly in your environment
   - Format should be: `ca-pub-XXXXXXXXXXXXXXXX`

2. **Check Browser Console:**
   - Look for JavaScript errors
   - AdSense errors will show in red

3. **AdSense Account Status:**
   - Ensure your AdSense account is approved and active
   - Check for policy violations in your AdSense dashboard

4. **Ad Blockers:**
   - Disable ad blockers for testing
   - Many users have ad blockers - this is expected

5. **New Site:**
   - New sites may take 24-48 hours for ads to start showing
   - Google needs time to crawl and approve your pages

### Common Issues

**"AdSense Not Configured" appears:**
- The `VITE_ADSENSE_PUBLISHER_ID` environment variable is not set or is set to the default placeholder value

**Blank ad spaces:**
- Normal during initial setup
- Google may not have ads available for your content yet
- Try different pages/content

**Console errors about "adsbygoogle":**
- Make sure the AdSense script is loaded in `index.html`
- Check that your Publisher ID is valid
- Verify you're not running ad blockers

## Best Practices

### Do's ✅
- Monitor your AdSense dashboard regularly
- Check for policy violations
- Optimize ad placements based on performance data
- Keep your content high-quality and original
- Maintain good user experience

### Don'ts ❌
- **NEVER click your own ads** - This will get you banned
- Don't ask others to click your ads
- Don't place ads on error pages or login pages
- Don't modify the AdSense code (except slot IDs)
- Don't use misleading content to generate clicks

## Customizing Ad Placements

To add more ads or change placements:

1. Create a new ad unit in your AdSense dashboard
2. Copy the ad slot ID
3. Add the AdSense component where you want the ad:

```tsx
import { AdSense } from '@/components/AdSense';

// In your component JSX:
<AdSense
  slot="YOUR_SLOT_ID"
  format="auto"  // or "rectangle", "horizontal", "vertical"
  responsive={true}  // makes the ad responsive
/>
```

### Ad Format Options

- `format="auto"` - Responsive ad (recommended)
- `format="rectangle"` - 300x250 or similar
- `format="horizontal"` - 728x90 banner
- `format="vertical"` - 160x600 skyscraper

## Monitoring Performance

Track your ad performance in the AdSense dashboard:

1. Log in to [AdSense](https://www.google.com/adsense)
2. Go to **Reports** → **Overview**
3. Monitor:
   - **Impressions:** How many times ads are shown
   - **Clicks:** How many times ads are clicked
   - **CTR (Click-Through Rate):** Percentage of impressions that result in clicks
   - **Earnings:** How much you're making

### Optimize for Better Revenue

- Test different ad placements
- Monitor which pages generate the most revenue
- Focus on creating content that attracts engaged visitors
- Improve your site's SEO to get more traffic
- Use AdSense experiments to test different configurations

## Support & Resources

- [AdSense Help Center](https://support.google.com/adsense)
- [AdSense Program Policies](https://support.google.com/adsense/answer/48182)
- [AdSense Community](https://support.google.com/adsense/community)
- [Google Publisher Academy](https://publisheracademy.withgoogle.com/)

## Need Help?

If you encounter issues not covered in this guide:

1. Check the [AdSense Help Center](https://support.google.com/adsense)
2. Review your browser console for JavaScript errors
3. Verify all configuration steps were completed correctly
4. Make sure your site complies with AdSense policies

---

**Ready to monetize?** Follow the steps above and start earning from your traffic! 🚀
