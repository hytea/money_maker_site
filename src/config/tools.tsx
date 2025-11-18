import {
  Calculator,
  DollarSign,
  Baby,
  Heart,
  Percent,
  Calendar,
  Users,
  ArrowLeftRight,
  type LucideIcon
} from 'lucide-react';

// Import all calculator pages
import { Home } from '@/pages/Home';
import { TipCalculator } from '@/pages/TipCalculator';
import { LoanCalculator } from '@/pages/LoanCalculator';
import { PregnancyCalculator } from '@/pages/PregnancyCalculator';
import { BMICalculator } from '@/pages/BMICalculator';
import { DiscountCalculator } from '@/pages/DiscountCalculator';
import { AgeCalculator } from '@/pages/AgeCalculator';
import { SplitBillCalculator } from '@/pages/SplitBillCalculator';
import { UnitConverter } from '@/pages/UnitConverter';

export interface Tool {
  // Basic info
  name: string;
  path: string;
  component: React.ComponentType;

  // Display
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;

  // SEO
  title: string; // Page title
  metaDescription: string;
  keywords: string[];

  // Search volume indicators (for prioritization)
  searchVolume: 'high' | 'medium' | 'low';
}

/**
 * TOOL REGISTRY
 *
 * To add a new tool:
 * 1. Create the page component in src/pages/YourTool.tsx
 * 2. Import it at the top of this file
 * 3. Add a new entry to this array following the structure below
 *
 * The rest (routing, sitemap, SEO) is automatic!
 */
export const tools: Tool[] = [
  {
    name: 'Tip Calculator',
    path: '/tip-calculator',
    component: TipCalculator,
    description: 'Calculate tips and split bills easily',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    title: 'Tip Calculator - Calculate Tips and Split Bills | QuickCalc Tools',
    metaDescription: 'Free tip calculator to calculate restaurant tips, split bills, and determine per-person costs. Easy-to-use with quick tip percentages.',
    keywords: ['tip calculator', 'restaurant tip', 'split bill', 'gratuity calculator', 'tipping guide'],
    searchVolume: 'high'
  },
  {
    name: 'Loan Calculator',
    path: '/loan-calculator',
    component: LoanCalculator,
    description: 'Calculate monthly payments and interest',
    icon: Calculator,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    title: 'Loan Calculator - Calculate Monthly Payments & Export PDF Report | QuickCalc Tools',
    metaDescription: 'Free loan calculator with visual charts and PDF reports. Calculate monthly payments, total interest, amortization schedule. Get personalized insights and export detailed reports for mortgages, auto loans, and personal loans.',
    keywords: ['loan calculator', 'mortgage calculator', 'car loan', 'monthly payment calculator', 'interest calculator', 'loan calculator pdf', 'amortization chart'],
    searchVolume: 'high'
  },
  {
    name: 'Pregnancy Calculator',
    path: '/pregnancy-calculator',
    component: PregnancyCalculator,
    description: 'Calculate your due date and pregnancy timeline',
    icon: Baby,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    title: 'Pregnancy Due Date Calculator - Calculate Your Due Date | QuickCalc Tools',
    metaDescription: 'Free pregnancy calculator to determine your due date, current week, and trimester based on your last period. Track your pregnancy timeline.',
    keywords: ['pregnancy calculator', 'due date calculator', 'pregnancy week calculator', 'when is my due date', 'pregnancy timeline'],
    searchVolume: 'high'
  },
  {
    name: 'BMI Calculator',
    path: '/bmi-calculator',
    component: BMICalculator,
    description: 'Calculate your Body Mass Index and calorie needs',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    title: 'BMI Calculator & Calorie Calculator - Export PDF Health Report | QuickCalc Tools',
    metaDescription: 'Free BMI calculator with visual charts and PDF health reports. Calculate Body Mass Index, ideal weight, daily calorie needs with personalized insights. Export detailed health reports. Imperial and metric units.',
    keywords: ['bmi calculator', 'body mass index', 'calorie calculator', 'weight calculator', 'healthy weight', 'bmi chart', 'health report pdf'],
    searchVolume: 'high'
  },
  {
    name: 'Discount Calculator',
    path: '/discount-calculator',
    component: DiscountCalculator,
    description: 'Calculate sale prices and savings',
    icon: Percent,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    title: 'Discount Calculator - Calculate Sale Prices & Savings | QuickCalc Tools',
    metaDescription: 'Free discount calculator to find sale prices and savings. Calculate percentage off, final price, and how much you save on any purchase.',
    keywords: ['discount calculator', 'sale calculator', 'percentage off', 'savings calculator', 'price calculator'],
    searchVolume: 'high'
  },
  {
    name: 'Age Calculator',
    path: '/age-calculator',
    component: AgeCalculator,
    description: 'Calculate exact age and time differences',
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    title: 'Age Calculator - Calculate Your Exact Age | QuickCalc Tools',
    metaDescription: 'Free age calculator to find your exact age in years, months, and days. Calculate age from date of birth and days until next birthday.',
    keywords: ['age calculator', 'calculate age', 'how old am i', 'age from date of birth', 'birthday calculator'],
    searchVolume: 'medium'
  },
  {
    name: 'Split Bill Calculator',
    path: '/split-bill-calculator',
    component: SplitBillCalculator,
    description: 'Split bills and expenses with friends',
    icon: Users,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    title: 'Split Bill Calculator - Split Costs with Friends | QuickCalc Tools',
    metaDescription: 'Free bill split calculator to divide costs among friends. Calculate per-person amounts including tip and tax.',
    keywords: ['split bill calculator', 'bill splitter', 'divide bill', 'split expenses', 'group bill calculator'],
    searchVolume: 'medium'
  },
  {
    name: 'Unit Converter',
    path: '/unit-converter',
    component: UnitConverter,
    description: 'Convert cooking, weight, and distance units',
    icon: ArrowLeftRight,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    title: 'Unit Converter - Cooking, Weight & Distance | QuickCalc Tools',
    metaDescription: 'Free unit converter for cooking measurements, weight, and distance. Convert cups to ml, pounds to kg, miles to km, and more.',
    keywords: ['unit converter', 'cooking conversion', 'weight converter', 'metric converter', 'cups to ml'],
    searchVolume: 'high'
  }
];

// Home page configuration
export const homePage = {
  path: '/',
  component: Home,
  title: 'QuickCalc Tools - Free Online Calculators & Converters',
  metaDescription: 'Free online calculators and converters. Calculate tips, loans, BMI, pregnancy due dates, discounts, age, and more. Fast, simple, always free.',
  keywords: ['calculator', 'online calculator', 'free calculator', 'conversion tool', 'online tools']
};

// About page configuration
export const aboutPage = {
  path: '/about',
  title: 'About QuickCalc Tools - Free Online Calculator Tools',
  metaDescription: 'Learn about QuickCalc Tools, our mission to provide free, easy-to-use online calculators for everyone. No signup required, completely free forever.',
  keywords: ['about quickcalc', 'free calculators', 'online tools', 'calculator website']
};
