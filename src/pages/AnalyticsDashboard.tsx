import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  ExternalLink,
  TrendingUp,
  Users,
  Activity,
} from 'lucide-react';

const FIREBASE_PROJECT_ID = 'smart-calc-app-hub';
const FIREBASE_ANALYTICS_URL = `https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/analytics`;
const GA4_URL = 'https://analytics.google.com';

export function AnalyticsDashboard() {
  useEffect(() => {
    document.title = 'Analytics Dashboard | QuickCalc Tools';
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-50 border border-blue-200 mb-4">
          <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-xs font-semibold text-blue-800">ANALYTICS</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          View your website performance and user engagement metrics
        </p>
      </div>

      {/* Analytics Links */}
      <div className="space-y-4">
        {/* Firebase Analytics */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Firebase Analytics</CardTitle>
                  <CardDescription>Real-time analytics and event tracking</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              View detailed analytics including page views, events, user engagement, conversions, and real-time activity for your calculator website.
            </p>
            <Button
              onClick={() => window.open(FIREBASE_ANALYTICS_URL, '_blank')}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg"
            >
              Open Firebase Analytics
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Google Analytics 4 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Google Analytics 4</CardTitle>
                  <CardDescription>Advanced reporting and insights</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Access comprehensive reports, custom dashboards, audience insights, and advanced analytics features in Google Analytics 4.
            </p>
            <Button
              onClick={() => window.open(GA4_URL, '_blank')}
              className="w-full sm:w-auto bg-white hover:bg-purple-50 text-purple-700 border-2 border-purple-300 hover:border-purple-400 font-semibold shadow-sm hover:shadow-md"
            >
              Open Google Analytics
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              Select the property associated with measurement ID: G-ZF7JCP2127
            </p>
          </CardContent>
        </Card>

        {/* What's Being Tracked */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>What's Being Tracked</CardTitle>
                <CardDescription>Events automatically sent to analytics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Page Views:</strong> Every page visit and navigation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Calculator Usage:</strong> When users perform calculations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Button Clicks:</strong> User interactions and engagement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>User Navigation:</strong> How users move through the site</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>AB Test Variants:</strong> Experiment performance data</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Note */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Analytics data may take 24-48 hours to appear after initial setup. Real-time events typically show up within a few minutes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
