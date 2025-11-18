import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { tools, homePage } from '@/config/tools';
import { analytics } from '@/lib/analytics';

/**
 * Generate Schema.org JSON-LD structured data for calculator pages
 */
function generateSchemaMarkup(pageConfig: any, pathname: string): object {
  const baseUrl = window.location.origin;

  // Base WebApplication schema
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': pageConfig.title,
    'description': pageConfig.metaDescription,
    'url': `${baseUrl}${pathname}`,
    'applicationCategory': 'UtilityApplication',
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
  };

  // Add specific calculator types based on path
  if (pathname.includes('calculator') || pathname.includes('converter')) {
    schema['@type'] = ['WebApplication', 'SoftwareApplication'];
    schema.softwareApplicationCategory = 'Calculator';
  }

  // Add BreadcrumbList for better navigation
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': baseUrl,
      },
    ],
  };

  if (pathname !== '/') {
    breadcrumbs.itemListElement.push({
      '@type': 'ListItem',
      'position': 2,
      'name': pageConfig.title,
      'item': `${baseUrl}${pathname}`,
    });
  }

  return [schema, breadcrumbs];
}

export function SEO() {
  const location = useLocation();

  useEffect(() => {
    // Find the current tool or home page
    const currentTool = tools.find(tool => tool.path === location.pathname);
    const pageConfig = currentTool || (location.pathname === '/' ? homePage : null);

    if (pageConfig) {
      // Set page title
      document.title = pageConfig.title;

      // Set meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', pageConfig.metaDescription);

      // Set keywords
      const keywords = 'keywords' in pageConfig ? pageConfig.keywords.join(', ') : '';
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);

      // Open Graph tags
      const ogTags = [
        { property: 'og:title', content: pageConfig.title },
        { property: 'og:description', content: pageConfig.metaDescription },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: `${window.location.origin}${location.pathname}` },
      ];

      ogTags.forEach(({ property, content }) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });

      // Twitter Card tags
      const twitterTags = [
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: pageConfig.title },
        { name: 'twitter:description', content: pageConfig.metaDescription },
      ];

      twitterTags.forEach(({ name, content }) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });

      // Add Schema.org structured data
      const schemas = generateSchemaMarkup(pageConfig, location.pathname);

      // Remove existing schema script tags
      const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
      existingSchemas.forEach(script => script.remove());

      // Add new schema markup
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.text = JSON.stringify(schemas);
      document.head.appendChild(schemaScript);

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
