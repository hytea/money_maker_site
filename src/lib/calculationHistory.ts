/**
 * Calculation History Service
 * Tracks and stores user's calculation history for each calculator
 */

export interface CalculationEntry {
  id: string;
  calculatorType: string;
  timestamp: number;
  inputs: Record<string, any>;
  results: Record<string, any>;
  title?: string;
}

const STORAGE_KEY = 'quickcalc_history';
const MAX_HISTORY_ITEMS = 50;

/**
 * Add a calculation to history
 */
export function addToHistory(
  calculatorType: string,
  inputs: Record<string, any>,
  results: Record<string, any>,
  title?: string
): void {
  const entry: CalculationEntry = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    calculatorType,
    timestamp: Date.now(),
    inputs,
    results,
    title,
  };

  const history = getHistory();

  // Add to beginning of array (most recent first)
  history.unshift(entry);

  // Keep only MAX_HISTORY_ITEMS
  if (history.length > MAX_HISTORY_ITEMS) {
    history.splice(MAX_HISTORY_ITEMS);
  }

  saveHistory(history);
}

/**
 * Get calculation history for a specific calculator or all calculators
 */
export function getHistory(calculatorType?: string): CalculationEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const history: CalculationEntry[] = stored ? JSON.parse(stored) : [];

    if (calculatorType) {
      return history.filter(entry => entry.calculatorType === calculatorType);
    }

    return history;
  } catch (error) {
    console.error('Error reading calculation history:', error);
    return [];
  }
}

/**
 * Get a specific history entry by ID
 */
export function getHistoryEntry(id: string): CalculationEntry | null {
  const history = getHistory();
  return history.find(entry => entry.id === id) || null;
}

/**
 * Clear history for a specific calculator or all calculators
 */
export function clearHistory(calculatorType?: string): void {
  if (calculatorType) {
    const history = getHistory();
    const filtered = history.filter(entry => entry.calculatorType !== calculatorType);
    saveHistory(filtered);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Delete a specific history entry
 */
export function deleteHistoryEntry(id: string): void {
  const history = getHistory();
  const filtered = history.filter(entry => entry.id !== id);
  saveHistory(filtered);
}

/**
 * Save history to localStorage
 */
function saveHistory(history: CalculationEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving calculation history:', error);
  }
}

/**
 * Format timestamp for display
 */
export function formatHistoryDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}
