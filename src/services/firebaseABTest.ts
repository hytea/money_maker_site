/**
 * Firebase AB Testing Service
 * Manages AB tests using Firebase Firestore and Analytics
 */

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
  type Firestore,
} from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';
import type { ABTest, ABTestVariant } from '@/config/abTests';
import { analytics as localAnalytics } from '@/lib/analytics';

// Firestore collection name
const AB_TESTS_COLLECTION = 'ab_tests';

/**
 * Firebase AB Test with Firestore-specific fields
 */
export interface FirebaseABTest extends Omit<ABTest, 'startDate' | 'endDate'> {
  startDate?: Timestamp;
  endDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
}

/**
 * Firebase AB Testing Service Class
 */
class FirebaseABTestService {
  private db: Firestore | null = null;
  private initialized = false;
  private testCache: Map<string, ABTest> = new Map();
  private listeners: Map<string, () => void> = new Map();

  /**
   * Initialize the service
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize Firestore
      this.db = getFirestore();
      this.initialized = true;
      console.log('Firebase AB Test Service initialized');
    } catch (error) {
      console.error('Failed to initialize Firebase AB Test Service:', error);
      throw error;
    }
  }

  /**
   * Get all AB tests from Firestore
   */
  async getAllTests(): Promise<ABTest[]> {
    if (!this.db) await this.initialize();

    try {
      const testsRef = collection(this.db!, AB_TESTS_COLLECTION);
      const snapshot = await getDocs(testsRef);

      const tests: ABTest[] = [];
      snapshot.forEach(doc => {
        const data = doc.data() as FirebaseABTest;
        tests.push(this.convertFromFirestore(data));
      });

      // Update cache
      tests.forEach(test => this.testCache.set(test.id, test));

      return tests;
    } catch (error) {
      console.error('Failed to fetch AB tests from Firestore:', error);
      return [];
    }
  }

  /**
   * Get a specific AB test by ID
   */
  async getTest(testId: string): Promise<ABTest | null> {
    // Check cache first
    if (this.testCache.has(testId)) {
      return this.testCache.get(testId)!;
    }

    if (!this.db) await this.initialize();

    try {
      const testRef = doc(this.db!, AB_TESTS_COLLECTION, testId);
      const snapshot = await getDoc(testRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data() as FirebaseABTest;
      const test = this.convertFromFirestore(data);

      // Update cache
      this.testCache.set(testId, test);

      return test;
    } catch (error) {
      console.error(`Failed to fetch AB test ${testId}:`, error);
      return null;
    }
  }

  /**
   * Get all enabled AB tests
   */
  async getEnabledTests(): Promise<ABTest[]> {
    if (!this.db) await this.initialize();

    try {
      const testsRef = collection(this.db!, AB_TESTS_COLLECTION);
      const q = query(testsRef, where('enabled', '==', true));
      const snapshot = await getDocs(q);

      const tests: ABTest[] = [];
      snapshot.forEach(doc => {
        const data = doc.data() as FirebaseABTest;
        const test = this.convertFromFirestore(data);

        // Check if test is within date range
        if (this.isTestActive(test)) {
          tests.push(test);
        }
      });

      return tests;
    } catch (error) {
      console.error('Failed to fetch enabled AB tests:', error);
      return [];
    }
  }

  /**
   * Create a new AB test
   */
  async createTest(test: Omit<ABTest, 'id'>): Promise<string> {
    if (!this.db) await this.initialize();

    try {
      // Generate ID from name
      const id = test.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const now = Timestamp.now();
      const firebaseTest: FirebaseABTest = {
        ...test,
        id,
        startDate: test.startDate ? Timestamp.fromDate(test.startDate) : undefined,
        endDate: test.endDate ? Timestamp.fromDate(test.endDate) : undefined,
        createdAt: now,
        updatedAt: now,
      };

      const testRef = doc(this.db!, AB_TESTS_COLLECTION, id);
      await setDoc(testRef, firebaseTest);

      // Update cache
      this.testCache.set(id, this.convertFromFirestore(firebaseTest));

      // Track creation
      this.trackTestEvent('create', id);

      return id;
    } catch (error) {
      console.error('Failed to create AB test:', error);
      throw error;
    }
  }

  /**
   * Update an existing AB test
   */
  async updateTest(testId: string, updates: Partial<ABTest>): Promise<void> {
    if (!this.db) await this.initialize();

    try {
      const testRef = doc(this.db!, AB_TESTS_COLLECTION, testId);

      const firebaseUpdates: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      if (updates.startDate) {
        firebaseUpdates.startDate = Timestamp.fromDate(updates.startDate);
      }

      if (updates.endDate) {
        firebaseUpdates.endDate = Timestamp.fromDate(updates.endDate);
      }

      await updateDoc(testRef, firebaseUpdates);

      // Update cache
      const cachedTest = this.testCache.get(testId);
      if (cachedTest) {
        this.testCache.set(testId, { ...cachedTest, ...updates });
      }

      // Track update
      this.trackTestEvent('update', testId);
    } catch (error) {
      console.error(`Failed to update AB test ${testId}:`, error);
      throw error;
    }
  }

  /**
   * Delete an AB test
   */
  async deleteTest(testId: string): Promise<void> {
    if (!this.db) await this.initialize();

    try {
      const testRef = doc(this.db!, AB_TESTS_COLLECTION, testId);
      await deleteDoc(testRef);

      // Remove from cache
      this.testCache.delete(testId);

      // Track deletion
      this.trackTestEvent('delete', testId);
    } catch (error) {
      console.error(`Failed to delete AB test ${testId}:`, error);
      throw error;
    }
  }

  /**
   * Listen to real-time updates for a specific test
   */
  subscribeToTest(testId: string, callback: (test: ABTest | null) => void): () => void {
    if (!this.db) {
      console.error('Firestore not initialized');
      return () => {};
    }

    const testRef = doc(this.db, AB_TESTS_COLLECTION, testId);
    const unsubscribe = onSnapshot(testRef, snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.data() as FirebaseABTest;
        const test = this.convertFromFirestore(data);
        this.testCache.set(testId, test);
        callback(test);
      } else {
        callback(null);
      }
    });

