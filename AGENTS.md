# Agent Development Guide

This document provides comprehensive guidance for AI agents (like Claude) working on the QuickCalc Tools project. It covers the testing system, development workflows, and best practices.

## Table of Contents

- [Testing System](#testing-system)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Adding New Features](#adding-new-features)
- [Best Practices](#best-practices)

---

## Testing System

### Overview

QuickCalc Tools uses **Playwright** for end-to-end testing. Tests run automatically on every pull request via GitHub Actions, ensuring code quality and preventing regressions.

### Technology Stack

- **Test Framework**: Playwright (@playwright/test)
- **Browser**: Chromium (can be extended to Firefox and WebKit)
- **CI/CD**: GitHub Actions
- **Language**: TypeScript

### Running Tests Locally

#### Prerequisites

Ensure all dependencies are installed:

```bash
npm install
```

#### Test Commands

```bash
# Run all tests
npm test

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests with Playwright Inspector
npm run test:debug

# View last test report
npm run test:report
```

#### First Time Setup

If you haven't installed Playwright browsers yet:

```bash
npx playwright install chromium
```

### Test Structure

Tests are organized in the `tests/` directory:

```
tests/
├── home.spec.ts                    # Home page tests
├── navigation.spec.ts              # Navigation and routing tests
├── about.spec.ts                   # About page tests
└── calculators/
    ├── tip-calculator.spec.ts      # Tip calculator tests
    ├── loan-calculator.spec.ts     # Loan calculator tests
    ├── bmi-calculator.spec.ts      # BMI calculator tests
    ├── pregnancy-calculator.spec.ts # Pregnancy calculator tests
    ├── discount-calculator.spec.ts  # Discount calculator tests
    ├── age-calculator.spec.ts       # Age calculator tests
    └── unit-converter.spec.ts       # Unit converter tests
```

### Test Coverage

Current test coverage includes:

1. **Home Page**
   - Page loads successfully
   - Main heading displays
   - All calculator cards are visible
   - Navigation menu is present
   - Calculator links work
   - Responsive design on mobile

2. **Navigation**
   - Home navigation from logo
   - About page navigation
   - Analytics dashboard navigation
   - Browser back/forward buttons

3. **Calculator Pages** (All calculators)
   - Page loads with correct title
   - Input fields are present
   - Basic calculations work
   - Invalid input handling
   - Responsive design on mobile

4. **About Page**
   - Page loads correctly
   - Content displays properly
   - Responsive design

### GitHub Actions CI/CD

Tests run automatically on:
- Pull requests to `main` or `master` branches
- Pushes to `main` or `master` branches

#### Workflow Configuration

The GitHub Actions workflow is defined in `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps chromium
    - name: Run Playwright tests
      run: npm test
    - name: Upload test report
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

#### Viewing Test Reports in CI

If tests fail in CI:
1. Go to the GitHub Actions tab
2. Click on the failed workflow run
3. Download the `playwright-report` artifact
4. Extract and open `index.html` to view the detailed report

---

## Development Workflow

### For AI Agents

When working on this project, follow this workflow:

#### 1. Pull Latest Changes

```bash
git pull origin claude/add-playwright-testing-01QqfXidTQVjF8woLh2Fw74N
```

#### 2. Make Your Changes

- Add new features
- Fix bugs
- Update documentation

#### 3. Run Tests Locally

```bash
npm test
```

Ensure all tests pass before committing.

#### 4. Add New Tests (If Applicable)

If you added new features, write corresponding tests. See [Adding New Tests](#adding-new-tests) below.

#### 5. Commit and Push

```bash
git add .
git commit -m "Description of changes"
git push -u origin claude/add-playwright-testing-01QqfXidTQVjF8woLh2Fw74N
```

#### 6. Create Pull Request

Tests will run automatically on the PR. Ensure they pass before merging.

---

## Project Structure

### Key Files and Directories

```
money_maker_site/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions workflow
├── src/
│   ├── components/                 # Reusable React components
│   │   ├── ui/                     # Shadcn UI components
│   │   ├── Layout.tsx              # Main layout wrapper
│   │   ├── SEO.tsx                 # SEO meta tags
│   │   ├── AdSense.tsx             # Ad integration
│   │   └── ABTest.tsx              # A/B testing component
│   ├── config/
│   │   ├── tools.tsx               # Tool registry
│   │   └── abTests.ts              # A/B test configurations
│   ├── context/
│   │   └── ABTestingContext.tsx    # A/B testing state
│   ├── hooks/
│   │   └── useAnalytics.ts         # Analytics hook
│   ├── lib/
│   │   ├── analytics.ts            # Analytics utilities
│   │   └── utils.ts                # General utilities
│   ├── pages/                      # Page components
│   │   ├── Home.tsx
│   │   ├── TipCalculator.tsx
│   │   ├── LoanCalculator.tsx
│   │   ├── BMICalculator.tsx
│   │   ├── PregnancyCalculator.tsx
│   │   ├── DiscountCalculator.tsx
│   │   ├── AgeCalculator.tsx
│   │   ├── SplitBillCalculator.tsx
│   │   ├── UnitConverter.tsx
│   │   └── AnalyticsDashboard.tsx
│   ├── App.tsx                     # Main app component
│   └── main.tsx                    # Entry point
├── tests/                          # Playwright tests
│   ├── home.spec.ts
│   ├── navigation.spec.ts
│   ├── about.spec.ts
│   └── calculators/
│       └── *.spec.ts
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Dependencies and scripts
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS config
├── tsconfig.json                   # TypeScript config
├── README.md                       # Project documentation
└── AGENTS.md                       # This file
```

---

## Adding New Features

### Adding a New Calculator

When adding a new calculator, follow these steps:

#### 1. Create the Calculator Component

Create a new file in `src/pages/YourCalculator.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdPlaceholder } from '@/components/AdSense';

export function YourCalculator() {
  useEffect(() => {
    document.title = 'Your Calculator - Description | QuickCalc Tools';
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Calculator</h1>
      {/* Add your calculator UI here */}
      <AdPlaceholder label="Calculator Ad" />
    </div>
  );
}
```

#### 2. Register in Tool Config

Edit `src/config/tools.tsx`:

```tsx
import { YourCalculator } from '@/pages/YourCalculator';

// Add to tools array:
{
  name: 'Your Calculator',
  path: '/your-calculator',
  component: YourCalculator,
  description: 'Brief description',
  icon: Calculator,
  color: 'text-blue-600',
  bgColor: 'bg-blue-50',
  title: 'Your Calculator - SEO Title | QuickCalc Tools',
  metaDescription: 'SEO meta description',
  keywords: ['keyword1', 'keyword2'],
  searchVolume: 'high'
}
```

#### 3. Add Tests

Create `tests/calculators/your-calculator.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Your Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-calculator');
  });

  test('should load your calculator page', async ({ page }) => {
    await expect(page).toHaveTitle(/Your Calculator/i);
    const heading = page.locator('h1');
    await expect(heading).toContainText(/Your Calculator/i);
  });

  test('should display input fields', async ({ page }) => {
    const inputs = page.locator('input');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should perform calculation', async ({ page }) => {
    // Add test logic here
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });
});
```

#### 4. Run Tests

```bash
npm test
```

#### 5. Update Sitemap

Add to `public/sitemap.xml`:

```xml
<url>
  <loc>https://quickcalc.tools/your-calculator</loc>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

