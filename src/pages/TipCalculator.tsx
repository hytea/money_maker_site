import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/components/AdSense';

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState('15');
  const [numPeople, setNumPeople] = useState('1');

  const [tipAmount, setTipAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [perPerson, setPerPerson] = useState(0);

  useEffect(() => {
    document.title = 'Tip Calculator - Calculate Tips and Split Bills | QuickCalc Tools';
  }, []);

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
  }, [billAmount, tipPercent, numPeople]);

  const quickTipButtons = [10, 15, 18, 20, 25];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tip Calculator</h1>
        <p className="text-gray-600">Calculate tips and split bills with ease</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Enter Bill Details</CardTitle>
              <CardDescription>Calculate the perfect tip amount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="billAmount">Bill Amount ($)</Label>
                <Input
                  id="billAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div>
                <Label htmlFor="tipPercent">Tip Percentage (%)</Label>
                <Input
                  id="tipPercent"
                  type="number"
                  step="1"
                  placeholder="15"
                  value={tipPercent}
                  onChange={(e) => setTipPercent(e.target.value)}
                  className="text-lg"
                />
                <div className="flex gap-2 mt-3 flex-wrap">
                  {quickTipButtons.map((percent) => (
                    <Button
                      key={percent}
                      variant={tipPercent === percent.toString() ? 'default' : 'outline'}
                      onClick={() => setTipPercent(percent.toString())}
                      className="flex-1 min-w-[60px]"
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="numPeople">Number of People</Label>
                <Input
                  id="numPeople"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={numPeople}
                  onChange={(e) => setNumPeople(e.target.value)}
                  className="text-lg"
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <AdPlaceholder label="Calculator Ad Space" />
          </div>
        </div>

        <div className="md:col-span-1">
          <Card className="bg-blue-50 border-blue-200 sticky top-24">
            <CardHeader>
              <CardTitle className="text-blue-900">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-blue-700 mb-1">Tip Amount</p>
                <p className="text-3xl font-bold text-blue-900">${tipAmount.toFixed(2)}</p>
              </div>
              <div className="border-t border-blue-200 pt-4">
                <p className="text-sm text-blue-700 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-blue-900">${totalAmount.toFixed(2)}</p>
              </div>
              <div className="border-t border-blue-200 pt-4">
                <p className="text-sm text-blue-700 mb-1">Per Person</p>
                <p className="text-2xl font-bold text-blue-900">${perPerson.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use the Tip Calculator</h2>
        <p className="text-gray-600 mb-4">
          Our tip calculator makes it easy to figure out how much to tip at restaurants, cafes, or for any service.
          Simply enter your bill amount, choose your desired tip percentage (or use our quick buttons for common
          percentages), and enter the number of people splitting the bill.
        </p>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Standard Tipping Guidelines</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li>15-20% for good service at restaurants</li>
          <li>10% for adequate service</li>
          <li>20-25% for exceptional service</li>
          <li>$1-2 per drink at bars</li>
          <li>15-20% for food delivery</li>
        </ul>
        <p className="text-gray-600">
          The calculator automatically updates as you type, showing you the tip amount, total bill including tip,
          and the amount each person should pay if you're splitting the bill. Perfect for dining out with friends!
        </p>
      </div>
    </div>
  );
}
