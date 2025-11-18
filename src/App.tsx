import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SEO } from './components/SEO';
import { tools, homePage } from './config/tools';
import { ABTestingProvider } from './context/ABTestingContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { analytics } from './lib/analytics';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { SharedResultPage } from './pages/SharedResult';
import { LoginPage } from './pages/Login';
import { AdminConsole } from './pages/AdminConsole';

function App() {
  // Initialize analytics on app load
  useEffect(() => {
    analytics.initialize();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ABTestingProvider>
          <SEO />
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Home page */}
              <Route index element={<homePage.component />} />

              {/* Dynamically generate routes from tools config */}
              {tools.map((tool) => (
                <Route
                  key={tool.path}
                  path={tool.path}
                  element={<tool.component />}
                />
              ))}

              {/* About page */}
              <Route path="/about" element={<AboutPage />} />

              {/* Shared Result Page */}
              <Route path="/shared/:id" element={<SharedResultPage />} />
            </Route>

            {/* Login Page - Outside of Layout */}
            <Route path="/login" element={<Layout />}>
              <Route index element={<LoginPage />} />
            </Route>

            {/* Admin Routes - Protected */}
            <Route path="/admin" element={<Layout />}>
              <Route
                index
                element={
                  <ProtectedRoute>
                    <AdminConsole />
                  </ProtectedRoute>
                }
              />
              <Route
                path="analytics"
                element={
                  <ProtectedRoute>
                    <AnalyticsDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </ABTestingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Simple About page
function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About QuickCalc Tools</h1>
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-4">
          QuickCalc Tools provides free, easy-to-use online calculators for everyday calculations.
          No signup required, no hidden fees - just simple, reliable tools that work.
        </p>
        <p className="text-gray-600 mb-4">
          Whether you need to calculate a restaurant tip, figure out loan payments, track your
          pregnancy, or convert units for a recipe, we've got you covered. Our calculators are
          designed to be fast, accurate, and accessible on any device.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-4">
          We believe that useful tools should be free and accessible to everyone. That's why all
          our calculators are completely free to use, with no registration or downloads required.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Privacy</h2>
        <p className="text-gray-600">
          All calculations are performed in your browser. We don't store or transmit any of your
          personal data. Your privacy is important to us.
        </p>
      </div>
    </div>
  );
}

export default App;
