import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('should load about page', async ({ page }) => {
    await expect(page).toHaveTitle(/QuickCalc Tools/i);
    const heading = page.locator('h1');
    await expect(heading).toContainText(/About QuickCalc Tools/i);
  });

  test('should display page content', async ({ page }) => {
    const content = page.locator('body');
    await expect(content).toContainText(/QuickCalc Tools/i);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });
});
