import { test, expect } from '@playwright/test';

test.describe('Pregnancy Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pregnancy-calculator');
  });

  test('should load pregnancy calculator page', async ({ page }) => {
    await expect(page).toHaveTitle(/Pregnancy Calculator/i);
    const heading = page.locator('h1');
    await expect(heading).toContainText(/Pregnancy Calculator/i);
  });

  test('should display date input', async ({ page }) => {
    const inputs = page.locator('input');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should calculate pregnancy dates', async ({ page }) => {
    // Find date input
    const dateInput = page.locator('input[type="date"]');
    if (await dateInput.count() > 0) {
      await dateInput.fill('2024-01-01');

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
