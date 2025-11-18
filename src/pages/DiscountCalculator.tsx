import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/components/AdSense';
import { Percent, DollarSign, Tag } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 md:py-8">
      <div className="mb-6 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Discount Calculator</h1>
        <p className="text-base md:text-lg text-gray-600">Calculate sale prices and your savings</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {/* Mobile Results - Top on mobile */}
        <div className="md:hidden">
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-purple-50 sticky top-20 z-10 shadow-lg">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-purple-200">
                  <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Final Price
                  </p>
                  <p className="text-3xl font-bold text-purple-700">${finalPrice.toFixed(2)}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-purple-200">
                  <p className="text-xs font-medium text-gray-600 mb-1">You Save</p>
                  <p className="text-2xl font-bold text-emerald-600">${savings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-br from-purple-50/50 to-white">
              <CardTitle>Sale Information</CardTitle>
              <CardDescription>Enter the original price and discount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6 pt-4 md:pt-6">
              <div>
                <Label htmlFor="originalPrice" className="text-sm md:text-base font-semibold">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="100.00"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="text-lg h-14 md:h-12"
                />
              </div>

              <div>
                <Label htmlFor="discount" className="text-sm md:text-base font-semibold">Discount (%)</Label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {quickDiscounts.map((percent) => (
                    <Button
                      key={percent}
                      variant={discount === percent.toString() ? 'default' : 'outline'}
                      onClick={() => setDiscount(percent.toString())}
                      className="h-14 md:h-12 text-base md:text-sm font-bold"
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
                <Input
                  id="discount"
                  type="number"
                  inputMode="numeric"
                  step="1"
                  placeholder="Custom %"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="text-lg h-14 md:h-12"
                />
              </div>
            </CardContent>
          </Card>

          {/* Hide ad on mobile */}
          <div className="mt-4 md:mt-6 hidden md:block">
            <AdPlaceholder label="Discount Calculator Ad" />
          </div>
        </div>

        {/* Desktop Results */}
        <div className="hidden md:block md:col-span-1">
          <Card className="bg-purple-50 border-purple-200 sticky top-24 border-2">
            <CardHeader>
              <CardTitle className="text-purple-900 flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Sale Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-purple-700 mb-1 flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  Final Price
                </p>
                <p className="text-4xl font-bold text-purple-900">${finalPrice.toFixed(2)}</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                <p className="text-sm text-emerald-700 mb-1 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  You Save
                </p>
                <p className="text-3xl font-bold text-emerald-700">${savings.toFixed(2)}</p>
              </div>

              {originalPrice && discount && (
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">{discount}% off</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 md:mt-12">
        <Card className="border-2">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">How to Use the Discount Calculator</h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Enter the original price of the item and the discount percentage. The calculator will show you
              the final price you'll pay and how much money you're saving. Use the quick buttons for common
              discount percentages, or enter a custom percentage for exact calculations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
