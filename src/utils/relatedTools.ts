/**
 * Smart related tools recommendation system
 * Suggests calculators based on user behavior and logical connections
 */

export interface RelatedTool {
  path: string;
  reason: string; // Why this tool is related
}

/**
 * Get related tools for a given calculator
 * Based on logical user journeys and common use cases
 */
export function getRelatedTools(currentPath: string): RelatedTool[] {
  const relations: Record<string, RelatedTool[]> = {
    '/tip-calculator': [
      { path: '/split-bill-calculator', reason: 'Split the total with your group' },
      { path: '/discount-calculator', reason: 'Calculate happy hour discounts' },
      { path: '/unit-converter', reason: 'Convert recipe measurements for cooking' }
    ],
    '/loan-calculator': [
      { path: '/discount-calculator', reason: 'Calculate down payment savings' },
      { path: '/age-calculator', reason: 'Plan for retirement timing' },
      { path: '/bmi-calculator', reason: 'Health planning for your future' }
    ],
    '/pregnancy-calculator': [
      { path: '/bmi-calculator', reason: 'Track healthy weight during pregnancy' },
      { path: '/age-calculator', reason: 'Calculate baby milestones and age' },
      { path: '/unit-converter', reason: 'Convert baby weight and measurements' }
    ],
    '/bmi-calculator': [
      { path: '/age-calculator', reason: 'BMI recommendations vary by age' },
      { path: '/unit-converter', reason: 'Convert weight and height units' },
      { path: '/pregnancy-calculator', reason: 'Track pregnancy weight goals' }
    ],
    '/discount-calculator': [
      { path: '/tip-calculator', reason: 'Calculate tip on discounted price' },
      { path: '/split-bill-calculator', reason: 'Split your savings with others' },
      { path: '/loan-calculator', reason: 'See if savings help with purchases' }
    ],
    '/age-calculator': [
      { path: '/bmi-calculator', reason: 'Health metrics change with age' },
      { path: '/pregnancy-calculator', reason: 'Track pregnancy and baby age' },
      { path: '/loan-calculator', reason: 'Plan loans based on retirement age' }
    ],
    '/split-bill-calculator': [
      { path: '/tip-calculator', reason: 'Add tip before splitting' },
      { path: '/discount-calculator', reason: 'Apply group discounts first' },
      { path: '/unit-converter', reason: 'Split recipe ingredients' }
    ],
    '/unit-converter': [
      { path: '/bmi-calculator', reason: 'Convert height and weight units' },
      { path: '/pregnancy-calculator', reason: 'Convert baby measurements' },
      { path: '/tip-calculator', reason: 'Calculate tips while cooking out' }
    ]
  };

  return relations[currentPath] || [];
}

/**
 * Get the next logical tool based on calculation context
 * This provides smarter recommendations based on what the user just calculated
 */
export interface SmartRecommendation extends RelatedTool {
  priority: 'high' | 'medium' | 'low';
}

export function getSmartRecommendations(
  currentPath: string,
  calculationData?: Record<string, any>
): SmartRecommendation[] {
  const related = getRelatedTools(currentPath);

  // Convert to smart recommendations with priority
  const recommendations: SmartRecommendation[] = related.map((tool, index) => ({
    ...tool,
    priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low'
  }));

  // Add context-aware recommendations based on calculation data
  if (calculationData) {
    addContextAwareRecommendations(currentPath, calculationData, recommendations);
  }

  return recommendations;
}

function addContextAwareRecommendations(
  currentPath: string,
  data: Record<string, any>,
  recommendations: SmartRecommendation[]
): void {
  // Loan calculator: If large loan amount, suggest BMI for health planning
  if (currentPath === '/loan-calculator' && data.amount > 100000) {
    const hasHealthRec = recommendations.some(r => r.path === '/bmi-calculator');
    if (!hasHealthRec) {
      recommendations.push({
        path: '/bmi-calculator',
        reason: 'Big purchase ahead - stay healthy during the journey',
        priority: 'medium'
      });
    }
  }

  // BMI calculator: If overweight, suggest age calculator for health timeline
  if (currentPath === '/bmi-calculator' && data.bmi > 25) {
    const hasAgeRec = recommendations.some(r => r.path === '/age-calculator');
    if (!hasAgeRec) {
      recommendations.push({
        path: '/age-calculator',
        reason: 'Set age-based health goals',
        priority: 'medium'
      });
    }
  }

  // Discount calculator: If big savings, suggest loan calculator
  if (currentPath === '/discount-calculator' && data.savings > 100) {
    const hasLoanRec = recommendations.some(r => r.path === '/loan-calculator');
    if (!hasLoanRec) {
      recommendations.push({
        path: '/loan-calculator',
        reason: 'Put your savings toward a goal',
        priority: 'medium'
      });
    }
  }
}

/**
 * Track tool usage for personalized recommendations
 */
export class ToolUsageTracker {
  private static STORAGE_KEY = 'quickcalc_tool_usage';
  private static MAX_HISTORY = 50;

  static trackUsage(toolPath: string): void {
    const history = this.getHistory();
    history.unshift({
      path: toolPath,
      timestamp: Date.now()
    });

    // Keep only recent history
    const trimmed = history.slice(0, this.MAX_HISTORY);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
  }

  static getHistory(): Array<{ path: string; timestamp: number }> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static getRecentlyUsed(limit: number = 3): string[] {
    const history = this.getHistory();
    const seen = new Set<string>();
    const recent: string[] = [];

    for (const item of history) {
      if (!seen.has(item.path)) {
        seen.add(item.path);
        recent.push(item.path);
        if (recent.length >= limit) break;
      }
    }

    return recent;
  }

  static getFrequentlyUsed(limit: number = 4): Array<{ path: string; count: number }> {
    const history = this.getHistory();
    const counts: Record<string, number> = {};

    for (const item of history) {
      counts[item.path] = (counts[item.path] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}
