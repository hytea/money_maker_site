import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface Insight {
  type: 'tip' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
}

interface ResultInsightsProps {
  insights: Insight[];
  title?: string;
}

const iconMap = {
  tip: Lightbulb,
  warning: AlertCircle,
  success: CheckCircle,
  info: TrendingUp,
};

const colorMap = {
  tip: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    text: 'text-blue-900',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    text: 'text-amber-900',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    text: 'text-green-900',
  },
  info: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    text: 'text-purple-900',
  },
};

export function ResultInsights({ insights, title = 'Personalized Insights' }: ResultInsightsProps) {
  if (insights.length === 0) return null;

  return (
    <Card className="border-2">
      <CardHeader className="bg-gradient-to-br from-blue-50/50 to-white">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-6">
        {insights.map((insight, index) => {
          const Icon = iconMap[insight.type];
          const colors = colorMap[insight.type];

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
            >
              <div className="flex gap-3">
                <Icon className={`h-5 w-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                <div>
                  <h4 className={`font-semibold ${colors.text} mb-1`}>
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
