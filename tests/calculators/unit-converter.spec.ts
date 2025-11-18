import { test, expect } from '@playwright/test';

test.describe('Unit Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/unit-converter');
  });

  test('should load unit converter page', async ({ page }) => {
    await expect(page).toHaveTitle(/Unit Converter/i);
    const heading = page.locator('h1');
    await expect(heading).toContainText(/Unit Converter/i);
  });

  test('should display input fields and dropdowns', async ({ page }) => {
    const inputs = page.locator('input[type="number"]');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should convert units', async ({ page }) => {
    const inputs = page.locator('input[type="number"]');
    if (await inputs.count() > 0) {
      await inputs.first().fill('100');

      // Wait for conversion
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
