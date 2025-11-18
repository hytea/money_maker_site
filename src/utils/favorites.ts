/**
 * Favorites/Bookmarking system for frequently used calculators
 */

export class FavoritesManager {
  private static STORAGE_KEY = 'quickcalc_favorites';
  private static MAX_FAVORITES = 10;

  /**
   * Add a tool to favorites
   */
  static add(toolPath: string): boolean {
    const favorites = this.getAll();

    // Don't add duplicates
    if (favorites.includes(toolPath)) {
      return false;
    }

    // Limit number of favorites
    if (favorites.length >= this.MAX_FAVORITES) {
      return false;
    }

    favorites.push(toolPath);
    this.save(favorites);
    return true;
  }

  /**
   * Remove a tool from favorites
   */
  static remove(toolPath: string): void {
    const favorites = this.getAll().filter(path => path !== toolPath);
    this.save(favorites);
  }

  /**
   * Check if a tool is favorited
   */
  static isFavorite(toolPath: string): boolean {
    return this.getAll().includes(toolPath);
  }

  /**
   * Toggle favorite status
   */
  static toggle(toolPath: string): boolean {
    if (this.isFavorite(toolPath)) {
      this.remove(toolPath);
      return false;
    } else {
      return this.add(toolPath);
    }
  }

  /**
   * Get all favorited tools
   */
  static getAll(): string[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get count of favorites
   */
  static getCount(): number {
    return this.getAll().length;
  }

  /**
   * Clear all favorites
   */
  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Check if at max capacity
   */
  static isAtMaxCapacity(): boolean {
    return this.getAll().length >= this.MAX_FAVORITES;
  }

  private static save(favorites: string[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
  }
}
