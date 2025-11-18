import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, LogOut, Shield, User } from 'lucide-react';

export function AdminConsole() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const handleNavigateToAnalytics = () => {
    navigate('/admin/analytics');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-50 border border-purple-200 mb-4">
          <Shield className="h-3.5 w-3.5 text-purple-600" />
          <span className="text-xs font-semibold text-purple-800">ADMIN CONSOLE</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Admin Console
            </h1>
            <p className="text-lg text-gray-600">
              Manage your QuickCalc Tools administration
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 flex items-center justify-center">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-900">
                  {user.displayName || user.email}
                </p>
                {user.email && user.displayName && (
                  <p className="text-sm text-gray-500">{user.email}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary-300"
          onClick={handleNavigateToAnalytics}
        >
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>
              View website analytics, AB test results, and user engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Placeholder for future admin tools */}
        <Card className="opacity-50">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-gray-500" />
            </div>
            <CardTitle className="text-gray-500">Content Management</CardTitle>
            <CardDescription className="text-gray-400">
              Coming soon - Manage site content and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <CardTitle className="text-gray-500">User Management</CardTitle>
            <CardDescription className="text-gray-400">
              Coming soon - Manage admin users and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
