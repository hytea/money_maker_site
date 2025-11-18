/**
 * Practical, actionable tips for each calculator
 * No fluff, no obvious advice - only useful insights
 */

export interface PracticalTip {
  title: string;
  content: string;
  category?: 'money-saver' | 'pro-tip' | 'did-you-know' | 'common-mistake';
}

export function getPracticalTips(toolPath: string): PracticalTip[] {
  const tips: Record<string, PracticalTip[]> = {
    '/tip-calculator': [
      {
        title: 'Tip on pre-tax amount',
        content: 'Calculate your tip based on the pre-tax total to avoid overpaying. The difference adds up over time.',
        category: 'money-saver'
      },
      {
        title: 'Round up for better service',
        content: 'At places you visit often, round up to the nearest dollar. Servers remember generous regulars.',
        category: 'pro-tip'
      },
      {
        title: 'Tip in cash when possible',
        content: 'Cash tips often go directly to your server, while credit card tips may be pooled or delayed.',
        category: 'did-you-know'
      }
    ],
    '/loan-calculator': [
      {
        title: 'Extra payments make a huge difference',
        content: 'Adding just $100/month to a $200k mortgage at 4% saves you ~$30k and cuts 5 years off your loan.',
        category: 'money-saver'
      },
      {
        title: 'Compare bi-weekly vs monthly',
        content: 'Bi-weekly payments (every 2 weeks) result in 26 half-payments per year = 13 full payments instead of 12.',
        category: 'pro-tip'
      },
      {
        title: 'The 28/36 rule',
        content: 'Lenders prefer your housing costs under 28% of gross income, and total debt under 36%. Stay in this range.',
        category: 'did-you-know'
      },
      {
        title: 'Watch out for PMI',
        content: 'If your down payment is less than 20%, you\'ll likely pay PMI ($30-$70 per $100k borrowed monthly).',
        category: 'common-mistake'
      }
    ],
    '/pregnancy-calculator': [
      {
        title: 'Due dates are estimates',
        content: 'Only 5% of babies arrive on their due date. The normal range is 37-42 weeks. Plan accordingly.',
        category: 'did-you-know'
      },
      {
        title: 'First pregnancy usually goes longer',
        content: 'First-time mothers average 41 weeks and 1 day. Second+ pregnancies average 40 weeks 3 days.',
        category: 'pro-tip'
      },
      {
        title: 'Track weeks, not months',
        content: 'Healthcare providers track pregnancy by weeks because development happens rapidly. Learn to think in weeks.',
        category: 'pro-tip'
      },
      {
        title: 'The 2-week head start',
        content: 'Pregnancy weeks are counted from your last period, not conception. You\'re "2 weeks pregnant" at conception.',
        category: 'did-you-know'
      }
    ],
    '/bmi-calculator': [
      {
        title: 'BMI doesn\'t measure body fat',
        content: 'BMI is a rough screening tool. Athletes with high muscle mass often show as "overweight" despite being healthy.',
        category: 'common-mistake'
      },
      {
        title: 'Waist circumference matters more',
        content: 'For health risk, measure your waist. Men over 40" and women over 35" face increased risk regardless of BMI.',
        category: 'pro-tip'
      },
      {
        title: 'Different standards for different ages',
        content: 'BMI interpretation varies by age and ethnicity. Asian populations use lower cutoffs (23 = overweight vs 25).',
        category: 'did-you-know'
      },
      {
        title: 'The 10% rule for weight loss',
        content: 'Losing just 10% of body weight significantly improves health markers: blood pressure, cholesterol, diabetes risk.',
        category: 'money-saver'
      }
    ],
    '/discount-calculator': [
      {
        title: 'Stack coupons when possible',
        content: 'Many stores allow stacking: manufacturer coupon + store coupon + store sale. Read the fine print.',
        category: 'money-saver'
      },
      {
        title: 'Calculate unit price after discount',
        content: 'A 50% off sale on a large size might still be more expensive per ounce than the regular small size.',
        category: 'pro-tip'
      },
      {
        title: 'Beware "price anchoring"',
        content: 'Stores inflate "original" prices to make discounts look better. Research actual market value first.',
        category: 'common-mistake'
      },
      {
        title: 'End-of-season is 70%+ off',
        content: 'Wait for clearance cycles: winter clothes in Feb, summer in Aug. You\'ll find 70-90% discounts.',
        category: 'money-saver'
      }
    ],
    '/age-calculator': [
      {
        title: 'Insurance age vs actual age',
        content: 'Car insurance often uses "age 25" as a rate change. Calculate exactly when you hit rate-drop milestones.',
        category: 'money-saver'
      },
      {
        title: 'Retirement account deadlines',
        content: 'IRA contributions for 2024 can be made until April 15, 2025. You could be in a different age bracket by then.',
        category: 'pro-tip'
      },
      {
        title: 'Age in days for habits',
        content: 'Breaking a habit takes 66 days on average. Calculate your target date and mark it on your calendar.',
        category: 'did-you-know'
      }
    ],
    '/split-bill-calculator': [
      {
        title: 'Split by consumption, not equally',
        content: 'If someone ordered an appetizer and cocktails while others had water, consider itemized splitting.',
        category: 'pro-tip'
      },
      {
        title: 'Include tip before splitting',
        content: 'Calculate the total tip first, then divide everything. Otherwise, the person paying the card gets stuck with tip.',
        category: 'common-mistake'
      },
      {
        title: 'Round up to avoid small bills',
        content: 'If the split is $23.67, ask for $24 or $25. The extra dollar is worth avoiding Venmo requests for $1.33.',
        category: 'pro-tip'
      },
      {
        title: 'Use payment apps strategically',
        content: 'Venmo/Zelle have instant transfer. PayPal/CashApp may take 1-3 days unless you pay a fee.',
        category: 'did-you-know'
      }
    ],
    '/unit-converter': [
      {
        title: 'Kitchen measurements vary',
        content: 'A "cup" of flour should be spooned and leveled, not scooped. Scooping can add 25% more flour.',
        category: 'pro-tip'
      },
      {
        title: 'Metric baking is more accurate',
        content: 'Professional bakers use grams, not cups. 1 cup of flour can be 120-140g depending on how you measure.',
        category: 'did-you-know'
      },
      {
        title: 'Temperature conversion shortcuts',
        content: 'Quick estimate: °F to °C: subtract 30, divide by 2. (100°F - 30) ÷ 2 = 35°C (actual: 37.8°C).',
        category: 'pro-tip'
      },
      {
        title: 'Butter by tablespoon',
        content: 'In the US, 1 stick of butter = 8 tablespoons = ½ cup = 113g. Wrapper has tablespoon markings.',
        category: 'did-you-know'
      }
    ]
  };

  return tips[toolPath] || [];
}

/**
 * Get a single random tip for variety
 */
export function getRandomTip(toolPath: string): PracticalTip | null {
  const tips = getPracticalTips(toolPath);
  if (tips.length === 0) return null;
  return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Get tips by category
 */
export function getTipsByCategory(toolPath: string, category: PracticalTip['category']): PracticalTip[] {
  return getPracticalTips(toolPath).filter(tip => tip.category === category);
}
