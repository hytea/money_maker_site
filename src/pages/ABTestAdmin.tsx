import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FlaskConical,
  Plus,
  RefreshCw,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { firebaseABTestService } from '@/services/firebaseABTest';
import { useFirebaseABTest } from '@/context/FirebaseABTestingContext';
import type { ABTest } from '@/config/abTests';

export function ABTestAdmin() {
  const {
    tests,
    loading,
    error,
    assignments,
    refreshTests,
    syncLocalTests,
  } = useFirebaseABTest();

  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    document.title = 'AB Test Admin | QuickCalc Tools';
  }, []);

  const handleSyncTests = async () => {
    setSyncing(true);
    setSyncSuccess(false);
    try {
      await syncLocalTests();
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleRefresh = async () => {
    await refreshTests();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-50 border border-purple-200 mb-4">
          <FlaskConical className="h-3.5 w-3.5 text-purple-600" />
          <span className="text-xs font-semibold text-purple-800">AB TESTING</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              AB Test Admin
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage and monitor your AB experiments with Firebase
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleSyncTests} disabled={syncing}>
              <Upload className={`h-4 w-4 mr-2 ${syncing ? 'animate-bounce' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync to Firebase'}
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {syncSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Successfully synced local tests to Firebase!</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Error: {error.message}</span>
          </div>
        )}
      </div>

      {/* Current Assignment */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Your Current Assignments</CardTitle>
          <CardDescription>The variants you're currently seeing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(assignments).map(([testId, variantId]) => {
              const test = tests.find(t => t.id === testId);
              return (
                <Badge key={testId} variant="secondary" className="text-sm">
                  {test?.name || testId}: <strong className="ml-1">{variantId}</strong>
                </Badge>
              );
            })}
            {Object.keys(assignments).length === 0 && (
              <p className="text-sm text-gray-600">No active assignments</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Tests</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {tests.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <FlaskConical className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Tests</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {tests.filter(t => t.enabled).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Inactive Tests</p>
                <p className="text-3xl font-bold text-gray-400 mt-1">
                  {tests.filter(t => !t.enabled).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-between">
                <XCircle className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All AB Tests</CardTitle>
              <CardDescription>
                Manage and configure your experiments
              </CardDescription>
            </div>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              New Test
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && tests.length === 0 ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">Loading tests...</p>
            </div>
          ) : tests.length === 0 ? (
            <div className="text-center py-12">
              <FlaskConical className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 mb-4">No AB tests found</p>
              <Button onClick={handleSyncTests} disabled={syncing}>
                <Upload className="h-4 w-4 mr-2" />
                Sync Local Tests to Firebase
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tests.map(test => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card className="mt-6 bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-lg">Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>
              <strong>First time setup:</strong> Click "Sync to Firebase" to upload your local AB
              test configurations to Firestore
            </li>
            <li>
              <strong>View tests:</strong> All your AB tests will appear in the list below
            </li>
            <li>
              <strong>Firebase Console:</strong> You can also manage tests directly in the{' '}
              <a
                href="https://console.firebase.google.com/project/smart-calc-app-hub/firestore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Firestore Database
              </a>
            </li>
            <li>
              <strong>Analytics:</strong> View experiment results in{' '}
              <a
                href="https://console.firebase.google.com/project/smart-calc-app-hub/analytics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Firebase Analytics
              </a>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Individual Test Card Component
 */
function TestCard({ test }: { test: ABTest }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{test.name}</h3>
            <Badge variant={test.enabled ? 'default' : 'secondary'} className="text-xs">
              {test.enabled ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{test.description}</p>
          <p className="text-xs text-gray-500 mt-1">ID: {test.id}</p>
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Variants:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {test.variants.map(variant => (
            <div
              key={variant.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{variant.name}</p>
                {variant.description && (
                  <p className="text-xs text-gray-600">{variant.description}</p>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {(variant.weight * 100).toFixed(0)}%
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Dates */}
      {(test.startDate || test.endDate) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex gap-4 text-xs text-gray-600">
            {test.startDate && (
              <span>
                <strong>Start:</strong> {new Date(test.startDate).toLocaleDateString()}
              </span>
            )}
            {test.endDate && (
              <span>
                <strong>End:</strong> {new Date(test.endDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
