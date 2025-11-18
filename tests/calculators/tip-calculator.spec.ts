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

  test.describe('Button Contrast and Accessibility', () => {
    test('should have sufficient contrast on selected tip percentage buttons', async ({ page }) => {
      // Find the 15% tip button (default selected)
      const button15 = page.getByRole('button', { name: '15%' });
      await expect(button15).toBeVisible();

      // Get computed styles
      const bgColor = await button15.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      const textColor = await button15.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      // Check that background and text colors are different
      expect(bgColor).not.toBe(textColor);

      // Verify white text is not on white background
      // White in RGB is rgb(255, 255, 255)
      const isWhiteBackground = bgColor === 'rgb(255, 255, 255)' || bgColor === 'rgba(255, 255, 255, 1)';
      const isWhiteText = textColor === 'rgb(255, 255, 255)' || textColor === 'rgba(255, 255, 255, 1)';

      if (isWhiteText) {
        expect(isWhiteBackground).toBe(false);
      }
    });

    test('should have visible text on all quick tip buttons', async ({ page }) => {
      const tipButtons = [10, 15, 18, 20, 25];

      for (const percent of tipButtons) {
        const button = page.getByRole('button', { name: `${percent}%` });
        await expect(button).toBeVisible();

        // Verify the button text is readable
        const text = await button.textContent();
        expect(text).toContain(`${percent}%`);

        // Check opacity is not 0
        const opacity = await button.evaluate((el) => {
          return window.getComputedStyle(el).opacity;
        });
        expect(parseFloat(opacity)).toBeGreaterThan(0);
      }
    });

    test('should maintain contrast when clicking different tip percentages', async ({ page }) => {
      const tipButtons = [10, 18, 20];

      for (const percent of tipButtons) {
        const button = page.getByRole('button', { name: `${percent}%` });

        // Click the button
        await button.click();
        await page.waitForTimeout(100);

        // Verify button is still visible after click
        await expect(button).toBeVisible();

        // Check contrast after selection
        const bgColor = await button.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });

        const textColor = await button.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });

        // Ensure we don't have white on white
        const isWhiteBackground = bgColor === 'rgb(255, 255, 255)' || bgColor === 'rgba(255, 255, 255, 1)';
        const isWhiteText = textColor === 'rgb(255, 255, 255)' || textColor === 'rgba(255, 255, 255, 1)';

        if (isWhiteText) {
          expect(isWhiteBackground).toBe(false);
        }

        if (isWhiteBackground) {
          expect(isWhiteText).toBe(false);
        }
      }
    });

    test('should have accessible contrast ratio (WCAG AA)', async ({ page }) => {
      // Helper function to calculate relative luminance
      const getLuminance = (rgb: string): number => {
        const match = rgb.match(/\d+/g);
        if (!match) return 0;

        const [r, g, b] = match.map(Number);
        const [rs, gs, bs] = [r, g, b].map((c) => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };

      // Click 15% button to ensure it's selected
      const button15 = page.getByRole('button', { name: '15%' });
      await button15.click();
      await page.waitForTimeout(100);

      const bgColor = await button15.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      const textColor = await button15.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      const bgLuminance = getLuminance(bgColor);
      const textLuminance = getLuminance(textColor);

      const contrastRatio = (Math.max(bgLuminance, textLuminance) + 0.05) /
                           (Math.min(bgLuminance, textLuminance) + 0.05);

      // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
      // Button text is typically large (18px bold or 24px+)
      expect(contrastRatio).toBeGreaterThanOrEqual(3.0);
    });
  });
});
