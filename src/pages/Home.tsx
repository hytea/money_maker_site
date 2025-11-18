import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  DollarSign,
  Baby,
  Heart,
  Percent,
  Calendar,
  Users,
  ArrowLeftRight,
  Zap,
  Shield,
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { AdPlaceholder } from '@/components/AdSense';
import { useEffect } from 'react';

const calculators = [
  {
    name: 'Tip Calculator',
    description: 'Calculate tips and split bills easily',
    icon: DollarSign,
    path: '/tip-calculator',
    color: 'text-emerald-600',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-200',
    popular: true
  },
  {
    name: 'Loan Calculator',
    description: 'Calculate monthly payments and interest',
    icon: Calculator,
    path: '/loan-calculator',
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    popular: true
  },
  {
    name: 'Pregnancy Calculator',
    description: 'Calculate your due date and pregnancy timeline',
    icon: Baby,
    path: '/pregnancy-calculator',
    color: 'text-pink-600',
    bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
    borderColor: 'border-pink-200',
    popular: true
  },
  {
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and calorie needs',
    icon: Heart,
    path: '/bmi-calculator',
    color: 'text-rose-600',
    bgColor: 'bg-gradient-to-br from-rose-50 to-rose-100',
    borderColor: 'border-rose-200',
    popular: false
  },
  {
    name: 'Discount Calculator',
    description: 'Calculate sale prices and savings',
    icon: Percent,
    path: '/discount-calculator',
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
    borderColor: 'border-purple-200',
    popular: false
  },
  {
    name: 'Age Calculator',
    description: 'Calculate exact age and time differences',
    icon: Calendar,
    path: '/age-calculator',
    color: 'text-orange-600',
    bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
    borderColor: 'border-orange-200',
    popular: false
  },
  {
    name: 'Split Bill Calculator',
    description: 'Split bills and expenses with friends',
    icon: Users,
    path: '/split-bill-calculator',
    color: 'text-teal-600',
    bgColor: 'bg-gradient-to-br from-teal-50 to-teal-100',
    borderColor: 'border-teal-200',
    popular: false
  },
  {
    name: 'Unit Converter',
    description: 'Convert cooking, weight, and distance units',
    icon: ArrowLeftRight,
    path: '/unit-converter',
    color: 'text-indigo-600',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-200',
    popular: false
  }
];

export function Home() {
  useEffect(() => {
    document.title = 'QuickCalc Tools - Free Online Calculators & Converters';
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 via-white to-accent-100/50 -z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40 -z-10"></div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-12 sm:py-16 md:py-24">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 border border-primary-200 mb-4 sm:mb-6">
              <Zap className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-primary-600" />
              <span className="text-xs sm:text-sm font-semibold text-primary-800">100% Free Tools</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              <span className="block text-gray-900">Quick & Easy</span>
              <span className="block bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
                Online Calculators
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              Fast, accurate, and always free calculators for everyday use.
              No signup required, no installation needed.
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 text-xs sm:text-sm md:text-base px-4">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Zap className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-green-600" />
                </div>
                <span className="font-medium">Instant Results</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-blue-600" />
                </div>
                <span className="font-medium">100% Free</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Smartphone className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-purple-600" />
                </div>
                <span className="font-medium">Mobile Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Placement - Hidden on mobile */}
      <div className="bg-white/50 py-6 md:py-8 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdPlaceholder label="Featured Ad Space" />
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Choose Your Calculator
          </h2>
          <p className="text-gray-600 text-base sm:text-lg px-4">
            Select from our collection of professional calculators
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link key={calc.path} to={calc.path} className="group">
                <Card className={`h-full card-hover border-2 ${calc.borderColor} relative overflow-hidden`}>
                  {calc.popular && (
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                      <Badge variant="default" className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5">
                        POPULAR
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="relative p-4 sm:p-5 md:p-6">
                    <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-lg sm:rounded-xl ${calc.bgColor} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`h-6 sm:h-7 w-6 sm:w-7 ${calc.color}`} />
                    </div>
                    <CardTitle className="text-base sm:text-lg group-hover:text-primary-700 transition-colors flex items-center justify-between">
                      {calc.name}
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm leading-relaxed">
                      {calc.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Bottom Ad - Hidden on mobile */}
        <div className="mb-8 sm:mb-10 md:mb-12 hidden md:block">
          <AdPlaceholder label="Bottom Ad Space" />
        </div>

        {/* Features Section */}
        <div className="mt-12 sm:mt-16 md:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-10 md:mb-12 text-center px-4">
            Why Choose QuickCalc Tools?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 md:gap-8">
            <div className="text-center px-4">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <Zap className="h-7 sm:h-8 w-7 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Get instant results without complex formulas. Our calculators are optimized for speed.
              </p>
            </div>
            <div className="text-center px-4">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <Shield className="h-7 sm:h-8 w-7 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2">Always Free</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                No hidden fees, no subscriptions. All our tools are completely free to use, forever.
              </p>
            </div>
            <div className="text-center px-4">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <Smartphone className="h-7 sm:h-8 w-7 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2">Mobile Ready</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Works perfectly on any device - phone, tablet, or desktop. Calculate on the go!
              </p>
            </div>
            <div className="text-center px-4">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <Calculator className="h-7 sm:h-8 w-7 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2">Easy to Use</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Simple, intuitive interface. No complicated setup or learning curve required.
              </p>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-12 sm:mt-16 md:mt-20 prose prose-sm sm:prose-base md:prose-lg max-w-none">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Popular Free Online Calculators</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Our <strong>tip calculator</strong> helps you calculate the perfect tip at restaurants and split bills with friends.
              The <strong>loan calculator</strong> shows you monthly payments for mortgages, car loans, and personal loans with detailed breakdowns.
              Expecting? Use our <strong>pregnancy calculator</strong> to find your due date and track your pregnancy week by week.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Need to check your health? Our <strong>BMI calculator</strong> determines if you're at a healthy weight and calculates
              your daily calorie needs. Shopping? The <strong>discount calculator</strong> shows you the final price and how much you save.
              Convert between cooking measurements, weights, and distances with our <strong>unit converter</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
