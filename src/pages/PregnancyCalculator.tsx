import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdSense } from '@/components/AdSense';
import { InterstitialAd, useInterstitialAd } from '@/components/InterstitialAd';

export function PregnancyCalculator() {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [weeksPregnant, setWeeksPregnant] = useState(0);
  const [daysPregnant, setDaysPregnant] = useState(0);
  const [trimester, setTrimester] = useState(0);
  const [daysUntilDue, setDaysUntilDue] = useState(0);

  const { showInterstitial, triggerInterstitial, dismissInterstitial } = useInterstitialAd();

  useEffect(() => {
    document.title = 'Pregnancy Due Date Calculator - Calculate Your Due Date | QuickCalc Tools';
    triggerInterstitial();
  }, []);

  useEffect(() => {
    if (lastPeriod) {
      const lmp = new Date(lastPeriod);
      const cycle = parseInt(cycleLength) || 28;

      // Calculate due date (280 days from LMP, adjusted for cycle length)
      const adjustedDays = 280 + (cycle - 28);
      const due = new Date(lmp);
      due.setDate(due.getDate() + adjustedDays);
      setDueDate(due);

      // Calculate how far along
      const today = new Date();
      const daysSinceLMP = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(daysSinceLMP / 7);
      const days = daysSinceLMP % 7;

      setWeeksPregnant(weeks);
      setDaysPregnant(days);

      // Calculate trimester
      if (weeks < 13) setTrimester(1);
      else if (weeks < 27) setTrimester(2);
      else setTrimester(3);

      // Days until due date
      const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      setDaysUntilDue(daysLeft);
    }
  }, [lastPeriod, cycleLength]);

  return (
    <>
      <InterstitialAd show={showInterstitial} onDismiss={dismissInterstitial} />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Pregnancy Due Date Calculator</h1>
        <p className="text-base md:text-lg text-gray-600">Calculate your pregnancy due date and timeline</p>
      </div>

      {/* Mobile Results - Compact summary */}
      {dueDate && (
        <Card className="md:hidden bg-pink-50 border-pink-200 shadow-md mb-4">
          <CardContent className="p-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-pink-700 mb-0.5">Due Date</p>
                <p className="text-sm font-bold text-pink-900">
                  {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-pink-700 mb-0.5">You are</p>
                <p className="text-sm font-bold text-pink-900">
                  {weeksPregnant}w {daysPregnant}d
                </p>
              </div>
              <div>
                <p className="text-xs text-pink-700 mb-0.5">Days left</p>
                <p className="text-sm font-bold text-pink-900">
                  {daysUntilDue > 0 ? daysUntilDue : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Enter Pregnancy Information</CardTitle>
              <CardDescription>Based on your last menstrual period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div>
                <Label htmlFor="lastPeriod" className="text-sm md:text-base">First Day of Last Period</Label>
                <Input
                  id="lastPeriod"
                  type="date"
                  value={lastPeriod}
                  onChange={(e) => setLastPeriod(e.target.value)}
                  className="text-lg h-14 md:h-12"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="cycleLength" className="text-sm md:text-base">Average Cycle Length (days)</Label>
                <Input
                  id="cycleLength"
                  type="number"
                  inputMode="numeric"
                  min="20"
                  max="45"
                  placeholder="28"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  className="text-lg h-14 md:h-12"
                />
                <p className="text-sm text-gray-500 mt-1">Most women have a 28-day cycle</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 hidden md:block">
            <AdSense slot="4567890123" format="auto" responsive={true} />
          </div>
        </div>

        {/* Desktop Results - Hidden on mobile */}
        <div className="hidden md:block md:col-span-1">
          <Card className="bg-pink-50 border-pink-200 sticky top-24">
            <CardHeader>
              <CardTitle className="text-pink-900">Your Pregnancy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dueDate ? (
                <>
                  <div>
                    <p className="text-sm text-pink-700 mb-1">Due Date</p>
                    <p className="text-2xl font-bold text-pink-900">
                      {dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="border-t border-pink-200 pt-4">
                    <p className="text-sm text-pink-700 mb-1">You are</p>
                    <p className="text-2xl font-bold text-pink-900">
                      {weeksPregnant} weeks, {daysPregnant} days
                    </p>
                  </div>
                  <div className="border-t border-pink-200 pt-4">
                    <p className="text-sm text-pink-700 mb-1">Current Trimester</p>
                    <p className="text-xl font-bold text-pink-900">
                      {trimester === 1 ? 'First' : trimester === 2 ? 'Second' : 'Third'} Trimester
                    </p>
                  </div>
                  <div className="border-t border-pink-200 pt-4">
                    <p className="text-sm text-pink-700 mb-1">Days Until Due Date</p>
                    <p className="text-xl font-bold text-pink-900">{daysUntilDue > 0 ? daysUntilDue : 0} days</p>
                  </div>
                </>
              ) : (
                <p className="text-pink-700">Enter your last period date to see results</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 md:mt-12 prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How Pregnancy Due Date is Calculated</h2>
        <p className="text-gray-600 mb-4">
          Pregnancy due dates are calculated from the first day of your last menstrual period (LMP).
          A typical pregnancy lasts 40 weeks (280 days) from your LMP. This calculator adjusts for
          your cycle length if it differs from the standard 28 days.
        </p>
        <h3 className="text-xl font-bold text-gray-900 mb-3">The Three Trimesters</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li><strong>First Trimester (Weeks 1-12):</strong> Baby's organs begin to form</li>
          <li><strong>Second Trimester (Weeks 13-26):</strong> You can feel baby move</li>
          <li><strong>Third Trimester (Weeks 27-40):</strong> Baby grows and prepares for birth</li>
        </ul>
        <p className="text-gray-600 mb-4">
          <strong>Important:</strong> Only about 5% of babies arrive on their exact due date. Most babies
          are born between 38 and 42 weeks. Always consult with your healthcare provider for accurate
          pregnancy dating and prenatal care.
        </p>
        <h3 className="text-xl font-bold text-gray-900 mb-3">When to See Your Doctor</h3>
        <p className="text-gray-600">
          Schedule your first prenatal appointment around 8 weeks of pregnancy. Your doctor will perform
          an ultrasound to confirm your due date and check on baby's development.
        </p>
      </div>
      </div>
    </>
  );
}
