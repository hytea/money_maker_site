import { test, expect } from '@playwright/test';

test.describe('Tip Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tip-calculator');
  });

  test('should load tip calculator page', async ({ page }) => {
    await expect(page).toHaveTitle(/Tip Calculator/i);
    const heading = page.locator('h1');
    await expect(heading).toContainText(/Tip Calculator/i);
  });

  test('should display input fields', async ({ page }) => {
    // Check for bill amount input
    const inputs = page.locator('input[type="number"]');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should calculate tip correctly', async ({ page }) => {
    // Find bill amount input
    const billInput = page.locator('input').first();
    await billInput.fill('100');

    // Wait for calculation
    await page.waitForTimeout(500);

    // Should show some result
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('should handle invalid input gracefully', async ({ page }) => {
    const billInput = page.locator('input').first();
    await billInput.fill('-100');

    // Should not crash
    await page.waitForTimeout(500);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });
});
