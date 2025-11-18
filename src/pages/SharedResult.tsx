import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Calculator } from 'lucide-react';
import { getSharedResult, type SharedResult } from '@/lib/sharedResults';
import { tools } from '@/config/tools';

export function SharedResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<SharedResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const sharedResult = getSharedResult(id);
      setResult(sharedResult);
      setLoading(false);

      // Update page title and meta tags
      if (sharedResult) {
        document.title = `${sharedResult.title} - QuickCalc Tools`;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute(
            'content',
            `View this shared ${sharedResult.calculatorType} calculation result`
          );
        }
      }
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">
                  Calculation Not Found
                </CardTitle>
                <CardDescription>
                  This shared calculation could not be found. It may have been deleted or the link is invalid.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/')} className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const calculatorTool = tools.find(tool =>
    tool.path.includes(result.calculatorType.toLowerCase().replace(/\s+/g, '-'))
  );

  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
            {calculatorTool && (
              <Button
                onClick={() => navigate(calculatorTool.path)}
                variant="outline"
                size="sm"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Use {result.calculatorType}
              </Button>
            )}
          </div>

          {/* Main Result Card */}
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{result.title}</CardTitle>
                  <CardDescription>
                    Shared on {new Date(result.timestamp).toLocaleDateString()}
                    {result.shareCount !== undefined && result.shareCount > 0 && (
                      <span className="ml-2">
                        • Shared {result.shareCount} {result.shareCount === 1 ? 'time' : 'times'}
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Values */}
              {Object.keys(result.inputs).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    Input Values
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(result.inputs).map(([key, value]) => (
                      <div
                        key={key}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatKey(key)}
                        </div>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {formatValue(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              {Object.keys(result.results).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(result.results).map(([key, value]) => (
                      <div
                        key={key}
                        className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800"
                      >
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatKey(key)}
                        </div>
                        <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                          {formatValue(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Want to try your own calculation?
                </p>
                {calculatorTool ? (
                  <Link to={calculatorTool.path}>
                    <Button className="w-full md:w-auto">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Try {result.calculatorType}
                    </Button>
                  </Link>
                ) : (
                  <Link to="/">
                    <Button className="w-full md:w-auto">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Browse All Calculators
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                QuickCalc Tools - Free online calculators and converters for everyday use
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
