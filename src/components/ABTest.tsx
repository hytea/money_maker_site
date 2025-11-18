import type { ReactNode } from 'react';
import { useVariant } from '@/context/ABTestingContext';

interface ABTestProps {
  testId: string;
  variants: {
    [variantId: string]: ReactNode;
  };
  defaultVariant?: string;
}

/**
 * ABTest Component
 * Renders different content based on the user's assigned variant
 *
 * @example
 * <ABTest
 *   testId="homepage-cta"
 *   variants={{
 *     control: <Button>Calculate Now</Button>,
 *     'variant-a': <Button>Start Calculating</Button>,
 *   }}
 * />
 */
export function ABTest({ testId, variants, defaultVariant = 'control' }: ABTestProps) {
  const variant = useVariant(testId);

  // Use assigned variant or fall back to default
  const activeVariant = variant || defaultVariant;

  // Render the content for the active variant
  const content = variants[activeVariant];

  if (!content) {
    console.warn(
      `ABTest: No content defined for variant "${activeVariant}" in test "${testId}"`
    );
    return null;
  }

  return <>{content}</>;
}

/**
 * Conditional AB Test Component
 * Only renders its children if the user is in the specified variant
 *
 * @example
 * <ABTestVariant testId="homepage-cta" variantId="variant-a">
 *   <NewFeature />
 * </ABTestVariant>
 */
export function ABTestVariant({
  testId,
  variantId,
  children,
}: {
  testId: string;
  variantId: string;
  children: ReactNode;
}) {
  const variant = useVariant(testId);

  if (variant !== variantId) {
    return null;
  }

  return <>{children}</>;
}
