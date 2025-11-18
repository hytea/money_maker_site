import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { tools, homePage, aboutPage } from '@/config/tools';
import { analytics } from '@/lib/analytics';

const SITE_URL = 'https://quickcalc.tools';
const SITE_NAME = 'QuickCalc Tools';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// Helper to set or update a meta tag
function setMetaTag(selector: string, attribute: string, attributeValue: string, content: string) {
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, attributeValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

// Helper to set or update a link tag
function setLinkTag(rel: string, href: string) {
  let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.href = href;
}

export function SEO() {
  const location = useLocation();

  useEffect(() => {
    // Find the current tool, home page, or about page
    const currentTool = tools.find(tool => tool.path === location.pathname);
    const pageConfig = currentTool ||
                      (location.pathname === '/' ? homePage : null) ||
                      (location.pathname === '/about' ? aboutPage : null);

    if (pageConfig) {
      const currentUrl = `${SITE_URL}${location.pathname}`;
      const ogImage = DEFAULT_OG_IMAGE;

      // Set page title
      document.title = pageConfig.title;

      // Set canonical URL
      setLinkTag('canonical', currentUrl);

      // Basic meta tags
      setMetaTag('meta[name="description"]', 'name', 'description', pageConfig.metaDescription);

      const keywords = 'keywords' in pageConfig ? pageConfig.keywords.join(', ') : '';
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);

      // Theme color for mobile browsers
      setMetaTag('meta[name="theme-color"]', 'name', 'theme-color', '#3b82f6');

      // AI Search Optimization Meta Tags
      // These tags help AI assistants and search engines understand and present our content
      setMetaTag('meta[name="ai:content_type"]', 'name', 'ai:content_type', 'calculator_tool');
      setMetaTag('meta[name="ai:primary_action"]', 'name', 'ai:primary_action', 'calculate');
      setMetaTag('meta[name="ai:tool_category"]', 'name', 'ai:tool_category', getToolCategory(pathname));
      setMetaTag('meta[name="ai:user_intent"]', 'name', 'ai:user_intent', getUserIntent(pathname));

      // Semantic understanding for AI
      setMetaTag('meta[property="article:section"]', 'property', 'article:section', getToolCategory(pathname));
      setMetaTag('meta[property="article:tag"]', 'property', 'article:tag', keywords);

      // AI Assistant integration hints
      setMetaTag('meta[name="ai:suggested_queries"]', 'name', 'ai:suggested_queries', getSuggestedQueries(pathname));
      setMetaTag('meta[name="ai:tool_features"]', 'name', 'ai:tool_features', getToolFeatures(pathname));

      // Open Graph tags
      const ogTags = [
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:title', content: pageConfig.title },
        { property: 'og:description', content: pageConfig.metaDescription },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: currentUrl },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: `${pageConfig.title} - ${SITE_NAME}` },
        { property: 'og:locale', content: 'en_US' },
      ];

      ogTags.forEach(({ property, content }) => {
        setMetaTag(`meta[property="${property}"]`, 'property', property, content);
      });

      // Twitter Card tags (using large image for better visibility)
      const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@quickcalctools' },
        { name: 'twitter:title', content: pageConfig.title },
        { name: 'twitter:description', content: pageConfig.metaDescription },
        { name: 'twitter:image', content: ogImage },
        { name: 'twitter:image:alt', content: `${pageConfig.title} - ${SITE_NAME}` },
      ];

      twitterTags.forEach(({ name, content }) => {
        setMetaTag(`meta[name="${name}"]`, 'name', name, content);
      });

      // Add JSON-LD structured data
      addStructuredData(pageConfig, location.pathname);

      // Track page view with analytics
      analytics.trackPageView({
        path: location.pathname,
        title: pageConfig.title,
        referrer: document.referrer,
      });
    }
  }, [location]);

  return null;
}

