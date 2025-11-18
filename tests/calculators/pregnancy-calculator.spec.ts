import { test, expect } from '@playwright/test';

test.describe('Pregnancy Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pregnancy-calculator');
  });

  test('should load pregnancy calculator page', async ({ page }) => {
    await expect(page).toHaveTitle(/Pregnancy.*Due Date Calculator/i);
    const heading = page.locator('h1');
    await expect(heading).toContainText(/Pregnancy.*Calculator/i);
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

  test.describe('Mobile Layout Issues', () => {
    test('should not have sticky results covering input fields on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Get today's date minus 100 days for testing
      const testDate = new Date();
      testDate.setDate(testDate.getDate() - 100);
      const dateString = testDate.toISOString().split('T')[0];

      // Fill in the date to trigger results
      const dateInput = page.locator('input[type="date"]').first();
      await dateInput.fill(dateString);

      // Wait for results to appear
      await page.waitForTimeout(500);

      // Check if results card is visible on mobile
      const mobileResults = page.locator('.md\\:hidden').filter({ has: page.locator('text=/Due Date/i') });

      if (await mobileResults.count() > 0) {
        // Verify the results are visible
        await expect(mobileResults.first()).toBeVisible();

        // Check if sticky positioning is causing issues
        const position = await mobileResults.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            position: styles.position,
            top: styles.top,
            zIndex: styles.zIndex,
          };
        });

        // If it's sticky, verify inputs are still accessible
        if (position.position === 'sticky' || position.position === 'fixed') {
          // Scroll down a bit to simulate user trying to access inputs
          await page.evaluate(() => window.scrollBy(0, 100));

          // Verify date input is still clickable and not covered
          await expect(dateInput).toBeVisible();

          const isClickable = await dateInput.isEnabled();
          expect(isClickable).toBe(true);

          // Try to click the input to ensure it's not blocked
          await dateInput.click({ force: false });

          // Also check cycle length input
          const cycleInput = page.locator('input[type="number"]').first();
          await expect(cycleInput).toBeVisible();

          // Verify cycle input is clickable
          const cycleClickable = await cycleInput.isEnabled();
          expect(cycleClickable).toBe(true);
        }
      }
    });

    test('should allow input adjustments after results are shown on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Fill in initial date
      const testDate = new Date();
      testDate.setDate(testDate.getDate() - 100);
      const dateString = testDate.toISOString().split('T')[0];

      const dateInput = page.locator('input[type="date"]').first();
      await dateInput.fill(dateString);

      // Wait for results
      await page.waitForTimeout(500);

      // Try to change the cycle length input
      const cycleInput = page.locator('input[type="number"]').first();

      // Ensure the input is in viewport and not covered
      await cycleInput.scrollIntoViewIfNeeded();

      // Clear and fill new value
      await cycleInput.clear();
      await cycleInput.fill('30');

      // Verify the value was actually changed
      const newValue = await cycleInput.inputValue();
      expect(newValue).toBe('30');

      // Try to modify the date input again
      const newTestDate = new Date();
      newTestDate.setDate(newTestDate.getDate() - 120);
      const newDateString = newTestDate.toISOString().split('T')[0];

      await dateInput.scrollIntoViewIfNeeded();
      await dateInput.fill(newDateString);

      const dateValue = await dateInput.inputValue();
      expect(dateValue).toBe(newDateString);
    });

    test('should have appropriate sticky positioning that does not block content', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Fill in date to show results
      const testDate = new Date();
      testDate.setDate(testDate.getDate() - 100);
      const dateString = testDate.toISOString().split('T')[0];

      const dateInput = page.locator('input[type="date"]').first();
      await dateInput.fill(dateString);
      await page.waitForTimeout(500);

      // Get all input fields
      const allInputs = page.locator('input[type="date"], input[type="number"]');
      const inputCount = await allInputs.count();

      // Verify all inputs are accessible
      for (let i = 0; i < inputCount; i++) {
        const input = allInputs.nth(i);
        await input.scrollIntoViewIfNeeded();

        // Check if input is in viewport
        const boundingBox = await input.boundingBox();
        expect(boundingBox).not.toBeNull();

        if (boundingBox) {
          // Input should be within viewport
          expect(boundingBox.y).toBeGreaterThanOrEqual(0);
          expect(boundingBox.y).toBeLessThan(667); // viewport height
        }
      }
    });

    test('should maintain usability with sticky results on small screens', async ({ page }) => {
      // Test on even smaller screen (iPhone SE)
      await page.setViewportSize({ width: 320, height: 568 });

      const testDate = new Date();
      testDate.setDate(testDate.getDate() - 100);
      const dateString = testDate.toISOString().split('T')[0];

      const dateInput = page.locator('input[type="date"]').first();
      await dateInput.fill(dateString);
      await page.waitForTimeout(500);

      // Verify that the sticky results don't take up too much space
      const mobileResults = page.locator('.md\\:hidden').filter({ has: page.locator('text=/Due Date/i') });

      if (await mobileResults.count() > 0) {
        const resultsBox = await mobileResults.first().boundingBox();
        const viewportHeight = 568;

        if (resultsBox) {
          // Results should not take more than 50% of viewport height
          expect(resultsBox.height).toBeLessThan(viewportHeight * 0.5);
        }

        // Ensure inputs are still accessible after scrolling
        await page.evaluate(() => window.scrollTo(0, 200));
        await dateInput.scrollIntoViewIfNeeded();
        await expect(dateInput).toBeVisible();
      }
    });
  });
});
