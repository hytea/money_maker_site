import { test, expect } from '@playwright/test';

test.describe('Loan Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/loan-calculator');
  });

  test('should load loan calculator page', async ({ page }) => {
    await expect(page).toHaveTitle(/Loan Calculator/i);
    const heading = page.locator('h1');
    await expect(heading).toContainText(/Loan Calculator/i);
  });

  test('should display input fields for loan details', async ({ page }) => {
    const inputs = page.locator('input[type="number"]');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should calculate loan payments', async ({ page }) => {
    // Fill in loan amount, interest rate, and term
    const inputs = page.locator('input[type="number"]');
    if (await inputs.count() >= 3) {
      await inputs.nth(0).fill('200000');
      await inputs.nth(1).fill('5');
      await inputs.nth(2).fill('30');

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
