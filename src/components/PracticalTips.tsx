import { getPracticalTips } from '@/utils/practicalTips';
import { DollarSign, Lightbulb, Info, AlertCircle } from 'lucide-react';
import type { PracticalTip } from '@/utils/practicalTips';

interface PracticalTipsProps {
  toolPath: string;
  limit?: number;
}

function getCategoryIcon(category: PracticalTip['category']) {
  switch (category) {
    case 'money-saver':
      return <DollarSign className="h-4 w-4" />;
    case 'pro-tip':
      return <Lightbulb className="h-4 w-4" />;
    case 'did-you-know':
      return <Info className="h-4 w-4" />;
    case 'common-mistake':
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Lightbulb className="h-4 w-4" />;
  }
}

function getCategoryColor(category: PracticalTip['category']) {
  switch (category) {
    case 'money-saver':
      return 'border-green-200 bg-green-50';
    case 'pro-tip':
      return 'border-blue-200 bg-blue-50';
    case 'did-you-know':
      return 'border-purple-200 bg-purple-50';
    case 'common-mistake':
      return 'border-amber-200 bg-amber-50';
    default:
      return 'border-gray-200 bg-gray-50';
  }
}

function getCategoryTextColor(category: PracticalTip['category']) {
  switch (category) {
    case 'money-saver':
      return 'text-green-700';
    case 'pro-tip':
      return 'text-blue-700';
    case 'did-you-know':
      return 'text-purple-700';
    case 'common-mistake':
      return 'text-amber-700';
    default:
      return 'text-gray-700';
  }
}

export function PracticalTips({ toolPath, limit }: PracticalTipsProps) {
  const allTips = getPracticalTips(toolPath);
  const tips = limit ? allTips.slice(0, limit) : allTips;

  if (tips.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 sm:mt-12">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
        Helpful Tips
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip) => (
          <div
            key={`${tip.category}-${tip.title}`}
            className={`p-4 rounded-lg border-2 ${getCategoryColor(tip.category)}`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${getCategoryTextColor(tip.category)}`}>
                {getCategoryIcon(tip.category)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {tip.title}
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {tip.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
