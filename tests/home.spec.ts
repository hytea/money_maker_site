import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load home page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/QuickCalc Tools/i);
  });

  test('should display main heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Online Calculators/i);
  });

  test('should display all calculator cards', async ({ page }) => {
    // Should have multiple calculator cards
    const cards = page.locator('[class*="card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have navigation menu', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should navigate to calculator when card is clicked', async ({ page }) => {
    // Find the first calculator link
    const firstCalculatorLink = page.locator('a[href*="/"]').first();
    await firstCalculatorLink.click();

    // Should navigate away from home page
    await page.waitForURL(/\/.+/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });
});
