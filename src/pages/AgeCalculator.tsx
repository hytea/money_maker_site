import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdPlaceholder } from '@/components/AdSense';

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [nextBirthday, setNextBirthday] = useState(0);

  useEffect(() => {
    document.title = 'Age Calculator - Calculate Your Exact Age | QuickCalc Tools';
  }, []);

  useEffect(() => {
    if (birthDate) {
      const birth = new Date(birthDate);
      const today = new Date();

      let ageYears = today.getFullYear() - birth.getFullYear();
      let ageMonths = today.getMonth() - birth.getMonth();
      let ageDays = today.getDate() - birth.getDate();

      if (ageDays < 0) {
        ageMonths--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        ageDays += lastMonth.getDate();
      }

      if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
      }

      setYears(ageYears);
      setMonths(ageMonths);
      setDays(ageDays);

      const diffTime = Math.abs(today.getTime() - birth.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays);

      const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBday < today) {
        nextBday.setFullYear(today.getFullYear() + 1);
      }
      const daysToNext = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      setNextBirthday(daysToNext);
    }
  }, [birthDate]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Age Calculator</h1>
        <p className="text-gray-600">Calculate your exact age in years, months, and days</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Birth Date</CardTitle>
              <CardDescription>Find out your exact age</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="birthDate">Date of Birth</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="text-lg"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <AdPlaceholder label="Age Calculator Ad" />
          </div>
        </div>

        <div className="md:col-span-1">
          <Card className="bg-orange-50 border-orange-200 sticky top-24">
            <CardHeader>
              <CardTitle className="text-orange-900">Your Age</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {birthDate ? (
                <>
                  <div>
                    <p className="text-sm text-orange-700 mb-1">Age</p>
                    <p className="text-3xl font-bold text-orange-900">
                      {years} years
                    </p>
                    <p className="text-lg text-orange-800">
                      {months} months, {days} days
                    </p>
                  </div>
                  <div className="border-t border-orange-200 pt-4">
                    <p className="text-sm text-orange-700 mb-1">Total Days</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {totalDays.toLocaleString()}
                    </p>
                  </div>
                  <div className="border-t border-orange-200 pt-4">
                    <p className="text-sm text-orange-700 mb-1">Next Birthday In</p>
                    <p className="text-xl font-bold text-orange-900">
                      {nextBirthday} days
                    </p>
                  </div>
                  <div className="border-t border-orange-200 pt-4 text-sm text-orange-700">
                    <p>That's about {(totalDays / 365).toFixed(1)} years!</p>
                    <p className="mt-1">Or {(totalDays * 24).toLocaleString()} hours</p>
                  </div>
                </>
              ) : (
                <p className="text-orange-700">Enter your birth date to see results</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How the Age Calculator Works</h2>
        <p className="text-gray-600 mb-4">
          This age calculator determines your age in years, months, and days from your date of birth.
          It also shows you the total number of days you've been alive and how many days until your next birthday!
        </p>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Uses for Age Calculators</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li>Calculate exact age for official documents</li>
          <li>Find out how many days until milestone birthdays</li>
          <li>Determine age differences between people</li>
          <li>Track age for age-restricted activities</li>
          <li>Calculate pet ages in human years equivalent</li>
        </ul>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Fun Age Facts</h3>
        <p className="text-gray-600">
          Did you know that each year isn't exactly 365 days? Leap years add an extra day every 4 years
          (with some exceptions). Our calculator accounts for this to give you the most accurate age possible.
        </p>
      </div>
    </div>
  );
}
