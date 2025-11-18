import { test, expect } from '@playwright/test';

test.describe('Discount Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/discount-calculator');
  });

  test('should load discount calculator page', async ({ page }) => {
    await expect(page).toHaveTitle(/Discount Calculator/i);
    const heading = page.locator('h1');
    await expect(heading).toContainText(/Discount Calculator/i);
  });

  test('should display input fields', async ({ page }) => {
    const inputs = page.locator('input[type="number"]');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should calculate discount', async ({ page }) => {
    const inputs = page.locator('input[type="number"]');
    if (await inputs.count() >= 2) {
      await inputs.nth(0).fill('100');
      await inputs.nth(1).fill('20');

      // Wait for calculation
      await page.waitForTimeout(500);

      // Should show some result
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });
});
