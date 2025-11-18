import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdPlaceholder } from '@/components/AdSense';
import { DollarSign, Users, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ShareButton } from '@/components/ShareButton';
import { CalculationHistory } from '@/components/CalculationHistory';

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState('15');
  const [numPeople, setNumPeople] = useState('1');

  const [tipAmount, setTipAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [perPerson, setPerPerson] = useState(0);

  const { trackCalculatorResult, trackButtonClick } = useAnalytics();

  useEffect(() => {
    document.title = 'Tip Calculator - Calculate Tips and Split Bills | QuickCalc Tools';
  }, []);

  const handleLoadFromHistory = (inputs: Record<string, any>) => {
    if (inputs.billAmount !== undefined) setBillAmount(String(inputs.billAmount));
    if (inputs.tipPercent !== undefined) setTipPercent(String(inputs.tipPercent));
    if (inputs.numPeople !== undefined) setNumPeople(String(inputs.numPeople));
  };

  useEffect(() => {
    const bill = parseFloat(billAmount) || 0;
    const tip = parseFloat(tipPercent) || 0;
    const people = parseInt(numPeople) || 1;

    const tipAmt = bill * (tip / 100);
    const total = bill + tipAmt;
    const perPersonAmt = total / people;

    setTipAmount(tipAmt);
    setTotalAmount(total);
    setPerPerson(perPersonAmt);

    // Track calculation if we have valid inputs
    if (billAmount && parseFloat(billAmount) > 0) {
      trackCalculatorResult('tip-calculator', {
        billAmount: bill,
        tipPercent: tip,
        numPeople: people,
        tipAmount: tipAmt,
        totalAmount: total,
      });
    }
  }, [billAmount, tipPercent, numPeople, trackCalculatorResult]);

  const quickTipButtons = [10, 15, 18, 20, 25];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 md:py-12">
      {/* Page Header */}
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 border border-emerald-200 mb-3 md:mb-4">
          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-800">POPULAR TOOL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">Tip Calculator</h1>
        <p className="text-base md:text-lg text-gray-600">Calculate tips and split bills with ease - perfect for dining out</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {/* Mobile Results Section - Shows at top on mobile */}
        <div className="md:hidden">
          <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 via-white to-accent-50 sticky top-20 z-10 shadow-lg">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-primary-200">
                  <p className="text-xs font-medium text-gray-600 mb-1">Tip Amount</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                    ${tipAmount.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-primary-200">
                  <p className="text-xs font-medium text-gray-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
                </div>
                <div className="col-span-2 bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-primary-200">
                  <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Per Person
                  </p>
                  <p className="text-3xl font-bold text-primary-700">${perPerson.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Input Section */}
        <div className="md:col-span-2 space-y-4 md:space-y-6">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-br from-primary-50/50 to-white">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                Enter Bill Details
              </CardTitle>
              <CardDescription>Fill in the information below to calculate your tip</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6 pt-4 md:pt-6">
              <div className="space-y-2">
                <Label htmlFor="billAmount" className="text-sm md:text-base font-semibold">Bill Amount ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="billAmount"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="0.00"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="text-lg pl-10 h-14 md:h-12"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="tipPercent" className="text-sm md:text-base font-semibold">Tip Percentage (%)</Label>
                <div className="grid grid-cols-5 gap-2">
                  {quickTipButtons.map((percent) => (
                    <Button
                      key={percent}
                      variant={tipPercent === percent.toString() ? 'default' : 'outline'}
                      onClick={() => {
                        setTipPercent(percent.toString());
                        trackButtonClick(`quick-tip-${percent}`, 'tip-calculator');
                      }}
                      className="h-14 md:h-12 text-base md:text-sm font-bold"
                      size="lg"
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
                <Input
                  id="tipPercent"
                  type="number"
                  inputMode="numeric"
                  step="1"
                  placeholder="Custom %"
                  value={tipPercent}
                  onChange={(e) => setTipPercent(e.target.value)}
                  className="text-lg h-14 md:h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numPeople" className="text-sm md:text-base font-semibold">Number of People</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="numPeople"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    placeholder="1"
                    value={numPeople}
                    onChange={(e) => setNumPeople(e.target.value)}
                    className="text-lg pl-10 h-14 md:h-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hide ad on mobile, show on desktop */}
          <div className="hidden md:block">
            <AdPlaceholder label="Calculator Ad Space" />
          </div>
        </div>

        {/* Desktop Results Section - Hidden on mobile */}
        <div className="hidden md:block md:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 via-white to-accent-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-primary-900">
                  <TrendingUp className="h-5 w-5" />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-primary-200">
                  <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Tip Amount
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                    ${tipAmount.toFixed(2)}
                  </p>
                </div>

                <Separator className="bg-primary-200" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Amount</span>
                    <span className="text-xl font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg border border-primary-100">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      Per Person
                    </span>
                    <span className="text-xl font-bold text-primary-700">${perPerson.toFixed(2)}</span>
                  </div>
                </div>

                {billAmount && parseFloat(billAmount) > 0 && (
                  <>
                    <div className="mt-4 pt-4 border-t border-primary-200">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        <span>Calculation complete</span>
                      </div>
                    </div>
                    <ShareButton
                      calculatorType="Tip Calculator"
                      title={`Tip Calculation: $${billAmount} bill with ${tipPercent}% tip`}
                      description={`Total: $${totalAmount.toFixed(2)} | Per person: $${perPerson.toFixed(2)}`}
                      inputs={{
                        billAmount: parseFloat(billAmount),
                        tipPercent: parseFloat(tipPercent),
                        numPeople: parseInt(numPeople),
                      }}
                      results={{
                        tipAmount: parseFloat(tipAmount.toFixed(2)),
                        totalAmount: parseFloat(totalAmount.toFixed(2)),
                        perPerson: parseFloat(perPerson.toFixed(2)),
                      }}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <CalculationHistory
              calculatorType="tip-calculator"
              onLoadCalculation={handleLoadFromHistory}
            />

            <Card className="border border-gray-200 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Quick Guide</h4>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>10% - Basic service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>15-18% - Good service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>20-25% - Excellent service</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12">
        <Card className="border-2 border-gray-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use the Tip Calculator</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our tip calculator makes it easy to figure out how much to tip at restaurants, cafes, or for any service.
              Simply enter your bill amount, choose your desired tip percentage (or use our quick buttons for common
              percentages), and enter the number of people splitting the bill.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Standard Tipping Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <Badge variant="success" className="mt-1">15-20%</Badge>
                <div>
                  <p className="font-medium text-gray-900">Restaurant service</p>
                  <p className="text-sm text-gray-600">For good to excellent table service</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="warning" className="mt-1">10%</Badge>
                <div>
                  <p className="font-medium text-gray-900">Adequate service</p>
                  <p className="text-sm text-gray-600">When service is acceptable but basic</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="success" className="mt-1">20-25%</Badge>
                <div>
                  <p className="font-medium text-gray-900">Exceptional service</p>
                  <p className="text-sm text-gray-600">For outstanding dining experiences</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="default" className="mt-1">$1-2</Badge>
                <div>
                  <p className="font-medium text-gray-900">Bar service</p>
                  <p className="text-sm text-gray-600">Per drink at bars and pubs</p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">
              The calculator automatically updates as you type, showing you the tip amount, total bill including tip,
              and the amount each person should pay if you're splitting the bill. Perfect for dining out with friends!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
