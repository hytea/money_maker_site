# Firebase AB Testing System

A comprehensive AB testing engine built on Firebase Firestore and Firebase Analytics for the QuickCalc Tools platform.

## Overview

This system provides:
- **Firebase Firestore** for remote AB test configuration
- **Firebase Analytics** for tracking experiments and conversions
- **Admin Dashboard** for managing tests
- **Automatic variant assignment** with deterministic randomization
- **Real-time updates** via Firestore subscriptions
- **Fallback to local configuration** if Firebase is unavailable

## Architecture

### Components

1. **Firebase AB Test Service** (`src/services/firebaseABTest.ts`)
   - Manages AB tests in Firestore
   - Tracks events in Firebase Analytics
   - Provides CRUD operations for tests

2. **Firebase AB Testing Context** (`src/context/FirebaseABTestingContext.tsx`)
   - React context for AB test state management
   - Handles variant assignment and tracking
   - Falls back to local tests if Firebase unavailable

3. **AB Test Admin Dashboard** (`src/pages/ABTestAdmin.tsx`)
   - UI for managing AB tests
   - Sync local tests to Firebase
   - View test status and assignments

4. **AB Test Configuration** (`src/config/abTests.ts`)
   - Local AB test definitions
   - Used as fallback and for initial sync

## Setup

### 1. Firebase Configuration

Ensure your Firebase project has:
- **Firestore Database** enabled
- **Firebase Analytics** enabled
- **Authentication** set up (for admin access)

### 2. Firestore Security Rules

