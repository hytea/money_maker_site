import { Link, Outlet } from 'react-router-dom';
import { Calculator, Sparkles, Menu, X } from 'lucide-react';
import { AdPlaceholder } from './AdSense';
import { Separator } from './ui/separator';
import { useState } from 'react';

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group" onClick={() => setMobileMenuOpen(false)}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-lg">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent">
                  QuickCalc
                </span>
                <span className="text-[10px] text-gray-500 -mt-1 tracking-wide">FREE TOOLS</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-700 hover:bg-primary-50 font-medium transition-all"
              >
                All Tools
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-700 hover:bg-primary-50 font-medium transition-all"
              >
                About
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-primary-50 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className="px-4 py-3 rounded-lg text-gray-700 hover:text-primary-700 hover:bg-primary-50 font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Tools
                </Link>
                <Link
                  to="/about"
                  className="px-4 py-3 rounded-lg text-gray-700 hover:text-primary-700 hover:bg-primary-50 font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Top Banner Ad - Hidden on mobile, visible on desktop */}
      <div className="bg-gradient-to-r from-primary-50/50 to-accent-50/50 border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AdPlaceholder label="Header Banner Ad" className="max-w-4xl mx-auto" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg">QuickCalc</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Free online calculators and tools for everyday use. Fast, simple, and always available.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Sparkles className="h-3 w-3" />
                <span>Trusted by millions</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-base mb-4 text-white">Popular Tools</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/tip-calculator" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-primary-500 mr-2 group-hover:w-2 transition-all"></span>
                    Tip Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/loan-calculator" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-primary-500 mr-2 group-hover:w-2 transition-all"></span>
                    Loan Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/bmi-calculator" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-primary-500 mr-2 group-hover:w-2 transition-all"></span>
                    BMI Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/pregnancy-calculator" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-primary-500 mr-2 group-hover:w-2 transition-all"></span>
                    Pregnancy Calculator
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-base mb-4 text-white">More Tools</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/discount-calculator" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-accent-500 mr-2 group-hover:w-2 transition-all"></span>
                    Discount Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/age-calculator" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-accent-500 mr-2 group-hover:w-2 transition-all"></span>
                    Age Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/split-bill-calculator" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-accent-500 mr-2 group-hover:w-2 transition-all"></span>
                    Split Bill Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/unit-converter" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-accent-500 mr-2 group-hover:w-2 transition-all"></span>
                    Unit Converter
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-base mb-4 text-white">About</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <span className="text-gray-400">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-gray-400">Terms of Service</span>
                </li>
                <li>
                  <span className="text-gray-400">Contact</span>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="bg-gray-800 mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2025 QuickCalc Tools. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Made with care for everyday calculations</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
