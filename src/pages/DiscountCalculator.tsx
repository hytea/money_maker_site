import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/components/AdSense';

export function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [finalPrice, setFinalPrice] = useState(0);
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    document.title = 'Discount Calculator - Calculate Sale Prices & Savings | QuickCalc Tools';
  }, []);

  useEffect(() => {
    const price = parseFloat(originalPrice) || 0;
    const disc = parseFloat(discount) || 0;

    const saved = price * (disc / 100);
    const final = price - saved;

    setSavings(saved);
    setFinalPrice(final);
  }, [originalPrice, discount]);

  const quickDiscounts = [10, 20, 25, 30, 50, 75];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discount Calculator</h1>
        <p className="text-gray-600">Calculate sale prices and your savings</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sale Information</CardTitle>
              <CardDescription>Enter the original price and discount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  placeholder="100.00"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  step="1"
                  placeholder="20"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="text-lg"
                />
                <div className="flex gap-2 mt-3 flex-wrap">
                  {quickDiscounts.map((percent) => (
                    <Button
                      key={percent}
                      variant={discount === percent.toString() ? 'default' : 'outline'}
                      onClick={() => setDiscount(percent.toString())}
                      className="flex-1 min-w-[60px]"
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <AdPlaceholder label="Discount Calculator Ad" />
          </div>
        </div>

        <div className="md:col-span-1">
          <Card className="bg-purple-50 border-purple-200 sticky top-24">
            <CardHeader>
              <CardTitle className="text-purple-900">Sale Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-purple-700 mb-1">Final Price</p>
                <p className="text-3xl font-bold text-purple-900">${finalPrice.toFixed(2)}</p>
              </div>
              <div className="border-t border-purple-200 pt-4">
                <p className="text-sm text-purple-700 mb-1">You Save</p>
                <p className="text-2xl font-bold text-purple-900">${savings.toFixed(2)}</p>
              </div>
              {originalPrice && discount && (
                <div className="border-t border-purple-200 pt-4">
                  <p className="text-sm text-purple-700">
                    That's {discount}% off the original price of ${parseFloat(originalPrice).toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use the Discount Calculator</h2>
        <p className="text-gray-600 mb-4">
          Shopping for deals? This discount calculator helps you quickly find out how much you'll pay after a
          discount and how much money you're saving. Perfect for Black Friday, Cyber Monday, or any sale!
        </p>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Shopping Tips</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li>Compare final prices across different stores</li>
          <li>Stack coupons and sales for maximum savings</li>
          <li>Calculate if bulk discounts are worth it</li>
          <li>Set a budget and stick to it</li>
        </ul>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Common Sale Events</h3>
        <p className="text-gray-600">
          <strong>Black Friday:</strong> Typically 30-70% off<br />
          <strong>Cyber Monday:</strong> Online deals, 20-50% off<br />
          <strong>End of Season:</strong> 50-75% off clothing<br />
          <strong>Clearance Sales:</strong> Up to 90% off
        </p>
      </div>
    </div>
  );
}
