import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Calculator,
  DollarSign,
  Baby,
  Heart,
  Percent,
  Calendar,
  Users,
  ArrowLeftRight
} from 'lucide-react';
import { AdPlaceholder } from '@/components/AdSense';
import { useEffect } from 'react';

const calculators = [
  {
    name: 'Tip Calculator',
    description: 'Calculate tips and split bills easily',
    icon: DollarSign,
    path: '/tip-calculator',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    name: 'Loan Calculator',
    description: 'Calculate monthly payments and interest',
    icon: Calculator,
    path: '/loan-calculator',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    name: 'Pregnancy Calculator',
    description: 'Calculate your due date and pregnancy timeline',
    icon: Baby,
    path: '/pregnancy-calculator',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and calorie needs',
    icon: Heart,
    path: '/bmi-calculator',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    name: 'Discount Calculator',
    description: 'Calculate sale prices and savings',
    icon: Percent,
    path: '/discount-calculator',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    name: 'Age Calculator',
    description: 'Calculate exact age and time differences',
    icon: Calendar,
    path: '/age-calculator',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    name: 'Split Bill Calculator',
    description: 'Split bills and expenses with friends',
    icon: Users,
    path: '/split-bill-calculator',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50'
  },
  {
    name: 'Unit Converter',
    description: 'Convert cooking, weight, and distance units',
    icon: ArrowLeftRight,
    path: '/unit-converter',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  }
];

export function Home() {
  useEffect(() => {
    document.title = 'QuickCalc Tools - Free Online Calculators & Converters';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Free Online Calculators
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Quick and easy calculators for everyday calculations. No signup required, completely free!
        </p>
      </div>

      {/* Ad Placement */}
      <div className="mb-12">
        <AdPlaceholder label="Featured Ad Space" />
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {calculators.map((calc) => {
          const Icon = calc.icon;
          return (
            <Link key={calc.path} to={calc.path}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${calc.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`h-6 w-6 ${calc.color}`} />
                  </div>
                  <CardTitle className="text-xl">{calc.name}</CardTitle>
                  <CardDescription>{calc.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Bottom Ad */}
      <div className="mb-12">
        <AdPlaceholder label="Bottom Ad Space" />
      </div>

      {/* SEO Content */}
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use Our Free Calculators?</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Fast & Simple</h3>
            <p className="text-gray-600">
              Get instant results without complex formulas. Our calculators are designed for quick, accurate calculations.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Always Free</h3>
            <p className="text-gray-600">
              No hidden fees, no subscriptions. All our tools are completely free to use, anytime, anywhere.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-gray-600">
              Use our calculators on any device - phone, tablet, or desktop. Perfect for on-the-go calculations.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">No Installation</h3>
            <p className="text-gray-600">
              Works directly in your browser. No apps to download, no registration required.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Calculators</h2>
        <p className="text-gray-600 mb-4">
          Our tip calculator helps you calculate the perfect tip at restaurants and split bills with friends.
          The loan calculator shows you monthly payments for mortgages, car loans, and personal loans.
          Expecting? Use our pregnancy calculator to find your due date and track your pregnancy week by week.
        </p>
        <p className="text-gray-600">
          Need to check your health? Our BMI calculator determines if you're at a healthy weight and calculates
          your daily calorie needs. Shopping? The discount calculator shows you the final price and how much you save.
          Convert between cooking measurements, weights, and distances with our unit converter.
        </p>
      </div>
    </div>
  );
}