Add these security rules to allow AB test management:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // AB Tests collection
    match /ab_tests/{testId} {
      // Anyone can read AB tests
      allow read: if true;

      // Only authenticated users can write
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Initial Setup

1. **Log in as admin**: Navigate to `/login` and sign in with Google
2. **Access AB Test Admin**: Go to `/admin/ab-tests`
3. **Sync local tests**: Click "Sync to Firebase" to upload local test configurations
4. **Verify in Firestore**: Check the Firebase Console to see tests in the `ab_tests` collection

## Usage

### For Developers

#### Using AB Tests in Components

```tsx
import { useFirebaseVariant } from '@/context/FirebaseABTestingContext';

function MyComponent() {
  const variant = useFirebaseVariant('homepage-cta');

  return (
    <div>
      {variant === 'control' && <button>Calculate Now</button>}
      {variant === 'variant-a' && <button>Start Calculating</button>}
    </div>
  );
}
```

#### Using the ABTest Component

```tsx
import { ABTest } from '@/components/ABTest';

function HomePage() {
  return (
    <ABTest
      testId="homepage-cta"
      variants={{
        control: <button>Calculate Now</button>,
        'variant-a': <button>Start Calculating</button>,
      }}
    />
  );
}
```

#### Track Conversions

```tsx
import { useFirebaseABTest } from '@/context/FirebaseABTestingContext';

function Calculator() {
  const { trackExperimentConversion } = useFirebaseABTest();

  const handleCalculate = () => {
    // Perform calculation
    trackExperimentConversion('calculator-layout', {
      tool: 'tip-calculator',
      resultValue: 15.50,
    });
  };

  return <button onClick={handleCalculate}>Calculate</button>;
}
```

### For Administrators

#### Creating a New AB Test

1. Add test configuration to `src/config/abTests.ts`:

```typescript
{
  id: 'new-feature-test',
  name: 'New Feature Test',
  description: 'Test the new premium feature placement',
  enabled: true,
  variants: [
    {
      id: 'control',
      name: 'Control',
      weight: 0.5,
      description: 'Original design',
    },
    {
      id: 'variant-a',
      name: 'New Feature Prominent',
      weight: 0.5,
      description: 'Feature prominently displayed',
    },
  ],
}
```

2. Sync to Firebase via the admin dashboard
3. Use the test ID in your components

#### Monitoring AB Tests

1. **Firebase Analytics Dashboard**:
   - Go to https://console.firebase.google.com/project/smart-calc-app-hub/analytics
   - View events: `ab_test_assignment`, `ab_test_view`, `ab_test_conversion`

2. **AB Test Admin Page**:
   - Navigate to `/admin/ab-tests`
   - View active tests and your current assignments

## AB Test Structure

```typescript
interface ABTest {
  id: string;                // Unique identifier
  name: string;              // Display name
  description: string;       // What the test measures
  variants: ABTestVariant[]; // Test variations
  enabled: boolean;          // Whether test is active
  startDate?: Date;          // Optional start date
  endDate?: Date;            // Optional end date
}

interface ABTestVariant {
  id: string;          // Variant identifier
  name: string;        // Display name
  weight: number;      // Traffic allocation (0-1, must sum to 1)
  description?: string // What makes this variant different
}
```

## Tracking Events

### Event Types

1. **ab_test_assignment**: When a user is assigned to a variant
   ```javascript
   {
     test_id: 'homepage-cta',
     variant_id: 'variant-a',
     user_id: 'user_123'
   }
   ```

2. **ab_test_view**: When a user sees an experiment
   ```javascript
   {
     test_id: 'homepage-cta',
     variant_id: 'variant-a'
   }
   ```

3. **ab_test_conversion**: When a user completes the goal action
   ```javascript
   {
     test_id: 'calculator-layout',
     variant_id: 'control',
     // Custom metadata
     tool: 'tip-calculator',
     resultValue: 15.50
   }
   ```

## Best Practices

### Test Design

1. **One Variable at a Time**: Test one change per experiment
2. **Clear Hypothesis**: Know what you're testing and why
3. **Sufficient Sample Size**: Run tests long enough to get meaningful data
4. **Statistical Significance**: Aim for 95% confidence before making decisions

### Weight Distribution

- Weights must sum to 1.0 for all variants
- Equal weights (0.5/0.5) for A/B tests
- Can use unequal weights (e.g., 0.8/0.2) for gradual rollouts

### Test Duration

- **Minimum**: 1-2 weeks for sufficient data
- **Consider**: Day-of-week effects, seasonal variations
- **Set end dates**: Automatically disable tests after conclusion

## Firestore Data Structure

### Collection: `ab_tests`

```
ab_tests/
├── homepage-cta/
│   ├── id: "homepage-cta"
│   ├── name: "Homepage CTA Button Text"
│   ├── description: "Test different call-to-action..."
│   ├── enabled: true
│   ├── variants: [...]
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
└── calculator-layout/
    └── ...
```

## Free Tier Limits

### Firestore
- **Reads**: 50,000 per day
- **Writes**: 20,000 per day
- **Storage**: 1 GB

### Firebase Analytics
- **Events**: Unlimited
- **User Properties**: 25 per project
- **Custom Definitions**: 50 event parameters

These limits are more than sufficient for most AB testing needs.

## Troubleshooting

### Tests Not Loading

1. Check Firebase configuration in `.env.local`
2. Verify Firestore rules allow read access
3. Check browser console for errors
4. Try syncing local tests again

### Variant Assignments Not Persisting

- Check browser localStorage is enabled
- Verify the `ab_test_assignments` key exists in localStorage
- Try clearing cache and reassigning

### Analytics Events Not Appearing

- Events may take 24-48 hours to appear in Firebase Analytics
- Use DebugView in Firebase Console for real-time debugging
- Verify `measurementId` is correct in Firebase config

## Future Enhancements

- [ ] Visual test result comparison
- [ ] Statistical significance calculator
- [ ] Automated winner selection
- [ ] Multi-armed bandit algorithm
- [ ] Server-side rendering support
- [ ] Export test results to CSV

## Support

For issues or questions:
1. Check Firebase Console logs
2. Review browser console for errors
3. Consult Firebase documentation
4. File an issue in the project repository

---

Built with ❤️ using Firebase and React