### Adding New Tests

#### Test Structure

Each test file should:
1. Import Playwright test utilities
2. Group related tests in `test.describe` blocks
3. Use `test.beforeEach` for common setup
4. Write clear, descriptive test names
5. Use proper assertions with `expect`

#### Example Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page');
  });

  test('should perform expected action', async ({ page }) => {
    // Arrange
    const button = page.locator('button');

    // Act
    await button.click();

    // Assert
    const result = page.locator('.result');
    await expect(result).toBeVisible();
  });
});
```

---

## Best Practices

### For AI Agents Working on This Project

#### 1. Always Run Tests

- Run tests before committing: `npm test`
- Fix failing tests immediately
- Don't skip or comment out failing tests

#### 2. Write Tests for New Features

- Every new calculator needs tests
- Every new page needs tests
- Test both happy paths and error cases

#### 3. Keep Tests Maintainable

- Use descriptive test names
- Avoid hardcoding values when possible
- Use page objects for complex pages
- Keep tests independent (no shared state)

#### 4. Follow TypeScript Best Practices

- Enable strict type checking
- Avoid `any` types
- Use proper type definitions

#### 5. Responsive Design

- Test on mobile viewports (375x667)
- Test on desktop viewports (1920x1080)
- Ensure all features work on both

#### 6. Performance

- Keep tests fast (avoid unnecessary waits)
- Use `waitForTimeout` sparingly
- Prefer `waitForSelector` or `waitForLoadState`

#### 7. Code Quality

- Follow existing code patterns
- Use ESLint configuration
- Format code consistently
- Add comments for complex logic

#### 8. Documentation

- Update README.md when adding features
- Update this file (AGENTS.md) when changing workflows
- Add JSDoc comments for complex functions

#### 9. Git Workflow

- Commit frequently with clear messages
- Push to the correct branch
- Create descriptive pull requests
- Link issues when applicable

#### 10. CI/CD

- Ensure GitHub Actions pass before merging
- Check test reports for failures
- Don't merge failing PRs

### Common Playwright Patterns

#### Waiting for Elements

```typescript
// Good
await page.waitForSelector('.result');
await expect(page.locator('.result')).toBeVisible();

// Avoid
await page.waitForTimeout(1000); // Only use when absolutely necessary
```

#### Locator Strategies

```typescript
// Prefer semantic locators
await page.locator('role=button[name="Submit"]').click();
await page.getByLabel('Email').fill('test@example.com');

// Fallback to CSS selectors
await page.locator('.submit-button').click();
await page.locator('input[type="email"]').fill('test@example.com');
```

#### Assertions

```typescript
// Use Playwright assertions
await expect(page).toHaveTitle(/Expected Title/);
await expect(element).toBeVisible();
await expect(element).toContainText('Expected text');

// Avoid generic assertions
expect(await element.isVisible()).toBe(true); // Less reliable
```

---

## Troubleshooting

### Tests Failing Locally

1. Ensure dev server is running on port 5173
2. Check Playwright browsers are installed: `npx playwright install chromium`
3. Run with UI mode to debug: `npm run test:ui`
4. Check test reports: `npm run test:report`

### Tests Failing in CI

1. Check GitHub Actions logs
2. Download playwright-report artifact
3. Review screenshots and traces
4. Ensure CI environment matches local setup

### Common Issues

#### Issue: "Page did not navigate to expected URL"

**Solution**: Check that routes are properly configured in `App.tsx`

#### Issue: "Element not found"

**Solution**:
- Verify the element exists on the page
- Check selector is correct
- Add proper wait conditions

#### Issue: "Tests timeout"

**Solution**:
- Increase timeout in playwright.config.ts
- Optimize slow operations
- Check for infinite loops or hanging promises

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [React Testing Guide](https://react.dev/learn/testing)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## Contact

For questions or issues:
- Open a GitHub issue
- Check existing documentation
- Review test examples in `tests/` directory

---

**Last Updated**: 2025-11-18
**Version**: 1.0.0
