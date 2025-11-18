import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { abTests, isTestActive } from '@/config/abTests';
import type { ABTest } from '@/config/abTests';
import { analytics } from '@/lib/analytics';

/**
 * User's assigned variants for all tests
 */
interface VariantAssignments {
  [testId: string]: string; // testId -> variantId
}

interface ABTestingContextType {
  assignments: VariantAssignments;
  getVariant: (testId: string) => string | null;
  isVariant: (testId: string, variantId: string) => boolean;
  trackExperimentView: (testId: string) => void;
  trackExperimentConversion: (testId: string, metadata?: Record<string, unknown>) => void;
  resetAssignments: () => void;
}

const ABTestingContext = createContext<ABTestingContextType | undefined>(undefined);

const STORAGE_KEY = 'ab_test_assignments';

/**
 * AB Testing Provider
 * Manages variant assignments and tracks experiment views/conversions
 */
export function ABTestingProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<VariantAssignments>({});
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize variant assignments from localStorage or create new ones
   */
  useEffect(() => {
    const storedAssignments = localStorage.getItem(STORAGE_KEY);

    if (storedAssignments) {
      try {
        const parsed = JSON.parse(storedAssignments);
        setAssignments(parsed);
      } catch (error) {
        console.error('Failed to parse stored AB test assignments:', error);
        assignVariants();
      }
    } else {
      assignVariants();
    }

    setIsInitialized(true);
  }, []);

  /**
   * Save assignments to localStorage whenever they change
   */
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    }
  }, [assignments, isInitialized]);

  /**
   * Assign variants for all active tests
   */
  const assignVariants = () => {
    const newAssignments: VariantAssignments = {};

    abTests.forEach(test => {
      if (isTestActive(test)) {
        newAssignments[test.id] = selectVariant(test);
      }
    });

    setAssignments(newAssignments);
  };

  /**
   * Select a variant based on weights using deterministic randomization
   * Uses a hash of userId (or sessionId) + testId for consistency
   */
  const selectVariant = (test: ABTest): string => {
    // Get or create a consistent user identifier
    const userId = getUserId();

    // Create a deterministic random value based on userId and testId
    const seed = hashString(`${userId}-${test.id}`);
    const random = (seed % 10000) / 10000; // Convert to 0-1 range

    // Select variant based on weighted random selection
    let cumulativeWeight = 0;

    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (random < cumulativeWeight) {
        return variant.id;
      }
    }

    // Fallback to first variant (should never reach here if weights sum to 1)
    return test.variants[0].id;
  };

  /**
   * Get or create a consistent user identifier
   */
  const getUserId = (): string => {
    const USERID_KEY = 'ab_test_user_id';
    let userId = localStorage.getItem(USERID_KEY);

    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(USERID_KEY, userId);
    }

    return userId;
  };

  /**
   * Simple hash function for deterministic randomization
   */
  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  /**
   * Get the assigned variant for a test
   */
  const getVariant = (testId: string): string | null => {
    return assignments[testId] || null;
  };

  /**
   * Check if user is assigned to a specific variant
   */
  const isVariant = (testId: string, variantId: string): boolean => {
    return assignments[testId] === variantId;
  };

  /**
   * Track when a user views an experiment
   */
  const trackExperimentView = (testId: string) => {
    const variant = getVariant(testId);
    if (!variant) return;

    analytics.trackEvent({
      category: 'ab_test',
      action: 'view',
      label: `${testId}_${variant}`,
      metadata: {
        testId,
        variant,
      },
    });
  };

  /**
   * Track when a user converts in an experiment
   */
  const trackExperimentConversion = (
    testId: string,
    metadata?: Record<string, unknown>
  ) => {
    const variant = getVariant(testId);
    if (!variant) return;

    analytics.trackEvent({
      category: 'ab_test',
      action: 'conversion',
      label: `${testId}_${variant}`,
      metadata: {
        testId,
        variant,
        ...metadata,
      },
    });
  };

  /**
   * Reset all variant assignments (useful for testing)
   */
  const resetAssignments = () => {
    localStorage.removeItem(STORAGE_KEY);
    assignVariants();
  };

  return (
    <ABTestingContext.Provider
      value={{
        assignments,
        getVariant,
        isVariant,
        trackExperimentView,
        trackExperimentConversion,
        resetAssignments,
      }}
    >
      {children}
    </ABTestingContext.Provider>
  );
}

/**
 * Hook to use AB testing context
 */
export function useABTest() {
  const context = useContext(ABTestingContext);

  if (!context) {
    throw new Error('useABTest must be used within ABTestingProvider');
  }

  return context;
}

/**
 * Hook to get a specific test variant
 */
export function useVariant(testId: string): string | null {
  const { getVariant, trackExperimentView } = useABTest();
  const variant = getVariant(testId);

  // Track view once when component mounts
  useEffect(() => {
    if (variant) {
      trackExperimentView(testId);
    }
  }, [testId, variant, trackExperimentView]);

  return variant;
}

/**
 * Hook to check if user is in a specific variant
 */
export function useIsVariant(testId: string, variantId: string): boolean {
  const { isVariant } = useABTest();
  return isVariant(testId, variantId);
}
