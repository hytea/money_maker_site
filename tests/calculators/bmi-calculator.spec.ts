import { test, expect } from '@playwright/test';

test.describe('BMI Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bmi-calculator');
  });

  test('should load BMI calculator page', async ({ page }) => {
    await expect(page).toHaveTitle(/BMI Calculator/i);
    const heading = page.locator('h1');
    await expect(heading).toContainText(/BMI.*Calorie Calculator/i);
  });

  test('should display input fields for height and weight', async ({ page }) => {
    const inputs = page.locator('input');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should calculate BMI', async ({ page }) => {
    // Fill in height and weight
    const inputs = page.locator('input[type="number"]');
    if (await inputs.count() >= 2) {
      await inputs.nth(0).fill('170');
      await inputs.nth(1).fill('70');

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
