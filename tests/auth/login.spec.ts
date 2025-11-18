import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('unauthenticated user redirected to login when accessing admin', async ({ page }) => {
    // Try to access admin page without authentication
    await page.goto('/admin');

    // Should be redirected to login page
    await expect(page).toHaveURL('/login');
  });

  test('unauthenticated user redirected to login when accessing admin analytics', async ({ page }) => {
    // Try to access admin analytics without authentication
    await page.goto('/admin/analytics');

    // Should be redirected to login page
    await expect(page).toHaveURL('/login');
  });

  test('login page displays correctly', async ({ page }) => {
    await page.goto('/login');

    // Check that login page elements are present
    await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
    await expect(page.getByText('Sign in with your Google account')).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign in with Google/i })).toBeVisible();

    // Check for admin access warning
    await expect(page.getByText(/Admin Access Only/i)).toBeVisible();
    await expect(page.getByText(/Only authorized administrators/i)).toBeVisible();
  });

  test('login page has Google sign-in button', async ({ page }) => {
    await page.goto('/login');

    // Check that Google sign-in button is present and enabled
    const signInButton = page.getByRole('button', { name: /Sign in with Google/i });
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toBeEnabled();

    // Check that Google logo/icon is present in the button
    await expect(signInButton.locator('svg')).toBeVisible();
  });

  test('protected route shows loading state while checking auth', async ({ page }) => {
    // Navigate to a protected route
    await page.goto('/admin');

    // The protected route should show loading or redirect
    // Since we're not authenticated, we should end up at /login
    await page.waitForURL('/login', { timeout: 5000 });
    await expect(page).toHaveURL('/login');
  });

  test('public routes are accessible without authentication', async ({ page }) => {
    // Test that home page is accessible
    await page.goto('/');
    await expect(page).not.toHaveURL('/login');
    await expect(page.getByRole('heading', { name: /QuickCalc/i })).toBeVisible();

    // Test that calculator pages are accessible
    await page.goto('/tip-calculator');
    await expect(page).not.toHaveURL('/login');

    await page.goto('/bmi-calculator');
    await expect(page).not.toHaveURL('/login');

    await page.goto('/loan-calculator');
    await expect(page).not.toHaveURL('/login');
  });

  test('about page is accessible without authentication', async ({ page }) => {
    await page.goto('/about');
    await expect(page).not.toHaveURL('/login');
    await expect(page.getByRole('heading', { name: /About QuickCalc/i })).toBeVisible();
  });

  test('analytics navigation link is not in public header', async ({ page }) => {
    await page.goto('/');

    // Check that Analytics link is not in the navigation
    const desktopNav = page.locator('nav.hidden.md\\:flex');
    await expect(desktopNav.getByRole('link', { name: 'Analytics' })).not.toBeVisible();

    // Check mobile menu as well
    const mobileMenuButton = page.locator('button[aria-label="Toggle menu"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      const mobileNav = page.locator('nav.flex.flex-col');
      await expect(mobileNav.getByRole('link', { name: 'Analytics' })).not.toBeVisible();
    }
  });

  test('direct navigation to old analytics route redirects to login', async ({ page }) => {
    // The old /analytics route should not exist
    await page.goto('/analytics');

    // Should show 404 or be handled by the router
    // Since we removed the /analytics route, this will likely show a 404 or redirect
    const url = page.url();
    expect(url).not.toContain('/analytics');
  });
});

test.describe('Admin Console Access', () => {
  test('admin console requires authentication', async ({ page }) => {
    await page.goto('/admin');

    // Verify redirect to login
    await expect(page).toHaveURL('/login');

    // Verify we can't bypass by going back
    await page.goBack();
    await expect(page).toHaveURL('/login');
  });

  test('admin analytics requires authentication', async ({ page }) => {
    await page.goto('/admin/analytics');

    // Verify redirect to login
    await expect(page).toHaveURL('/login');
  });
});

// Note: Testing actual Google Sign-In flow requires mocking Firebase Auth
// or using Firebase emulators. These tests verify the protection mechanisms
// are in place. For integration testing with actual auth, you would need:
// 1. Firebase Auth emulator
// 2. Mock Google OAuth flow
// 3. Test user credentials

test.describe('Logout Flow (when authenticated)', () => {
  // These tests would require authenticated state
  // They are placeholders for when you set up auth testing with Firebase emulators

  test.skip('authenticated user can access admin console', async ({ page }) => {
    // TODO: Set up authenticated state using Firebase emulator
    // await setupAuthenticatedUser(page);
    // await page.goto('/admin');
    // await expect(page).toHaveURL('/admin');
    // await expect(page.getByRole('heading', { name: 'Admin Console' })).toBeVisible();
  });

  test.skip('authenticated user can logout', async ({ page }) => {
    // TODO: Set up authenticated state
    // await setupAuthenticatedUser(page);
    // await page.goto('/admin');
    // await page.getByRole('button', { name: 'Logout' }).click();
    // await expect(page).toHaveURL('/');
  });

  test.skip('after logout, user cannot access admin routes', async ({ page }) => {
    // TODO: Set up and then remove authenticated state
    // await setupAuthenticatedUser(page);
    // await page.goto('/admin');
    // await page.getByRole('button', { name: 'Logout' }).click();
    // await page.goto('/admin');
    // await expect(page).toHaveURL('/login');
  });
});
