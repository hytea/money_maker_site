import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { abTests as localTests, isTestActive } from '@/config/abTests';
import type { ABTest } from '@/config/abTests';
import { analytics } from '@/lib/analytics';
import { firebaseABTestService } from '@/services/firebaseABTest';

/**
 * User's assigned variants for all tests
 */
interface VariantAssignments {
  [testId: string]: string; // testId -> variantId
}

interface FirebaseABTestingContextType {
  assignments: VariantAssignments;
  tests: ABTest[];
  loading: boolean;
  error: Error | null;
  getVariant: (testId: string) => string | null;
  isVariant: (testId: string, variantId: string) => boolean;
  trackExperimentView: (testId: string) => void;
  trackExperimentConversion: (testId: string, metadata?: Record<string, unknown>) => void;
  resetAssignments: () => void;
  refreshTests: () => Promise<void>;
  syncLocalTests: () => Promise<void>;
}

const FirebaseABTestingContext = createContext<FirebaseABTestingContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'ab_test_assignments';
const USE_FIREBASE_KEY = 'ab_test_use_firebase';

/**
 * Enhanced AB Testing Provider with Firebase Integration
 * Falls back to local configuration if Firebase is unavailable
 */
export function FirebaseABTestingProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<VariantAssignments>({});
  const [tests, setTests] = useState<ABTest[]>(localTests);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [useFirebase, setUseFirebase] = useState(false);

  /**
   * Initialize the AB testing system
   */
  useEffect(() => {
    initializeABTesting();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Initialize Firebase AB testing or fall back to local
   */
  const initializeABTesting = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if we should use Firebase
      const shouldUseFirebase = localStorage.getItem(USE_FIREBASE_KEY) === 'true';
      setUseFirebase(shouldUseFirebase);

      if (shouldUseFirebase) {
        // Initialize Firebase service
        await firebaseABTestService.initialize();

        // Try to load tests from Firebase
        const firebaseTests = await firebaseABTestService.getEnabledTests();

        if (firebaseTests.length > 0) {
          console.log(`Loaded ${firebaseTests.length} AB tests from Firebase`);
          setTests(firebaseTests);
        } else {
          console.log('No Firebase tests found, using local tests');
          setTests(localTests.filter(isTestActive));
        }
      } else {
        // Use local tests
        console.log('Using local AB test configuration');
        setTests(localTests.filter(isTestActive));
      }

      // Load or create variant assignments
      await initializeAssignments();

      setIsInitialized(true);
    } catch (err) {
      console.error('Failed to initialize AB testing:', err);
      setError(err as Error);

      // Fall back to local tests
      setTests(localTests.filter(isTestActive));
      await initializeAssignments();
      setIsInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize variant assignments from localStorage or create new ones
   */
  const initializeAssignments = async () => {
    const storedAssignments = localStorage.getItem(STORAGE_KEY);

    if (storedAssignments) {
      try {
        const parsed = JSON.parse(storedAssignments);
        setAssignments(parsed);
      } catch (error) {
        console.error('Failed to parse stored AB test assignments:', error);
        await assignVariants();
      }
    } else {
      await assignVariants();
    }
  };

  /**
   * Save assignments to localStorage whenever they change
   */
  useEffect(() => {
    if (isInitialized && Object.keys(assignments).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    }
  }, [assignments, isInitialized]);

  /**
   * Select a variant based on weights using deterministic randomization
   */
  const selectVariant = useCallback((test: ABTest): string => {
    const userId = getUserId();
    const seed = hashString(`${userId}-${test.id}`);
    const random = (seed % 10000) / 10000;

    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (random < cumulativeWeight) {
        return variant.id;
      }
    }

    return test.variants[0].id;
  }, []);

  /**
   * Assign variants for all active tests
   */
  const assignVariants = useCallback(async () => {
    const newAssignments: VariantAssignments = {};
    const userId = getUserId();

    for (const test of tests) {
      if (isTestActive(test)) {
        const variantId = selectVariant(test);
        newAssignments[test.id] = variantId;

        // Track assignment in Firebase if enabled
        if (useFirebase) {
          await firebaseABTestService.trackVariantAssignment(test.id, variantId, userId);
        }
      }
    }

    setAssignments(newAssignments);
  }, [tests, useFirebase, selectVariant]);

  /**
   * Get or create a consistent user identifier
   */
  const getUserId = (): string => {
    const USERID_KEY = 'ab_test_user_id';
    let userId = localStorage.getItem(USERID_KEY);

    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
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
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  /**
   * Get the assigned variant for a test
   */
  const getVariant = useCallback(
    (testId: string): string | null => {
      return assignments[testId] || null;
    },
    [assignments]
  );

  /**
   * Check if user is assigned to a specific variant
   */
  const isVariant = useCallback(
    (testId: string, variantId: string): boolean => {
      return assignments[testId] === variantId;
    },
    [assignments]
  );

  /**
   * Track when a user views an experiment
   */
  const trackExperimentView = useCallback(
    async (testId: string) => {
      const variant = getVariant(testId);
      if (!variant) return;

      // Track locally
      analytics.trackEvent({
        category: 'ab_test',
        action: 'view',
        label: `${testId}_${variant}`,
        metadata: {
          testId,
          variant,
        },
      });

      // Track in Firebase if enabled
      if (useFirebase) {
        await firebaseABTestService.trackView(testId, variant);
      }
    },
    [getVariant, useFirebase]
  );

  /**
   * Track when a user converts in an experiment
   */
  const trackExperimentConversion = useCallback(
    async (testId: string, metadata?: Record<string, unknown>) => {
      const variant = getVariant(testId);
      if (!variant) return;

      // Track locally
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

      // Track in Firebase if enabled
      if (useFirebase) {
        await firebaseABTestService.trackConversion(testId, variant, metadata);
      }
    },
    [getVariant, useFirebase]
  );

  /**
   * Reset all variant assignments
   */
  const resetAssignments = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    await assignVariants();
  }, [assignVariants]);

  /**
   * Refresh tests from Firebase
   */
  const refreshTests = useCallback(async () => {
    if (!useFirebase) {
      console.log('Firebase not enabled, using local tests');
      setTests(localTests.filter(isTestActive));
      return;
    }

    setLoading(true);
    try {
      const firebaseTests = await firebaseABTestService.getEnabledTests();
      setTests(firebaseTests);
      console.log(`Refreshed ${firebaseTests.length} tests from Firebase`);
    } catch (err) {
      console.error('Failed to refresh tests:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [useFirebase]);

  /**
   * Sync local tests to Firebase (admin function)
   */
  const syncLocalTests = useCallback(async () => {
    setLoading(true);
    try {
      await firebaseABTestService.syncLocalTests(localTests);
      console.log('Successfully synced local tests to Firebase');

      // Enable Firebase mode
      localStorage.setItem(USE_FIREBASE_KEY, 'true');
      setUseFirebase(true);

      // Refresh tests
      await refreshTests();
    } catch (err) {
      console.error('Failed to sync local tests:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshTests]);

  return (
    <FirebaseABTestingContext.Provider
      value={{
        assignments,
        tests,
        loading,
        error,
        getVariant,
        isVariant,
        trackExperimentView,
        trackExperimentConversion,
        resetAssignments,
        refreshTests,
        syncLocalTests,
      }}
    >
      {children}
    </FirebaseABTestingContext.Provider>
  );
}

/**
 * Hook to use Firebase AB testing context
 */
export function useFirebaseABTest() {
  const context = useContext(FirebaseABTestingContext);

  if (!context) {
    throw new Error('useFirebaseABTest must be used within FirebaseABTestingProvider');
  }

  return context;
}

/**
 * Hook to get a specific test variant with Firebase support
 */
export function useFirebaseVariant(testId: string): string | null {
  const { getVariant, trackExperimentView } = useFirebaseABTest();
  const variant = getVariant(testId);

  useEffect(() => {
    if (variant) {
      trackExperimentView(testId);
    }
  }, [testId, variant, trackExperimentView]);

  return variant;
}

/**
 * Hook to check if user is in a specific variant (Firebase version)
 */
export function useFirebaseIsVariant(testId: string, variantId: string): boolean {
  const { isVariant } = useFirebaseABTest();
  return isVariant(testId, variantId);
}