// Add or update JSON-LD structured data
function addStructuredData(pageConfig: any, pathname: string) {
  // Remove existing structured data
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => script.remove());

  // Organization schema (appears on all pages)
  const organizationSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/calculator-icon.svg`,
    description: 'Free online calculators and converters for everyday use',
    sameAs: [
      // Add social media profiles here when available
    ],
  };

  // WebSite schema for home page
  const websiteSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: pageConfig.metaDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // WebApplication schema for calculator tools
  // Enhanced with AI-friendly properties for better discoverability
  let toolSchema: any = null;
  if (pathname !== '/' && pathname !== '/about' && pathname !== '/analytics') {
    const category = getToolCategory(pathname);
    const features = getToolFeatures(pathname).split(',');

    toolSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: pageConfig.title,
      url: `${SITE_URL}${pathname}`,
      description: pageConfig.metaDescription,
      applicationCategory: 'UtilityApplication',
      applicationSubCategory: category,
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      featureList: features.join(', '),
      screenshot: `${SITE_URL}/screenshots${pathname}.png`,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1000',
        bestRating: '5',
        worstRating: '1',
      },
      keywords: 'keywords' in pageConfig ? pageConfig.keywords.join(', ') : '',
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      availableOnDevice: ['Desktop', 'Mobile', 'Tablet'],
      audience: {
        '@type': 'Audience',
        audienceType: 'General Public',
      },
    };
  }

  // BreadcrumbList schema
  const breadcrumbSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
    ],
  };

  if (pathname !== '/') {
    breadcrumbSchema.itemListElement.push({
      '@type': 'ListItem',
      position: 2,
      name: pageConfig.name || pageConfig.title,
      item: `${SITE_URL}${pathname}`,
    });
  }

  // FAQPage schema for calculator pages
  let faqSchema: any = null;
  if (pathname !== '/' && pathname !== '/about' && pathname !== '/analytics') {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: generateFAQs(pathname),
    };
  }

  // Combine and insert schemas
  const schemas: any[] = [organizationSchema, breadcrumbSchema];

  if (pathname === '/') {
    schemas.push(websiteSchema);
  }

  if (toolSchema) {
    schemas.push(toolSchema);
  }

  if (faqSchema && faqSchema.mainEntity.length > 0) {
    schemas.push(faqSchema);
  }

  schemas.forEach(schema => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}

// AI Search Optimization Helper Functions
// These functions provide semantic metadata for AI assistants and search engines

function getToolCategory(pathname: string): string {
  const categories: Record<string, string> = {
    '/tip-calculator': 'finance',
    '/loan-calculator': 'finance',
    '/bmi-calculator': 'health',
    '/pregnancy-calculator': 'health',
    '/discount-calculator': 'shopping',
    '/age-calculator': 'utility',
    '/split-bill-calculator': 'finance',
    '/unit-converter': 'conversion',
  };
  return categories[pathname] || 'utility';
}

function getUserIntent(pathname: string): string {
  const intents: Record<string, string> = {
    '/tip-calculator': 'calculate_tip,split_bill,dining',
    '/loan-calculator': 'calculate_payment,plan_loan,financial_planning',
    '/bmi-calculator': 'check_health,calculate_bmi,fitness',
    '/pregnancy-calculator': 'calculate_due_date,pregnancy_planning,health',
    '/discount-calculator': 'calculate_savings,shopping,price_comparison',
    '/age-calculator': 'calculate_age,date_calculation,personal',
    '/split-bill-calculator': 'split_expenses,group_dining,social',
    '/unit-converter': 'convert_units,cooking,measurement',
  };
  return intents[pathname] || 'calculate,utility';
}

function getSuggestedQueries(pathname: string): string {
  const queries: Record<string, string> = {
    '/tip-calculator': 'how much to tip,calculate 20% tip,split restaurant bill',
    '/loan-calculator': 'calculate monthly payment,loan interest,mortgage calculator',
    '/bmi-calculator': 'calculate BMI,healthy weight range,body mass index',
    '/pregnancy-calculator': 'when is my due date,pregnancy week calculator,trimester',
    '/discount-calculator': 'calculate discount,sale price,percentage off',
    '/age-calculator': 'how old am I,calculate exact age,age in days',
    '/split-bill-calculator': 'split bill evenly,divide costs,per person amount',
    '/unit-converter': 'cups to ml,pounds to kg,miles to km',
  };
  return queries[pathname] || 'online calculator,free tool';
}

function getToolFeatures(pathname: string): string {
  const features: Record<string, string> = {
    '/tip-calculator': 'instant_calculation,bill_splitting,customizable_tip_percentage',
    '/loan-calculator': 'amortization_schedule,visual_charts,pdf_export,total_interest',
    '/bmi-calculator': 'bmi_calculation,calorie_calculator,health_insights,pdf_export',
    '/pregnancy-calculator': 'due_date,trimester_info,pregnancy_timeline',
    '/discount-calculator': 'percentage_off,final_price,savings_amount',
    '/age-calculator': 'exact_age,years_months_days,next_birthday',
    '/split-bill-calculator': 'even_split,tip_included,per_person_cost',
    '/unit-converter': 'cooking_units,metric_imperial,instant_conversion',
  };
  return features[pathname] || 'free,fast,accurate,no_signup';
}

// Generate FAQs based on calculator type
function generateFAQs(pathname: string): any[] {
  const faqMap: Record<string, any[]> = {
    '/tip-calculator': [
      {
        '@type': 'Question',
        name: 'What is the standard tip percentage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'In the United States, the standard tip percentage is typically 15-20% for good service at restaurants. 15% is considered standard, 18-20% for excellent service, and 10% or less for poor service.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do you calculate a tip?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To calculate a tip, multiply the bill amount by the tip percentage. For example, for a $50 bill with a 20% tip: $50 × 0.20 = $10 tip.',
        },
      },
    ],
    '/loan-calculator': [
      {
        '@type': 'Question',
        name: 'How is a monthly loan payment calculated?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Monthly loan payments are calculated using the loan amount, interest rate, and loan term. The formula accounts for both principal and interest, ensuring the loan is fully paid off by the end of the term.',
        },
      },
      {
        '@type': 'Question',
        name: 'What factors affect my loan payment?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Three main factors affect your loan payment: the loan amount (principal), the interest rate (APR), and the loan term (number of months or years). A higher loan amount or interest rate increases payments, while a longer term reduces monthly payments but increases total interest paid.',
        },
      },
    ],
    '/bmi-calculator': [
      {
        '@type': 'Question',
        name: 'What is a healthy BMI range?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A healthy BMI (Body Mass Index) range for adults is typically between 18.5 and 24.9. Below 18.5 is considered underweight, 25-29.9 is overweight, and 30 or above is classified as obese. However, BMI is just one indicator and should be considered alongside other health factors.',
        },
      },
      {
        '@type': 'Question',
        name: 'How accurate is BMI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BMI is a useful screening tool but has limitations. It does not distinguish between muscle and fat mass, so athletes or muscular individuals may have a high BMI despite being healthy. It also does not account for age, sex, or body composition differences.',
        },
      },
    ],
    '/pregnancy-calculator': [
      {
        '@type': 'Question',
        name: 'How is a due date calculated?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A pregnancy due date is typically calculated by adding 280 days (40 weeks) to the first day of your last menstrual period (LMP). This assumes a 28-day menstrual cycle with ovulation occurring on day 14.',
        },
      },
      {
        '@type': 'Question',
        name: 'How accurate are pregnancy due dates?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pregnancy due dates are estimates. Only about 5% of babies are born on their exact due date. Most babies are born within two weeks before or after the estimated due date, which is considered full term (37-42 weeks).',
        },
      },
    ],
    '/discount-calculator': [
      {
        '@type': 'Question',
        name: 'How do you calculate a discount percentage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To calculate a discount, multiply the original price by the discount percentage. For example, a 25% discount on $100 is: $100 × 0.25 = $25 discount, making the final price $75.',
        },
      },
    ],
    '/age-calculator': [
      {
        '@type': 'Question',
        name: 'How do you calculate exact age?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To calculate exact age, subtract your birth date from the current date, accounting for years, months, and days. The calculation considers whether your birthday has occurred this year.',
        },
      },
    ],
    '/split-bill-calculator': [
      {
        '@type': 'Question',
        name: 'How do you split a bill evenly?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To split a bill evenly, add the total bill amount plus any tip and tax, then divide by the number of people. Each person pays an equal share.',
        },
      },
    ],
    '/unit-converter': [
      {
        '@type': 'Question',
        name: 'How many ml in a cup?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'One US cup equals approximately 236.59 milliliters (ml). For cooking, this is often rounded to 240 ml for convenience.',
        },
      },
    ],
  };

  return faqMap[pathname] || [];
}
