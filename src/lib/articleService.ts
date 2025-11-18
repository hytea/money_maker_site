import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Article, CalculatorCategory } from '../types/article';

const ARTICLES_COLLECTION = 'articles';

/**
 * Article Service
 *
 * Handles all Firestore operations for articles
 */
export class ArticleService {
  /**
   * Create a new article
   */
  async createArticle(articleData: Omit<Article, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), {
        ...articleData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: articleData.status === 'published' ? Timestamp.now() : null,
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating article:', error);
      throw new Error('Failed to create article');
    }
  }

  /**
   * Update an existing article
   */
  async updateArticle(id: string, updates: Partial<Article>): Promise<void> {
    try {
      const articleRef = doc(db, ARTICLES_COLLECTION, id);

      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      // Set publishedAt when status changes to published
      if (updates.status === 'published' && !updates.publishedAt) {
        updateData.publishedAt = Timestamp.now();
      }

      await updateDoc(articleRef, updateData);
    } catch (error) {
      console.error('Error updating article:', error);
      throw new Error('Failed to update article');
    }
  }

  /**
   * Delete an article
   */
  async deleteArticle(id: string): Promise<void> {
    try {
      const articleRef = doc(db, ARTICLES_COLLECTION, id);
      await deleteDoc(articleRef);
    } catch (error) {
      console.error('Error deleting article:', error);
      throw new Error('Failed to delete article');
    }
  }

  /**
   * Get article by ID
   */
  async getArticle(id: string): Promise<Article | null> {
    try {
      const articleRef = doc(db, ARTICLES_COLLECTION, id);
      const articleSnap = await getDoc(articleRef);

      if (articleSnap.exists()) {
        return this.convertDocToArticle(articleSnap.id, articleSnap.data());
      }

      return null;
    } catch (error) {
      console.error('Error getting article:', error);
      throw new Error('Failed to get article');
    }
  }

  /**
   * Get article by slug
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const q = query(
        collection(db, ARTICLES_COLLECTION),
        where('slug', '==', slug),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return this.convertDocToArticle(doc.id, doc.data());
    } catch (error) {
      console.error('Error getting article by slug:', error);
      throw new Error('Failed to get article');
    }
  }

  /**
   * Get all articles (with optional filters)
   */
  async getArticles(options?: {
    category?: CalculatorCategory;
    status?: Article['status'];
    limit?: number;
  }): Promise<Article[]> {
    try {
      let q = query(collection(db, ARTICLES_COLLECTION));

      // Apply filters
      if (options?.category) {
        q = query(q, where('category', '==', options.category));
      }

      if (options?.status) {
        q = query(q, where('status', '==', options.status));
      }

      // Order by creation date (newest first)
      q = query(q, orderBy('createdAt', 'desc'));

      // Apply limit
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) =>
        this.convertDocToArticle(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting articles:', error);
      throw new Error('Failed to get articles');
    }
  }

  /**
   * Get published articles only
   */
  async getPublishedArticles(options?: {
    category?: CalculatorCategory;
    limit?: number;
  }): Promise<Article[]> {
    return this.getArticles({ ...options, status: 'published' });
  }

  /**
   * Get featured articles
   */
  async getFeaturedArticles(limitCount: number = 3): Promise<Article[]> {
    try {
      const q = query(
        collection(db, ARTICLES_COLLECTION),
        where('status', '==', 'published'),
        where('featured', '==', true),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) =>
        this.convertDocToArticle(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting featured articles:', error);
      throw new Error('Failed to get featured articles');
    }
  }

  /**
   * Get related articles based on category and tags
   */
  async getRelatedArticles(
    articleId: string,
    category: CalculatorCategory,
    tags: string[],
    limitCount: number = 3
  ): Promise<Article[]> {
    try {
      // Get articles in same category
      const q = query(
        collection(db, ARTICLES_COLLECTION),
        where('status', '==', 'published'),
        where('category', '==', category),
        orderBy('views', 'desc'),
        limit(limitCount + 1) // Get one extra in case we filter out current article
      );

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs
        .map((doc) => this.convertDocToArticle(doc.id, doc.data()))
        .filter((article) => article.id !== articleId) // Exclude current article
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error getting related articles:', error);
      return [];
    }
  }

  /**
   * Increment article view count
   */
  async incrementViews(id: string): Promise<void> {
    try {
      const articleRef = doc(db, ARTICLES_COLLECTION, id);
      const articleSnap = await getDoc(articleRef);

      if (articleSnap.exists()) {
        const currentViews = articleSnap.data().views || 0;
        await updateDoc(articleRef, {
          views: currentViews + 1,
        });
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Don't throw - view counting is not critical
    }
  }

  /**
   * Search articles by keyword
   */
  async searchArticles(keyword: string): Promise<Article[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // For production, consider using Algolia or similar service
      // This is a simple keyword match in title and tags

      const allArticles = await this.getPublishedArticles();

      const keywordLower = keyword.toLowerCase();

      return allArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(keywordLower) ||
          article.excerpt.toLowerCase().includes(keywordLower) ||
          article.keywords.some((k) => k.toLowerCase().includes(keywordLower)) ||
          article.tags.some((t) => t.toLowerCase().includes(keywordLower))
      );
    } catch (error) {
      console.error('Error searching articles:', error);
      throw new Error('Failed to search articles');
    }
  }

  /**
   * Generate a unique slug from title
   */
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  /**
   * Check if slug is unique
   */
  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    const article = await this.getArticleBySlug(slug);

    if (!article) return true;
    if (excludeId && article.id === excludeId) return true;

    return false;
  }

  /**
   * Convert Firestore document to Article type
   */
  private convertDocToArticle(id: string, data: DocumentData): Article {
    return {
      id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      keywords: data.keywords || [],
      focusKeyword: data.focusKeyword,
      category: data.category,
      relatedTools: data.relatedTools || [],
      tags: data.tags || [],
      trendingTopics: data.trendingTopics || [],
      targetSearchQueries: data.targetSearchQueries || [],
      author: data.author,
      status: data.status,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      publishedAt: data.publishedAt?.toDate() || undefined,
      views: data.views || 0,
      featured: data.featured || false,
      aiGenerated: data.aiGenerated || false,
      aiPrompt: data.aiPrompt,
      aiModel: data.aiModel,
    };
  }
}

// Export singleton instance
export const articleService = new ArticleService();
