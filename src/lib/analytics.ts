/**
 * Analytics Service
 * Provides a unified interface for tracking events with Google Analytics
 * and custom analytics storage
 */

// Extend window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface PageViewEvent {
  path: string;
  title: string;
  referrer?: string;
}

export interface ConversionEvent {
  tool: string;
  action: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

interface StoredEvent {
  timestamp: number;
  type: 'pageview' | 'event' | 'conversion';
  data: PageViewEvent | AnalyticsEvent | ConversionEvent;
}

class AnalyticsService {
  private isInitialized = false;
  private measurementId: string | null = null;
  private customEventsEnabled = true;
  private storageKey = 'calculator_analytics';

  /**
   * Initialize the analytics service
   */
  initialize(measurementId?: string) {
    if (this.isInitialized) return;

    this.measurementId = measurementId || import.meta.env.VITE_GA_MEASUREMENT_ID || null;
    this.isInitialized = true;

    // Initialize Google Analytics if measurement ID is provided
    if (this.measurementId && typeof window !== 'undefined') {
      this.initializeGoogleAnalytics();
    }

    // Track initial page load
    if (typeof window !== 'undefined') {
      this.trackPageView({
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
      });
    }
  }

  /**
   * Initialize Google Analytics
   */
  private initializeGoogleAnalytics() {
    if (!this.measurementId || typeof window === 'undefined') return;

    // Check if gtag is already loaded
    if (window.gtag) {
      window.gtag('config', this.measurementId, {
        page_path: window.location.pathname,
      });
      return;
    }

    // Load gtag.js script dynamically
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, {
      page_path: window.location.pathname,
    });
  }

  /**
   * Track a page view
   */
  trackPageView(event: PageViewEvent) {
    if (!this.isInitialized) return;

    // Google Analytics
    if (this.measurementId && window.gtag) {
      window.gtag('config', this.measurementId, {
        page_path: event.path,
        page_title: event.title,
      });
    }

    // Custom storage
    if (this.customEventsEnabled) {
      this.storeEvent({
        timestamp: Date.now(),
        type: 'pageview',
        data: event,
      });
    }
  }

  /**
   * Track a custom event
   */
  trackEvent(event: AnalyticsEvent) {
    if (!this.isInitialized) return;

    // Google Analytics
    if (this.measurementId && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }

    // Custom storage
    if (this.customEventsEnabled) {
      this.storeEvent({
        timestamp: Date.now(),
        type: 'event',
        data: event,
      });
    }
  }

  /**
   * Track a conversion event (calculator usage)
   */
  trackConversion(event: ConversionEvent) {
    if (!this.isInitialized) return;

    // Google Analytics
    if (this.measurementId && window.gtag) {
      window.gtag('event', 'conversion', {
        tool: event.tool,
        action: event.action,
        value: event.value,
        ...event.metadata,
      });
    }

    // Custom storage
    if (this.customEventsEnabled) {
      this.storeEvent({
        timestamp: Date.now(),
        type: 'conversion',
        data: event,
      });
    }
  }

  /**
   * Track calculator input change
   */
  trackCalculatorInput(tool: string, field: string, value: string | number) {
    this.trackEvent({
      category: 'calculator',
      action: 'input_change',
      label: `${tool}_${field}`,
      metadata: { tool, field, value },
    });
  }

  /**
   * Track calculator result
   */
  trackCalculatorResult(tool: string, metadata?: Record<string, unknown>) {
    this.trackConversion({
      tool,
      action: 'calculate',
      metadata,
    });
  }

  /**
   * Track button click
   */
  trackButtonClick(buttonName: string, location: string) {
    this.trackEvent({
      category: 'engagement',
      action: 'button_click',
      label: buttonName,
      metadata: { location },
    });
  }

  /**
   * Track navigation
   */
  trackNavigation(from: string, to: string) {
    this.trackEvent({
      category: 'navigation',
      action: 'navigate',
      label: `${from} -> ${to}`,
      metadata: { from, to },
    });
  }

  /**
   * Store event in localStorage for analytics dashboard
   */
  private storeEvent(event: StoredEvent) {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.storageKey);
      const events: StoredEvent[] = stored ? JSON.parse(stored) : [];

      events.push(event);

      // Keep only last 1000 events to avoid storage bloat
      const trimmedEvents = events.slice(-1000);

      localStorage.setItem(this.storageKey, JSON.stringify(trimmedEvents));
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
    }
  }

  /**
   * Get stored events for analytics dashboard
   */
  getStoredEvents(): StoredEvent[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to retrieve analytics events:', error);
      return [];
    }
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary() {
    const events = this.getStoredEvents();

    const pageViews = events.filter(e => e.type === 'pageview');
    const customEvents = events.filter(e => e.type === 'event');
    const conversions = events.filter(e => e.type === 'conversion');

    const pageViewsByPath: Record<string, number> = {};
    pageViews.forEach(event => {
      const path = (event.data as PageViewEvent).path;
      pageViewsByPath[path] = (pageViewsByPath[path] || 0) + 1;
    });

    const conversionsByTool: Record<string, number> = {};
    conversions.forEach(event => {
      const tool = (event.data as ConversionEvent).tool;
      conversionsByTool[tool] = (conversionsByTool[tool] || 0) + 1;
    });

    return {
      totalPageViews: pageViews.length,
      totalEvents: customEvents.length,
      totalConversions: conversions.length,
      pageViewsByPath,
      conversionsByTool,
      events,
    };
  }

  /**
   * Clear all stored analytics data
   */
  clearStoredEvents() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Enable/disable custom event storage
   */
  setCustomEventsEnabled(enabled: boolean) {
    this.customEventsEnabled = enabled;
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Export for testing or multiple instances
export default AnalyticsService;
