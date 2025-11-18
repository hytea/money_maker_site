/**
 * AB Test Configuration
 * Define all active AB tests here
 */

export interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // 0-1, must sum to 1 for all variants in a test
  description?: string;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: ABTestVariant[];
  enabled: boolean;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Active AB Tests
 * Add new tests here to make them available in the application
 */
export const abTests: ABTest[] = [
  {
    id: 'homepage-cta',
    name: 'Homepage CTA Button Text',
    description: 'Test different call-to-action button texts on the homepage',
    enabled: true,
    variants: [
      {
        id: 'control',
        name: 'Control',
        weight: 0.5,
        description: 'Original button text',
      },
      {
        id: 'variant-a',
        name: 'Variant A - Action Focused',
        weight: 0.5,
        description: 'More action-oriented button text',
      },
    ],
  },
  {
    id: 'calculator-layout',
    name: 'Calculator Layout',
    description: 'Test different calculator page layouts',
    enabled: true,
    variants: [
      {
        id: 'control',
        name: 'Control - Current Layout',
        weight: 0.5,
        description: 'Current sidebar layout',
      },
      {
        id: 'variant-a',
        name: 'Variant A - Stacked Layout',
        weight: 0.5,
        description: 'Stacked input/results layout',
      },
    ],
  },
  {
    id: 'color-scheme',
    name: 'Primary Color Scheme',
    description: 'Test different color schemes for the entire site',
    enabled: false, // Disabled by default - enable when ready to test
    variants: [
      {
        id: 'control',
        name: 'Control - Blue/Purple',
        weight: 0.33,
        description: 'Current blue and purple theme',
      },
      {
        id: 'variant-a',
        name: 'Variant A - Green/Teal',
        weight: 0.33,
        description: 'Green and teal theme',
      },
      {
        id: 'variant-b',
        name: 'Variant B - Orange/Red',
        weight: 0.34,
        description: 'Warm orange and red theme',
      },
    ],
  },
  {
    id: 'ad-placement',
    name: 'Ad Placement',
    description: 'Test different ad placements on calculator pages',
    enabled: true,
    variants: [
      {
        id: 'control',
        name: 'Control - Current Placement',
        weight: 0.5,
        description: 'Current ad positions',
      },
      {
        id: 'variant-a',
        name: 'Variant A - Reduced Ads',
        weight: 0.5,
        description: 'Fewer, more strategic ad placements',
      },
    ],
  },
  {
    id: 'result-presentation',
    name: 'Result Presentation Style',
    description: 'Test different ways to present calculator results',
    enabled: true,
    variants: [
      {
        id: 'control',
        name: 'Control - Current Style',
        weight: 0.5,
        description: 'Current result display',
      },
      {
        id: 'variant-a',
        name: 'Variant A - Highlighted Results',
        weight: 0.5,
        description: 'More prominent result highlighting',
      },
    ],
  },
];

/**
 * Get all enabled AB tests
 */
export function getEnabledTests(): ABTest[] {
  return abTests.filter(test => test.enabled);
}

/**
 * Get a specific AB test by ID
 */
export function getTestById(id: string): ABTest | undefined {
  return abTests.find(test => test.id === id);
}

/**
 * Validate that variant weights sum to 1
 */
export function validateTestWeights(test: ABTest): boolean {
  const sum = test.variants.reduce((acc, variant) => acc + variant.weight, 0);
  return Math.abs(sum - 1.0) < 0.001; // Allow for floating point errors
}

/**
 * Check if a test is currently active (within date range if specified)
 */
export function isTestActive(test: ABTest): boolean {
  if (!test.enabled) return false;

  const now = new Date();

  if (test.startDate && now < test.startDate) return false;
  if (test.endDate && now > test.endDate) return false;

  return true;
}
