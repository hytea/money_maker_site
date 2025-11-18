import { useCallback, useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import type { AnalyticsEvent } from '@/lib/analytics';

/**
 * Custom hook for easy analytics tracking throughout the application
 * Provides convenient methods for tracking common events
 */
export function useAnalytics() {
  /**
   * Track a custom event
   */
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    analytics.trackEvent(event);
  }, []);

  /**
   * Track calculator input change
   */
  const trackCalculatorInput = useCallback(
    (tool: string, field: string, value: string | number) => {
      analytics.trackCalculatorInput(tool, field, value);
    },
    []
  );

  /**
   * Track calculator result
   */
  const trackCalculatorResult = useCallback(
    (tool: string, metadata?: Record<string, unknown>) => {
      analytics.trackCalculatorResult(tool, metadata);
    },
    []
  );

  /**
   * Track button click
   */
  const trackButtonClick = useCallback((buttonName: string, location: string) => {
    analytics.trackButtonClick(buttonName, location);
  }, []);

  /**
   * Track navigation
   */
  const trackNavigation = useCallback((from: string, to: string) => {
    analytics.trackNavigation(from, to);
  }, []);

  /**
   * Track page view (useful for manual tracking)
   */
  const trackPageView = useCallback((path: string, title: string) => {
    analytics.trackPageView({ path, title });
  }, []);

  return {
    trackEvent,
    trackCalculatorInput,
    trackCalculatorResult,
    trackButtonClick,
    trackNavigation,
    trackPageView,
  };
}

/**
 * Hook to track calculator usage
 * Automatically tracks when calculations are performed
 */
export function useCalculatorTracking(
  toolName: string,
  dependencies: unknown[] = []
) {
  const { trackCalculatorResult } = useAnalytics();

  useEffect(() => {
    // Skip tracking on initial mount (when dependencies are empty/default)
    if (dependencies.some(dep => dep === '' || dep === 0 || dep === null || dep === undefined)) {
      return;
    }

    trackCalculatorResult(toolName);
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return { trackCalculatorResult };
}

/**
 * Hook to track button clicks with automatic location detection
 */
export function useButtonTracking(location: string) {
  const { trackButtonClick } = useAnalytics();

  const trackClick = useCallback(
    (buttonName: string) => {
      trackButtonClick(buttonName, location);
    },
    [location, trackButtonClick]
  );

  return { trackClick };
}
