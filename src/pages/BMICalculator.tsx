import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/components/AdSense';

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
    document.title = 'BMI Calculator & Calorie Calculator | QuickCalc Tools';
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BMI & Calorie Calculator</h1>
        <p className="text-gray-600">Calculate your Body Mass Index and daily calorie needs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Enter your details for accurate calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Button
                  variant={system === 'imperial' ? 'default' : 'outline'}
                  onClick={() => setSystem('imperial')}
                  className="flex-1"
                >
                  Imperial (lbs/ft)
                </Button>
                <Button
                  variant={system === 'metric' ? 'default' : 'outline'}
                  onClick={() => setSystem('metric')}
                  className="flex-1"
                >
                  Metric (kg/cm)
                </Button>
              </div>

              {system === 'imperial' ? (
                <>
                  <div>
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="150"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="feet">Height (feet)</Label>
                      <Input
                        id="feet"
                        type="number"
                        placeholder="5"
                        value={feet}
                        onChange={(e) => setFeet(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inches">Height (inches)</Label>
                      <Input
                        id="inches"
                        type="number"
                        placeholder="8"
                        value={inches}
                        onChange={(e) => setInches(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="weightKg">Weight (kg)</Label>
                    <Input
                      id="weightKg"
                      type="number"
                      placeholder="70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="heightCm">Height (cm)</Label>
                    <Input
                      id="heightCm"
                      type="number"
                      placeholder="170"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="activity">Activity Level</Label>
                <select
                  id="activity"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
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

          <div className="mt-6">
            <AdPlaceholder label="BMI Calculator Ad" />
          </div>
        </div>

        <div className="md:col-span-1">
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

      <div className="mt-8 prose max-w-none">
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
