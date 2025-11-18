import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { analytics } from '@/lib/analytics';
import { useABTest } from '@/context/ABTestingContext';
import { abTests } from '@/config/abTests';
import {
  BarChart3,
  Eye,
  MousePointerClick,
  TrendingUp,
  Users,
  RefreshCw,
  Download,
  Trash2,
  Activity,
} from 'lucide-react';

export function AnalyticsDashboard() {
  const [summary, setSummary] = useState<ReturnType<typeof analytics.getAnalyticsSummary> | null>(
    null
  );
  const { assignments, resetAssignments } = useABTest();

  useEffect(() => {
    document.title = 'Analytics Dashboard | QuickCalc Tools';
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const data = analytics.getAnalyticsSummary();
    setSummary(data);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      analytics.clearStoredEvents();
      loadAnalytics();
    }
  };

  const handleResetABTests = () => {
    if (confirm('Reset all AB test variant assignments?')) {
      resetAssignments();
    }
  };

  const handleExportData = () => {
    if (!summary) return;

    const dataStr = JSON.stringify(summary, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!summary) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p>Loading analytics...</p>
      </div>
    );
  }

  // Calculate AB test statistics
  const abTestStats = abTests.map(test => {
    const viewEvents = summary.events.filter(
      e =>
        e.type === 'event' &&
        'data' in e &&
        typeof e.data === 'object' &&
        e.data !== null &&
        'category' in e.data &&
        e.data.category === 'ab_test' &&
        'metadata' in e.data &&
        e.data.metadata !== null &&
        typeof e.data.metadata === 'object' &&
        'testId' in e.data.metadata &&
        e.data.metadata.testId === test.id
    );

    const conversionEvents = viewEvents.filter(
      e =>
        'data' in e &&
        typeof e.data === 'object' &&
        e.data !== null &&
        'action' in e.data &&
        e.data.action === 'conversion'
    );

    const variantStats = test.variants.map(variant => {
      const variantViews = viewEvents.filter(
        e =>
          'data' in e &&
          typeof e.data === 'object' &&
          e.data !== null &&
          'metadata' in e.data &&
          e.data.metadata !== null &&
          typeof e.data.metadata === 'object' &&
          'variant' in e.data.metadata &&
          e.data.metadata.variant === variant.id
      );

      const variantConversions = conversionEvents.filter(
        e =>
          'data' in e &&
          typeof e.data === 'object' &&
          e.data !== null &&
          'metadata' in e.data &&
          e.data.metadata !== null &&
          typeof e.data.metadata === 'object' &&
          'variant' in e.data.metadata &&
          e.data.metadata.variant === variant.id
      );

      const conversionRate =
        variantViews.length > 0 ? (variantConversions.length / variantViews.length) * 100 : 0;

      return {
        variant,
        views: variantViews.length,
        conversions: variantConversions.length,
        conversionRate,
      };
    });

    return {
      test,
      stats: variantStats,
      totalViews: viewEvents.length,
      totalConversions: conversionEvents.length,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-50 border border-blue-200 mb-4">
          <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-xs font-semibold text-blue-800">ANALYTICS</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Track your website performance and AB test results
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadAnalytics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Page Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {summary.totalPageViews.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {summary.totalEvents.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <MousePointerClick className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Conversions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {summary.totalConversions.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {summary.events.length.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Views by Path */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Page Views by Path</CardTitle>
          <CardDescription>Most visited pages on your website</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(summary.pageViewsByPath).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(summary.pageViewsByPath)
                .sort(([, a], [, b]) => b - a)
                .map(([path, count]) => (
                  <div key={path} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{path}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{
                            width: `${(count / summary.totalPageViews) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {count} views
                    </Badge>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No page views recorded yet</p>
          )}
        </CardContent>
      </Card>

      {/* Conversions by Tool */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Calculator Usage</CardTitle>
          <CardDescription>Number of calculations performed per tool</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(summary.conversionsByTool).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(summary.conversionsByTool)
                .sort(([, a], [, b]) => b - a)
                .map(([tool, count]) => (
                  <div key={tool} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">
                        {tool.replace(/-/g, ' ')}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          style={{
                            width: `${(count / summary.totalConversions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {count} calculations
                    </Badge>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No calculator usage recorded yet</p>
          )}
        </CardContent>
      </Card>

      {/* AB Test Results */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AB Test Results</CardTitle>
              <CardDescription>Performance metrics for active experiments</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleResetABTests}>
              Reset Assignments
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Current Assignments */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Your Current Assignments</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(assignments).map(([testId, variantId]) => {
                const test = abTests.find(t => t.id === testId);
                return (
                  <Badge key={testId} variant="secondary">
                    {test?.name}: {variantId}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Test Statistics */}
          {abTestStats.map(({ test, stats, totalViews, totalConversions }) => (
            <div key={test.id} className="mb-8 last:mb-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{test.name}</h3>
                  <p className="text-sm text-gray-600">{test.description}</p>
                </div>
                <Badge variant={test.enabled ? 'default' : 'secondary'}>
                  {test.enabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {stats.map(({ variant, views, conversions, conversionRate }) => (
                  <Card key={variant.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">{variant.name}</h4>
                        {assignments[test.id] === variant.id && (
                          <Badge variant="secondary" className="bg-blue-50">
                            <Users className="h-3 w-3 mr-1" />
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Views:</span>
                          <span className="font-semibold">{views}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Conversions:</span>
                          <span className="font-semibold">{conversions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Conversion Rate:</span>
                          <span className="font-semibold">{conversionRate.toFixed(2)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalViews === 0 && (
                <p className="text-sm text-gray-500 mt-4">
                  No data collected for this test yet. Start using the site to see results.
                </p>
              )}

              {stats.length > 0 && totalViews > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Total:</strong> {totalViews} views, {totalConversions} conversions
                  </p>
                </div>
              )}

              <Separator className="mt-6" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your analytics data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            <Button variant="outline" onClick={handleClearData} className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Note: Analytics data is stored locally in your browser. Clearing browser data will
            remove all analytics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
