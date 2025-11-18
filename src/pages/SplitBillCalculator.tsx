import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdPlaceholder } from '@/components/AdSense';

export function SplitBillCalculator() {
  const [totalBill, setTotalBill] = useState('');
  const [numPeople, setNumPeople] = useState('2');
  const [tip, setTip] = useState('15');

  const [tipAmount, setTipAmount] = useState(0);
  const [totalWithTip, setTotalWithTip] = useState(0);
  const [perPerson, setPerPerson] = useState(0);

  useEffect(() => {
    document.title = 'Split Bill Calculator - Split Costs with Friends | QuickCalc Tools';
  }, []);

  useEffect(() => {
    const bill = parseFloat(totalBill) || 0;
    const people = parseInt(numPeople) || 1;
    const tipPercent = parseFloat(tip) || 0;

    const tipAmt = bill * (tipPercent / 100);
    const total = bill + tipAmt;
    const perPersonAmt = total / people;

    setTipAmount(tipAmt);
    setTotalWithTip(total);
    setPerPerson(perPersonAmt);
  }, [totalBill, numPeople, tip]);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Split Bill Calculator</h1>
        <p className="text-base md:text-lg text-gray-600">Easily split bills and expenses with friends</p>
      </div>

      {/* Mobile Results - Sticky at top */}
      {totalBill && parseFloat(totalBill) > 0 && (
        <Card className="md:hidden bg-teal-50 border-teal-200 sticky top-20 z-10 shadow-lg mb-4">
          <CardContent className="pt-4 space-y-3">
            <div>
              <p className="text-xs text-teal-700 mb-1">Each Person Pays</p>
              <p className="text-3xl font-bold text-teal-900">${perPerson.toFixed(2)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-teal-200">
              <div>
                <p className="text-xs text-teal-700 mb-1">Tip Amount</p>
                <p className="text-lg font-bold text-teal-900">${tipAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-teal-700 mb-1">Total with Tip</p>
                <p className="text-lg font-bold text-teal-900">${totalWithTip.toFixed(2)}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-teal-200">
              <p className="text-xs text-teal-700">
                Splitting <strong>${totalWithTip.toFixed(2)}</strong> between <strong>{numPeople}</strong> {parseInt(numPeople) === 1 ? 'person' : 'people'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Bill Details</CardTitle>
              <CardDescription>Enter the total and number of people</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div>
                <Label htmlFor="totalBill" className="text-sm md:text-base">Total Bill ($)</Label>
                <Input
                  id="totalBill"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="100.00"
                  value={totalBill}
                  onChange={(e) => setTotalBill(e.target.value)}
                  className="text-lg h-14 md:h-12"
                />
              </div>

              <div>
                <Label htmlFor="numPeople" className="text-sm md:text-base">Number of People</Label>
                <Input
                  id="numPeople"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  placeholder="2"
                  value={numPeople}
                  onChange={(e) => setNumPeople(e.target.value)}
                  className="text-lg h-14 md:h-12"
                />
              </div>

              <div>
                <Label htmlFor="tip" className="text-sm md:text-base">Tip (%)</Label>
                <Input
                  id="tip"
                  type="number"
                  inputMode="decimal"
                  step="1"
                  placeholder="15"
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                  className="text-lg h-14 md:h-12"
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 hidden md:block">
            <AdPlaceholder label="Split Bill Calculator Ad" />
          </div>
        </div>

        {/* Desktop Results - Hidden on mobile */}
        <div className="hidden md:block md:col-span-1">
          <Card className="bg-teal-50 border-teal-200 sticky top-24">
            <CardHeader>
              <CardTitle className="text-teal-900">Split Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-teal-700 mb-1">Each Person Pays</p>
                <p className="text-3xl font-bold text-teal-900">${perPerson.toFixed(2)}</p>
              </div>
              <div className="border-t border-teal-200 pt-4">
                <p className="text-sm text-teal-700 mb-1">Tip Amount</p>
                <p className="text-2xl font-bold text-teal-900">${tipAmount.toFixed(2)}</p>
              </div>
              <div className="border-t border-teal-200 pt-4">
                <p className="text-sm text-teal-700 mb-1">Total with Tip</p>
                <p className="text-2xl font-bold text-teal-900">${totalWithTip.toFixed(2)}</p>
              </div>
              <div className="border-t border-teal-200 pt-4 text-sm text-teal-700">
                <p>Splitting ${totalWithTip.toFixed(2)} between {numPeople} {parseInt(numPeople) === 1 ? 'person' : 'people'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 md:mt-12 prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Split a Bill Fairly</h2>
        <p className="text-gray-600 mb-4">
          Splitting a bill can be awkward, but our calculator makes it simple. Just enter the total bill,
          add the number of people, and optionally include a tip percentage. Everyone pays their fair share!
        </p>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Bill Splitting Tips</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li>Decide on splitting method before ordering (equal or by item)</li>
          <li>Include tax and tip in the total bill</li>
          <li>Use a payment app to pay the person who has the card</li>
          <li>Round up to make payments easier</li>
          <li>Be transparent about who owes what</li>
        </ul>
        <h3 className="text-xl font-bold text-gray-900 mb-3">When to Use This Calculator</h3>
        <p className="text-gray-600">
          Perfect for restaurant bills, group dinners, vacation expenses, shared groceries, utilities,
          gift purchases, and any situation where costs need to be divided equally among friends or family.
        </p>
      </div>
    </div>
  );
}
