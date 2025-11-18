# Analytics and AB Testing Documentation

This document describes the analytics and AB testing system implemented in QuickCalc Tools.

## Table of Contents

1. [Overview](#overview)
2. [Analytics System](#analytics-system)
3. [AB Testing System](#ab-testing-system)
4. [Configuration](#configuration)
5. [Usage Examples](#usage-examples)
6. [Analytics Dashboard](#analytics-dashboard)
7. [Best Practices](#best-practices)

## Overview

The analytics and AB testing system provides comprehensive tracking and experimentation capabilities for optimizing web traffic and evaluating website changes.

### Key Features

- **Google Analytics Integration** - Automatically sends events to Google Analytics
- **Local Event Storage** - Stores events in localStorage for dashboard viewing
- **AB Testing Framework** - Assign users to variants and track performance
- **Analytics Dashboard** - View metrics and AB test results
- **Automatic Page View Tracking** - Tracks all page navigations
- **Event Tracking** - Track user interactions and conversions
- **TypeScript Support** - Full type safety throughout

## Analytics System

### Architecture

The analytics system consists of several components:

- `src/lib/analytics.ts` - Core analytics service
- `src/hooks/useAnalytics.ts` - React hooks for analytics
- `src/components/SEO.tsx` - Automatic pageview tracking
- `src/pages/AnalyticsDashboard.tsx` - Analytics dashboard

### Analytics Service

The analytics service (`analytics.ts`) provides a unified interface for tracking events.

#### Initialization

Analytics is automatically initialized in `App.tsx`. You can optionally provide a Google Analytics measurement ID:

```typescript
import { analytics } from '@/lib/analytics';

// Initialize with environment variable
analytics.initialize();

// Or initialize with explicit measurement ID
analytics.initialize('G-XXXXXXXXXX');
```

#### Event Types

The system tracks three types of events:

1. **Page Views** - Tracked automatically when routes change
2. **Custom Events** - User interactions (button clicks, form submissions, etc.)
3. **Conversions** - Important actions like calculator usage

### Using Analytics Hooks

#### useAnalytics Hook

The `useAnalytics` hook provides methods for tracking events:

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function MyComponent() {
  const { trackEvent, trackButtonClick, trackCalculatorResult } = useAnalytics();

  const handleClick = () => {
    trackButtonClick('submit-button', 'my-component');
  };

  return <button onClick={handleClick}>Submit</button>;
}
```

Available methods:

- `trackEvent(event)` - Track a custom event
- `trackCalculatorInput(tool, field, value)` - Track input changes
- `trackCalculatorResult(tool, metadata)` - Track calculator usage
- `trackButtonClick(buttonName, location)` - Track button clicks
- `trackNavigation(from, to)` - Track navigation
- `trackPageView(path, title)` - Manually track page views

#### useCalculatorTracking Hook

Automatically track calculator usage:

```typescript
import { useCalculatorTracking } from '@/hooks/useAnalytics';

function Calculator() {
  const [value, setValue] = useState(0);

  // Automatically tracks when value changes (and is valid)
  useCalculatorTracking('my-calculator', [value]);

  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

#### useButtonTracking Hook

Simplified button click tracking:

```typescript
import { useButtonTracking } from '@/hooks/useAnalytics';

function MyComponent() {
  const { trackClick } = useButtonTracking('my-component');

  return (
    <button onClick={() => trackClick('submit-button')}>
      Submit
    </button>
  );
}
```

## AB Testing System

### Architecture

The AB testing system consists of:

- `src/config/abTests.ts` - AB test configuration
- `src/context/ABTestingContext.tsx` - AB testing provider and hooks
- `src/components/ABTest.tsx` - Components for rendering variants

### How AB Testing Works

1. **Variant Assignment** - Users are randomly assigned to variants based on weighted probabilities
2. **Consistent Assignment** - Assignments are stored in localStorage and remain consistent
3. **Deterministic Randomization** - Uses a hash-based approach for reproducible assignments
4. **Automatic Tracking** - Views and conversions are automatically tracked

### Creating AB Tests

Define AB tests in `src/config/abTests.ts`:

```typescript
export const abTests: ABTest[] = [
  {
    id: 'my-test',
    name: 'My Test',
    description: 'Test different button colors',
    enabled: true,
    variants: [
      {
        id: 'control',
        name: 'Control',
        weight: 0.5, // 50% of users
        description: 'Blue button',
      },
      {
        id: 'variant-a',
        name: 'Variant A',
        weight: 0.5, // 50% of users
        description: 'Green button',
      },
    ],
  },
];
```

**Important:** Variant weights must sum to 1.0.

### Using AB Tests

#### ABTest Component

Render different content for different variants:

```typescript
import { ABTest } from '@/components/ABTest';

function MyPage() {
  return (
    <ABTest
      testId="my-test"
      variants={{
        control: <button className="bg-blue-500">Click Me</button>,
        'variant-a': <button className="bg-green-500">Click Me</button>,
      }}
    />
  );
}
```

#### ABTestVariant Component

Conditionally render content for a specific variant:

```typescript
import { ABTestVariant } from '@/components/ABTest';

function MyPage() {
  return (
    <>
      <h1>My Page</h1>
      <ABTestVariant testId="my-test" variantId="variant-a">
        <NewFeature />
      </ABTestVariant>
    </>
  );
}
```

#### useVariant Hook

Get the assigned variant for a test:

```typescript
import { useVariant } from '@/context/ABTestingContext';

function MyComponent() {
  const variant = useVariant('my-test');

  const buttonColor = variant === 'variant-a' ? 'green' : 'blue';

  return <button className={`bg-${buttonColor}-500`}>Click Me</button>;
}
```

#### useIsVariant Hook

Check if user is in a specific variant:

```typescript
import { useIsVariant } from '@/context/ABTestingContext';

function MyComponent() {
  const isVariantA = useIsVariant('my-test', 'variant-a');

  return isVariantA ? <NewFeature /> : <OldFeature />;
}
```

#### useABTest Hook

Access AB testing methods:

```typescript
import { useABTest } from '@/context/ABTestingContext';

function MyComponent() {
  const {
    getVariant,
    isVariant,
    trackExperimentConversion,
    resetAssignments
  } = useABTest();

  const handleConversion = () => {
    trackExperimentConversion('my-test', { value: 100 });
  };

  return <button onClick={handleConversion}>Convert</button>;
}
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Google Analytics Measurement ID (optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

To get a Google Analytics measurement ID:

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new property
3. Copy the measurement ID (format: G-XXXXXXXXXX)
4. Add it to your `.env` file

### AB Test Configuration

Edit `src/config/abTests.ts` to add or modify tests:

- Set `enabled: true` to activate a test
- Set `enabled: false` to deactivate a test
- Adjust variant weights to change traffic distribution
- Add `startDate` and `endDate` to schedule tests

## Analytics Dashboard

Access the analytics dashboard at `/analytics` to view:

- **Overview Stats** - Total page views, events, and conversions
- **Page Views by Path** - Most visited pages
- **Calculator Usage** - Calculations per tool
- **AB Test Results** - Performance metrics for each variant
- **Current Assignments** - Your assigned variants

### Dashboard Features

- **Refresh** - Reload analytics data
- **Export** - Download analytics as JSON
- **Reset AB Tests** - Reassign yourself to new variants
- **Clear Data** - Remove all stored analytics

## Usage Examples

### Example 1: Track Calculator Usage

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

export function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tip, setTip] = useState(0);
  const { trackCalculatorResult } = useAnalytics();

  useEffect(() => {
    if (bill && parseFloat(bill) > 0) {
      const tipAmount = parseFloat(bill) * 0.15;
      setTip(tipAmount);

      // Track the calculation
      trackCalculatorResult('tip-calculator', {
        billAmount: parseFloat(bill),
        tipAmount,
      });
    }
  }, [bill, trackCalculatorResult]);

  return <input value={bill} onChange={e => setBill(e.target.value)} />;
}
```

### Example 2: Track Button Clicks

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

export function QuickTipButtons() {
  const { trackButtonClick } = useAnalytics();

  const handleQuickTip = (percent: number) => {
    setTipPercent(percent);
    trackButtonClick(`quick-tip-${percent}`, 'tip-calculator');
  };

  return (
    <div>
      <button onClick={() => handleQuickTip(15)}>15%</button>
      <button onClick={() => handleQuickTip(20)}>20%</button>
    </div>
  );
}
```

### Example 3: AB Test Button Color

```typescript
import { ABTest } from '@/components/ABTest';

export function HomePage() {
  return (
    <ABTest
      testId="homepage-cta"
      variants={{
        control: (
          <button className="bg-blue-500">
            Get Started
          </button>
        ),
        'variant-a': (
          <button className="bg-green-500">
            Start Calculating
          </button>
        ),
      }}
    />
  );
}
```

### Example 4: AB Test Layout

```typescript
import { useVariant } from '@/context/ABTestingContext';

export function Calculator() {
  const layout = useVariant('calculator-layout');

  if (layout === 'variant-a') {
    // Stacked layout
    return (
      <div className="flex flex-col">
        <InputSection />
        <ResultsSection />
      </div>
    );
  }

  // Default sidebar layout
  return (
    <div className="grid grid-cols-2">
      <InputSection />
      <ResultsSection />
    </div>
  );
}
```

## Best Practices

### Analytics

1. **Track Meaningful Events** - Focus on user interactions that matter
2. **Add Context** - Include metadata with events for better analysis
3. **Avoid Over-Tracking** - Don't track every single interaction
4. **Test Tracking** - Use the analytics dashboard to verify events
5. **Respect Privacy** - Only track anonymous usage data

### AB Testing

1. **Clear Hypotheses** - Know what you're testing and why
2. **One Test at a Time** - Avoid running conflicting tests
3. **Sufficient Sample Size** - Run tests long enough to get meaningful data
4. **Statistical Significance** - Don't make decisions on small sample sizes
5. **Document Results** - Record what you learned from each test
6. **Clean Up** - Remove or disable tests after they're complete

### Performance

1. **Debounce Input Tracking** - Avoid tracking every keystroke
2. **Batch Events** - The system automatically batches to localStorage
3. **Limit Storage** - System keeps last 1000 events automatically
4. **Monitor Impact** - Analytics should not slow down the site

## Troubleshooting

### Google Analytics Not Working

- Check that `VITE_GA_MEASUREMENT_ID` is set in `.env`
- Verify measurement ID format (G-XXXXXXXXXX)
- Check browser console for errors
- Verify gtag script loaded in network tab

### AB Tests Not Showing

- Verify test is `enabled: true` in `abTests.ts`
- Check variant weights sum to 1.0
- Clear localStorage and refresh to get new assignment
- Check console for errors

### Analytics Dashboard Empty

- Use the site to generate events
- Check that analytics is initialized in App.tsx
- Verify localStorage is enabled in browser
- Try refreshing the dashboard

### Events Not Tracked

- Verify analytics is initialized
- Check that hooks are used correctly
- Look for TypeScript errors
- Check browser console for warnings

## Future Enhancements

Potential improvements to consider:

- Server-side analytics storage
- Real-time analytics updates
- Advanced funnel analysis
- Cohort analysis
- Multi-variant testing (A/B/C/D)
- Automated test winner selection
- Email reports
- Integration with other analytics platforms