    return unsubscribe;
  }

  /**
   * Listen to real-time updates for all tests
   */
  subscribeToAllTests(callback: (tests: ABTest[]) => void): () => void {
    if (!this.db) {
      console.error('Firestore not initialized');
      return () => {};
    }

    const testsRef = collection(this.db, AB_TESTS_COLLECTION);
    const unsubscribe = onSnapshot(testsRef, snapshot => {
      const tests: ABTest[] = [];
      snapshot.forEach(doc => {
        const data = doc.data() as FirebaseABTest;
        const test = this.convertFromFirestore(data);
        tests.push(test);
        this.testCache.set(test.id, test);
      });
      callback(tests);
    });

    return unsubscribe;
  }

  /**
   * Track AB test variant assignment
   */
  async trackVariantAssignment(testId: string, variantId: string, userId: string) {
    try {
      // Track in Firebase Analytics
      const firebaseAnalytics = getAnalytics();
      logEvent(firebaseAnalytics, 'ab_test_assignment', {
        test_id: testId,
        variant_id: variantId,
        user_id: userId,
      });

      // Also track locally
      localAnalytics.trackEvent({
        category: 'ab_test',
        action: 'assignment',
        label: `${testId}_${variantId}`,
        metadata: {
          testId,
          variantId,
          userId,
        },
      });
    } catch (error) {
      console.error('Failed to track variant assignment:', error);
    }
  }

  /**
   * Track AB test view
   */
  async trackView(testId: string, variantId: string) {
    try {
      const firebaseAnalytics = getAnalytics();
      logEvent(firebaseAnalytics, 'ab_test_view', {
        test_id: testId,
        variant_id: variantId,
      });
    } catch (error) {
      console.error('Failed to track AB test view:', error);
    }
  }

  /**
   * Track AB test conversion
   */
  async trackConversion(testId: string, variantId: string, metadata?: Record<string, any>) {
    try {
      const firebaseAnalytics = getAnalytics();
      logEvent(firebaseAnalytics, 'ab_test_conversion', {
        test_id: testId,
        variant_id: variantId,
        ...metadata,
      });
    } catch (error) {
      console.error('Failed to track AB test conversion:', error);
    }
  }

  /**
   * Check if a test is currently active
   */
  private isTestActive(test: ABTest): boolean {
    if (!test.enabled) return false;

    const now = new Date();

    if (test.startDate && now < test.startDate) return false;
    if (test.endDate && now > test.endDate) return false;

    return true;
  }

  /**
   * Convert Firestore document to ABTest
   */
  private convertFromFirestore(data: FirebaseABTest): ABTest {
    return {
      ...data,
      startDate: data.startDate ? data.startDate.toDate() : undefined,
      endDate: data.endDate ? data.endDate.toDate() : undefined,
    };
  }

  /**
   * Track test management events
   */
  private trackTestEvent(action: string, testId: string) {
    try {
      localAnalytics.trackEvent({
        category: 'ab_test_management',
        action,
        label: testId,
      });
    } catch (error) {
      console.error('Failed to track test event:', error);
    }
  }

  /**
   * Sync local tests to Firestore (for initial setup)
   */
  async syncLocalTests(localTests: ABTest[]): Promise<void> {
    if (!this.db) await this.initialize();

    try {
      const existingTests = await this.getAllTests();
      const existingIds = new Set(existingTests.map(t => t.id));

      for (const test of localTests) {
        // Only sync if test doesn't exist in Firestore
        if (!existingIds.has(test.id)) {
          const now = Timestamp.now();
          const firebaseTest: FirebaseABTest = {
            ...test,
            startDate: test.startDate ? Timestamp.fromDate(test.startDate) : undefined,
            endDate: test.endDate ? Timestamp.fromDate(test.endDate) : undefined,
            createdAt: now,
            updatedAt: now,
          };

          const testRef = doc(this.db!, AB_TESTS_COLLECTION, test.id);
          await setDoc(testRef, firebaseTest);
          console.log(`Synced AB test: ${test.id}`);
        }
      }
    } catch (error) {
      console.error('Failed to sync local tests to Firestore:', error);
      throw error;
    }
  }

  /**
   * Clear the test cache
   */
  clearCache(): void {
    this.testCache.clear();
  }
}

// Export singleton instance
export const firebaseABTestService = new FirebaseABTestService();

// Export the class for testing
export default FirebaseABTestService;
