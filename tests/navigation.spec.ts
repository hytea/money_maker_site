import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to home page from logo', async ({ page }) => {
    await page.goto('/tip-calculator');

    // Click logo or home link
    const homeLink = page.locator('a[href="/"]').first();
    await homeLink.click();

    await expect(page).toHaveURL('/');
  });

  test('should navigate to about page', async ({ page }) => {
    const aboutLink = page.locator('a[href="/about"]');
    if (await aboutLink.count() > 0) {
      await aboutLink.click();
      await expect(page).toHaveURL('/about');
    }
  });

  test('should navigate to analytics dashboard', async ({ page }) => {
    const analyticsLink = page.locator('a[href="/analytics"]');
    if (await analyticsLink.count() > 0) {
      await analyticsLink.click();
      await expect(page).toHaveURL('/analytics');
    }
  });

  test('should handle browser back button', async ({ page }) => {
    await page.goto('/tip-calculator');
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('should handle browser forward button', async ({ page }) => {
    await page.goto('/tip-calculator');
    await page.goBack();
    await page.goForward();
    await expect(page).toHaveURL('/tip-calculator');
  });
});
