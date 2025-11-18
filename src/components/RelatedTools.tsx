import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { getRelatedTools } from '@/utils/relatedTools';
import { tools } from '@/config/tools';

interface RelatedToolsProps {
  currentPath: string;
  limit?: number;
}

export function RelatedTools({ currentPath, limit = 3 }: RelatedToolsProps) {
  const related = getRelatedTools(currentPath).slice(0, limit);

  if (related.length === 0) {
    return null;
  }

  // Helper function to get border color from text color
  const getBorderColor = (textColor: string) => {
    return textColor.replace('text-', 'border-').replace('-600', '-200');
  };

  return (
    <div className="mt-12 sm:mt-16">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="h-5 w-5 text-amber-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          You might also need
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {related.map((relatedTool) => {
          const tool = tools.find(t => t.path === relatedTool.path);
          if (!tool) return null;

          const Icon = tool.icon;
          const borderColor = getBorderColor(tool.color);

          return (
            <Link key={tool.path} to={tool.path} className="group">
              <Card className={`h-full card-hover border-2 ${borderColor} relative overflow-hidden`}>
                <CardHeader className="relative p-5">
                  <div className={`w-12 h-12 rounded-xl ${tool.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-6 w-6 ${tool.color}`} />
                  </div>
                  <CardTitle className="text-base group-hover:text-primary-700 transition-colors flex items-center justify-between">
                    {tool.name}
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {relatedTool.reason}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
