/**
 * Shared Results Service
 * Handles creating, storing, and retrieving shareable calculation results
 */

export interface SharedResult {
  id: string;
  calculatorType: string;
  title: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  timestamp: number;
  shareCount?: number;
}

const STORAGE_KEY = 'quickcalc_shared_results';

/**
 * Generate a unique shareable ID
 */
export function generateShareId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a shareable result and store it
 */
export function createSharedResult(
  calculatorType: string,
  title: string,
  inputs: Record<string, any>,
  results: Record<string, any>
): string {
  const id = generateShareId();
  const sharedResult: SharedResult = {
    id,
    calculatorType,
    title,
    inputs,
    results,
    timestamp: Date.now(),
    shareCount: 0,
  };

  // Store in localStorage
  const existingResults = getSharedResults();
  existingResults.push(sharedResult);

  // Keep only last 100 results to avoid storage bloat
  if (existingResults.length > 100) {
    existingResults.shift();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingResults));

  return id;
}

/**
 * Get a specific shared result by ID
 */
export function getSharedResult(id: string): SharedResult | null {
  const results = getSharedResults();
  return results.find(r => r.id === id) || null;
}

/**
 * Get all shared results
 */
export function getSharedResults(): SharedResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading shared results:', error);
    return [];
  }
}

/**
 * Increment share count for a result
 */
export function incrementShareCount(id: string): void {
  const results = getSharedResults();
  const result = results.find(r => r.id === id);
  if (result) {
    result.shareCount = (result.shareCount || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  }
}

/**
 * Generate shareable URL
 */
export function generateShareUrl(id: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/shared/${id}`;
}

/**
 * Encode calculation data to URL parameters
 */
export function encodeToUrl(data: Record<string, any>): string {
  return btoa(JSON.stringify(data));
}

/**
 * Decode calculation data from URL parameters
 */
export function decodeFromUrl(encoded: string): Record<string, any> | null {
  try {
    return JSON.parse(atob(encoded));
  } catch (error) {
    console.error('Error decoding URL data:', error);
    return null;
  }
}
