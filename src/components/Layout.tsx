import { Link, Outlet } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import { AdPlaceholder } from './AdSense';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <Calculator className="h-8 w-8" />
              <span className="text-xl font-bold">QuickCalc Tools</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                All Tools
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Top Banner Ad */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AdPlaceholder label="Header Banner Ad" className="max-w-4xl mx-auto" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">QuickCalc Tools</h3>
              <p className="text-gray-600 text-sm">
                Free online calculators and tools for everyday use. Fast, simple, and always available.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Popular Tools</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/tip-calculator" className="text-gray-600 hover:text-blue-600">Tip Calculator</Link></li>
                <li><Link to="/loan-calculator" className="text-gray-600 hover:text-blue-600">Loan Calculator</Link></li>
                <li><Link to="/bmi-calculator" className="text-gray-600 hover:text-blue-600">BMI Calculator</Link></li>
                <li><Link to="/pregnancy-calculator" className="text-gray-600 hover:text-blue-600">Pregnancy Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">More Tools</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/discount-calculator" className="text-gray-600 hover:text-blue-600">Discount Calculator</Link></li>
                <li><Link to="/age-calculator" className="text-gray-600 hover:text-blue-600">Age Calculator</Link></li>
                <li><Link to="/split-bill-calculator" className="text-gray-600 hover:text-blue-600">Split Bill Calculator</Link></li>
                <li><Link to="/unit-converter" className="text-gray-600 hover:text-blue-600">Unit Converter</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600 text-sm">
            <p>&copy; 2025 QuickCalc Tools. All rights reserved. Free calculators for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
