import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/components/AdSense';
import { ResultInsights } from '@/components/ResultInsights';
import { AIInsights } from '@/components/AIInsights';
import { Download, Activity, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { exportToPDF } from '@/lib/pdfExport';

export function BMICalculator() {
  const [system, setSystem] = useState<'imperial' | 'metric'>('imperial');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState('1.2');

  const [bmi, setBMI] = useState(0);
  const [category, setCategory] = useState('');
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    document.title = 'BMI Calculator & Calorie Calculator - Export PDF Report | QuickCalc Tools';
  }, []);

  useEffect(() => {
    let weightKg = 0;
    let heightCm = 0;

    if (system === 'imperial') {
      weightKg = parseFloat(weight) * 0.453592; // lbs to kg
      const totalInches = (parseFloat(feet) || 0) * 12 + (parseFloat(inches) || 0);
      heightCm = totalInches * 2.54; // inches to cm
    } else {
      weightKg = parseFloat(weight);
      heightCm = parseFloat(height);
    }

    if (weightKg > 0 && heightCm > 0) {
      const heightM = heightCm / 100;
      const calculatedBMI = weightKg / (heightM * heightM);
      setBMI(calculatedBMI);

      if (calculatedBMI < 18.5) setCategory('Underweight');
      else if (calculatedBMI < 25) setCategory('Normal weight');
      else if (calculatedBMI < 30) setCategory('Overweight');
      else setCategory('Obese');

      // Calculate BMR using Mifflin-St Jeor Equation
      const ageNum = parseFloat(age) || 25;
      let bmr = 0;
      if (gender === 'male') {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
      } else {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
      }

      // Apply activity factor
      const tdee = bmr * parseFloat(activity);
      setCalories(Math.round(tdee));
    } else {
      setBMI(0);
      setCategory('');
      setCalories(0);
    }
  }, [weight, height, feet, inches, age, gender, activity, system]);

  // Generate insights based on BMI and health data
  const getInsights = () => {
    if (bmi === 0) return [];

    const insights = [];

    // BMI category insights
    if (category === 'Underweight') {
      insights.push({
        type: 'warning' as const,
        title: 'Underweight Alert',
        description: 'Your BMI indicates you are underweight. Consider consulting with a healthcare provider about healthy weight gain strategies and ensure adequate nutrition.',
      });
      insights.push({
        type: 'tip' as const,
        title: 'Weight Gain Strategy',
        description: `Aim for ${calories + 500} calories per day with strength training to build healthy muscle mass. Focus on nutrient-dense foods.`,
      });
    } else if (category === 'Normal weight') {
      insights.push({
        type: 'success' as const,
        title: 'Healthy BMI Range',
        description: 'Congratulations! Your BMI is in the healthy range. Maintain your weight through balanced nutrition and regular physical activity.',
      });
      insights.push({
        type: 'tip' as const,
        title: 'Maintenance Tips',
        description: `Stick to around ${calories} calories per day and exercise 150 minutes per week to maintain your healthy weight.`,
      });
    } else if (category === 'Overweight') {
      insights.push({
        type: 'warning' as const,
        title: 'Overweight Category',
        description: 'Your BMI indicates you are overweight. Small lifestyle changes can make a big difference. Consider consulting a healthcare provider.',
      });
      insights.push({
        type: 'tip' as const,
        title: 'Weight Loss Strategy',
        description: `Aim for ${calories - 500} calories per day to lose about 1 pound per week. Combine with 30 minutes of daily exercise for best results.`,
      });
    } else if (category === 'Obese') {
      insights.push({
        type: 'warning' as const,
        title: 'Health Risk Alert',
        description: 'Your BMI indicates obesity, which can increase health risks. Please consult with a healthcare provider for personalized guidance.',
      });
      insights.push({
        type: 'info' as const,
        title: 'Start Small',
        description: 'Set realistic goals. Even a 5-10% weight loss can significantly improve health markers. Focus on sustainable changes.',
      });
    }

    // Activity level insights
    if (parseFloat(activity) <= 1.2) {
      insights.push({
        type: 'tip' as const,
        title: 'Increase Activity',
        description: 'You have a sedentary lifestyle. Adding just 30 minutes of daily walking could burn an extra 150-200 calories and improve health.',
      });
    } else if (parseFloat(activity) >= 1.725) {
      insights.push({
        type: 'success' as const,
        title: 'Active Lifestyle',
        description: 'Great job staying active! Make sure you are eating enough to fuel your workouts and recovery.',
      });
    }

    // Age-specific insights
    const ageNum = parseFloat(age) || 25;
    if (ageNum >= 40) {
      insights.push({
        type: 'info' as const,
        title: 'Age Considerations',
        description: 'Metabolism naturally slows with age. Include strength training 2-3 times per week to preserve muscle mass and metabolism.',
      });
    }

    return insights;
  };

  const handleExportPDF = async () => {
    await exportToPDF({
      fileName: `bmi-calculator-report-${new Date().toISOString().split('T')[0]}.pdf`,
      title: 'BMI & Calorie Calculator Report',
      elementId: 'bmi-report',
    });
  };

  // Calculate weight ranges for different BMI categories
  const getWeightRanges = () => {
    let heightM = 0;
    if (system === 'imperial') {
      const totalInches = (parseFloat(feet) || 0) * 12 + (parseFloat(inches) || 0);
      heightM = (totalInches * 2.54) / 100;
    } else {
      heightM = (parseFloat(height) || 0) / 100;
    }

    if (heightM === 0) return [];

    const ranges = [
      { category: 'Underweight', minBMI: 16, maxBMI: 18.5, color: '#fbbf24' },
      { category: 'Normal', minBMI: 18.5, maxBMI: 25, color: '#10b981' },
      { category: 'Overweight', minBMI: 25, maxBMI: 30, color: '#f97316' },
      { category: 'Obese', minBMI: 30, maxBMI: 35, color: '#ef4444' },
    ];

    return ranges.map(range => {
      const minWeight = range.minBMI * heightM * heightM;
      const maxWeight = range.maxBMI * heightM * heightM;
      const minWeightDisplay = system === 'imperial' ? minWeight * 2.20462 : minWeight;
      const maxWeightDisplay = system === 'imperial' ? maxWeight * 2.20462 : maxWeight;

      return {
        ...range,
        minWeight: minWeightDisplay,
        maxWeight: maxWeightDisplay,
      };
    });
  };

  // Generate calorie goals chart data
  const getCalorieGoals = () => {
    if (calories === 0) return [];

    return [
      { goal: 'Lose 2 lbs/week', calories: calories - 1000, color: '#ef4444' },
      { goal: 'Lose 1 lb/week', calories: calories - 500, color: '#f97316' },
      { goal: 'Maintain', calories: calories, color: '#10b981' },
      { goal: 'Gain 1 lb/week', calories: calories + 500, color: '#3b82f6' },
      { goal: 'Gain 2 lbs/week', calories: calories + 1000, color: '#8b5cf6' },
    ];
  };

  const hasResults = bmi > 0;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">BMI & Calorie Calculator</h1>
        <p className="text-base md:text-lg text-gray-600">Calculate your Body Mass Index and daily calorie needs</p>
      </div>

      {/* Mobile Results - Compact summary */}
      {bmi > 0 && (
        <Card className="md:hidden bg-red-50 border-red-200 shadow-md mb-4">
          <CardContent className="p-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-red-700 mb-0.5">BMI</p>
                <p className="text-lg font-bold text-red-900">{bmi.toFixed(1)}</p>
                <p className="text-xs font-medium text-red-700">{category}</p>
              </div>
              <div>
                <p className="text-xs text-red-700 mb-0.5">Maintain</p>
                <p className="text-sm font-bold text-red-900">{calories}</p>
                <p className="text-xs text-red-600">cal/day</p>
              </div>
              <div>
                <p className="text-xs text-red-700 mb-0.5">Lose/Gain</p>
                <p className="text-xs font-bold text-red-900">{calories - 500}</p>
                <p className="text-xs font-bold text-red-900">{calories + 500}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Enter your details for accurate calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={system === 'imperial' ? 'default' : 'outline'}
                  onClick={() => setSystem('imperial')}
                  className="h-14 md:h-12 text-base md:text-sm font-bold"
                >
                  Imperial (lbs/ft)
                </Button>
                <Button
                  variant={system === 'metric' ? 'default' : 'outline'}
                  onClick={() => setSystem('metric')}
                  className="h-14 md:h-12 text-base md:text-sm font-bold"
                >
                  Metric (kg/cm)
                </Button>
              </div>

              {system === 'imperial' ? (
                <>
                  <div>
                    <Label htmlFor="weight" className="text-sm md:text-base">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      inputMode="decimal"
                      placeholder="150"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="text-lg h-14 md:h-12"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="feet" className="text-sm md:text-base">Height (feet)</Label>
                      <Input
                        id="feet"
                        type="number"
                        inputMode="numeric"
                        placeholder="5"
                        value={feet}
                        onChange={(e) => setFeet(e.target.value)}
                        className="text-lg h-14 md:h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inches" className="text-sm md:text-base">Height (inches)</Label>
                      <Input
                        id="inches"
                        type="number"
                        inputMode="numeric"
                        placeholder="8"
                        value={inches}
                        onChange={(e) => setInches(e.target.value)}
                        className="text-lg h-14 md:h-12"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="weightKg" className="text-sm md:text-base">Weight (kg)</Label>
                    <Input
                      id="weightKg"
                      type="number"
                      inputMode="decimal"
                      placeholder="70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="text-lg h-14 md:h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="heightCm" className="text-sm md:text-base">Height (cm)</Label>
                    <Input
                      id="heightCm"
                      type="number"
                      inputMode="decimal"
                      placeholder="170"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="text-lg h-14 md:h-12"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age" className="text-sm md:text-base">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    inputMode="numeric"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="text-lg h-14 md:h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="gender" className="text-sm md:text-base">Gender</Label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    className="flex h-14 md:h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="activity" className="text-sm md:text-base">Activity Level</Label>
                <select
                  id="activity"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="flex h-14 md:h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="1.2">Sedentary (little or no exercise)</option>
                  <option value="1.375">Lightly active (1-3 days/week)</option>
                  <option value="1.55">Moderately active (3-5 days/week)</option>
                  <option value="1.725">Very active (6-7 days/week)</option>
                  <option value="1.9">Super active (athlete)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 hidden md:block">
            <AdPlaceholder label="BMI Calculator Ad" />
          </div>
        </div>

        {/* Desktop Results - Hidden on mobile */}
        <div className="hidden md:block md:col-span-1">
          <Card className="bg-red-50 border-red-200 sticky top-24">
            <CardHeader>
              <CardTitle className="text-red-900">Your Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bmi > 0 ? (
                <>
                  <div>
                    <p className="text-sm text-red-700 mb-1">BMI</p>
                    <p className="text-3xl font-bold text-red-900">{bmi.toFixed(1)}</p>
                    <p className="text-sm font-medium text-red-700 mt-1">{category}</p>
                  </div>
                  <div className="border-t border-red-200 pt-4">
                    <p className="text-sm text-red-700 mb-1">Daily Calories</p>
                    <p className="text-2xl font-bold text-red-900">{calories} cal</p>
                    <p className="text-xs text-red-600 mt-1">to maintain weight</p>
                  </div>
                  <div className="border-t border-red-200 pt-4">
                    <p className="text-xs text-red-700">
                      <strong>To lose weight:</strong> {calories - 500} cal/day<br />
                      <strong>To gain weight:</strong> {calories + 500} cal/day
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-red-700">Enter your details to see results</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comprehensive Results Section with Charts and Insights */}
      {hasResults && (
        <div id="bmi-report" className="mt-8 md:mt-12 space-y-6">
          {/* Export PDF Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleExportPDF}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
          </div>

          {/* BMI Visualization */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-br from-red-50/50 to-white">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-600" />
                Your BMI Analysis
              </CardTitle>
              <CardDescription>
                Visual breakdown of your Body Mass Index and health metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* BMI Range Chart */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  BMI Category Ranges (at your height)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={getWeightRanges()}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      label={{ value: `Weight (${system === 'imperial' ? 'lbs' : 'kg'})`, position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis type="category" dataKey="category" />
                    <Tooltip
                      formatter={(value: number) =>
                        `${value.toFixed(1)} ${system === 'imperial' ? 'lbs' : 'kg'}`
                      }
                    />
                    <Legend />
                    <Bar dataKey="minWeight" stackId="a" fill="#e5e7eb" name="Min Weight" />
                    <Bar
                      dataKey={(data: any) => data.maxWeight - data.minWeight}
                      stackId="a"
                      name="Range"
                    >
                      {getWeightRanges().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <ReferenceLine
                      x={parseFloat(weight) || 0}
                      stroke="#000"
                      strokeWidth={2}
                      label={{ value: 'You', position: 'top' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Calorie Goals Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Daily Calorie Goals for Different Objectives
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getCalorieGoals()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="goal" angle={-15} textAnchor="end" height={80} />
                    <YAxis
                      label={{ value: 'Calories per Day', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Bar dataKey="calories" name="Daily Calories">
                      {getCalorieGoals().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Insights */}
          <ResultInsights insights={getInsights()} title="Personalized Health Insights" />

          {/* AI-Powered Insights */}
          <AIInsights
            context={{
              bmi: bmi.toFixed(1),
              category,
              weight: `${weight} ${system === 'imperial' ? 'lbs' : 'kg'}`,
              height: system === 'imperial' ? `${feet}' ${inches}"` : `${height} cm`,
              age: age || 'not specified',
              gender,
              activityLevel: parseFloat(activity) <= 1.2 ? 'sedentary' :
                parseFloat(activity) <= 1.375 ? 'lightly active' :
                parseFloat(activity) <= 1.55 ? 'moderately active' :
                parseFloat(activity) <= 1.725 ? 'very active' : 'super active',
              dailyCalories: calories,
            }}
            toolType="BMI & Health"
          />

          {/* Detailed Health Metrics */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-br from-green-50/50 to-white">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Detailed Health Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">Your Stats</h4>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Height</span>
                    <span className="font-semibold">
                      {system === 'imperial'
                        ? `${feet}' ${inches}"`
                        : `${height} cm`}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-semibold">
                      {weight} {system === 'imperial' ? 'lbs' : 'kg'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Age</span>
                    <span className="font-semibold">{age || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Gender</span>
                    <span className="font-semibold capitalize">{gender}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">BMI Results</h4>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">BMI Score</span>
                    <span className="font-semibold text-red-600 text-lg">
                      {bmi.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold">{category}</span>
                  </div>
                  <div className="pt-2">
                    <div className="bg-gradient-to-r from-yellow-400 via-green-400 via-orange-400 to-red-400 h-4 rounded-full relative">
                      <div
                        className="absolute top-0 w-1 h-6 bg-black -mt-1"
                        style={{
                          left: `${Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>15</span>
                      <span>40</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">Calorie Needs</h4>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Maintain Weight</span>
                    <span className="font-semibold text-green-600">
                      {calories} cal
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Lose 1 lb/week</span>
                    <span className="font-semibold">{calories - 500} cal</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Gain 1 lb/week</span>
                    <span className="font-semibold">{calories + 500} cal</span>
                  </div>
                  <div className="pt-2 text-xs text-gray-600">
                    Based on {activity === '1.2' ? 'sedentary' : activity === '1.375' ? 'light' : activity === '1.55' ? 'moderate' : activity === '1.725' ? 'very active' : 'super active'} activity level
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8 md:mt-12 prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding BMI</h2>
        <p className="text-gray-600 mb-4">
          Body Mass Index (BMI) is a measure of body fat based on height and weight. It's a useful screening
          tool but doesn't directly measure body fat percentage.
        </p>
        <h3 className="text-xl font-bold text-gray-900 mb-3">BMI Categories</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li><strong>Under 18.5:</strong> Underweight</li>
          <li><strong>18.5 - 24.9:</strong> Normal weight</li>
          <li><strong>25 - 29.9:</strong> Overweight</li>
          <li><strong>30 and above:</strong> Obese</li>
        </ul>
        <h3 className="text-xl font-bold text-gray-900 mb-3">About Calorie Calculations</h3>
        <p className="text-gray-600">
          Your daily calorie needs are calculated using the Mifflin-St Jeor equation, which accounts for
          your weight, height, age, gender, and activity level. To lose about 1 pound per week, subtract
          500 calories from your maintenance calories. To gain weight, add 500 calories.
        </p>
      </div>
    </div>
  );
}
