import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/components/AdSense';

type ConversionCategory = 'cooking' | 'weight' | 'distance';

interface ConversionUnit {
  name: string;
  toBase: number; // conversion factor to base unit
}

const conversions: Record<ConversionCategory, { base: string; units: Record<string, ConversionUnit> }> = {
  cooking: {
    base: 'ml',
    units: {
      tsp: { name: 'Teaspoons', toBase: 4.92892 },
      tbsp: { name: 'Tablespoons', toBase: 14.7868 },
      cup: { name: 'Cups', toBase: 236.588 },
      ml: { name: 'Milliliters', toBase: 1 },
      l: { name: 'Liters', toBase: 1000 },
      floz: { name: 'Fluid Ounces', toBase: 29.5735 },
    }
  },
  weight: {
    base: 'g',
    units: {
      oz: { name: 'Ounces', toBase: 28.3495 },
      lb: { name: 'Pounds', toBase: 453.592 },
      g: { name: 'Grams', toBase: 1 },
      kg: { name: 'Kilograms', toBase: 1000 },
    }
  },
  distance: {
    base: 'm',
    units: {
      in: { name: 'Inches', toBase: 0.0254 },
      ft: { name: 'Feet', toBase: 0.3048 },
      yd: { name: 'Yards', toBase: 0.9144 },
      mi: { name: 'Miles', toBase: 1609.34 },
      cm: { name: 'Centimeters', toBase: 0.01 },
      m: { name: 'Meters', toBase: 1 },
      km: { name: 'Kilometers', toBase: 1000 },
    }
  }
};

export function UnitConverter() {
  const [category, setCategory] = useState<ConversionCategory>('cooking');
  const [fromUnit, setFromUnit] = useState('cup');
  const [toUnit, setToUnit] = useState('ml');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  useEffect(() => {
    document.title = 'Unit Converter - Cooking, Weight & Distance | QuickCalc Tools';
  }, []);

  useEffect(() => {
    const value = parseFloat(fromValue);
    if (!isNaN(value) && value !== 0) {
      const fromFactor = conversions[category].units[fromUnit].toBase;
      const toFactor = conversions[category].units[toUnit].toBase;
      const result = (value * fromFactor) / toFactor;
      setToValue(result.toFixed(4));
    } else {
      setToValue('');
    }
  }, [fromValue, fromUnit, toUnit, category]);

  const handleCategoryChange = (newCategory: ConversionCategory) => {
    setCategory(newCategory);
    const units = Object.keys(conversions[newCategory].units);
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setFromValue('');
    setToValue('');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Unit Converter</h1>
        <p className="text-base md:text-lg text-gray-600">Convert cooking, weight, and distance measurements</p>
      </div>

      {/* Mobile Results - Compact summary */}
      {fromValue && toValue && (
        <Card className="md:hidden bg-indigo-50 border-indigo-200 shadow-md mb-4">
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-xs text-indigo-700 mb-0.5">From</p>
                <p className="text-lg font-bold text-indigo-900">{fromValue}</p>
                <p className="text-xs text-indigo-700">{conversions[category].units[fromUnit].name}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-700 mb-0.5">To</p>
                <p className="text-lg font-bold text-indigo-900">{toValue}</p>
                <p className="text-xs text-indigo-700">{conversions[category].units[toUnit].name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Convert Units</CardTitle>
              <CardDescription>Select category and enter values</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div>
                <Label className="text-sm md:text-base">Conversion Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={category === 'cooking' ? 'default' : 'outline'}
                    onClick={() => handleCategoryChange('cooking')}
                    className="h-14 md:h-12 text-base md:text-sm font-bold"
                  >
                    Cooking
                  </Button>
                  <Button
                    variant={category === 'weight' ? 'default' : 'outline'}
                    onClick={() => handleCategoryChange('weight')}
                    className="h-14 md:h-12 text-base md:text-sm font-bold"
                  >
                    Weight
                  </Button>
                  <Button
                    variant={category === 'distance' ? 'default' : 'outline'}
                    onClick={() => handleCategoryChange('distance')}
                    className="h-14 md:h-12 text-base md:text-sm font-bold"
                  >
                    Distance
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromValue" className="text-sm md:text-base">From</Label>
                  <Input
                    id="fromValue"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="1"
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                    className="text-lg mb-2 h-14 md:h-12"
                  />
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="flex h-14 md:h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    {Object.entries(conversions[category].units).map(([key, unit]) => (
                      <option key={key} value={key}>{unit.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="toValue" className="text-sm md:text-base">To</Label>
                  <Input
                    id="toValue"
                    type="text"
                    value={toValue}
                    readOnly
                    className="text-lg mb-2 bg-gray-50 h-14 md:h-12"
                  />
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="flex h-14 md:h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    {Object.entries(conversions[category].units).map(([key, unit]) => (
                      <option key={key} value={key}>{unit.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 hidden md:block">
            <AdPlaceholder label="Unit Converter Ad" />
          </div>
        </div>

        {/* Desktop Results - Hidden on mobile */}
        <div className="hidden md:block md:col-span-1">
          <Card className="bg-indigo-50 border-indigo-200 sticky top-24">
            <CardHeader>
              <CardTitle className="text-indigo-900">Quick Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-indigo-800">
              {category === 'cooking' && (
                <>
                  <p><strong>1 cup =</strong> 16 tbsp</p>
                  <p><strong>1 tbsp =</strong> 3 tsp</p>
                  <p><strong>1 cup =</strong> 8 fl oz</p>
                  <p><strong>1 L =</strong> 4.2 cups</p>
                </>
              )}
              {category === 'weight' && (
                <>
                  <p><strong>1 lb =</strong> 16 oz</p>
                  <p><strong>1 kg =</strong> 2.2 lbs</p>
                  <p><strong>1 oz =</strong> 28.3 g</p>
                </>
              )}
              {category === 'distance' && (
                <>
                  <p><strong>1 ft =</strong> 12 in</p>
                  <p><strong>1 yd =</strong> 3 ft</p>
                  <p><strong>1 mi =</strong> 5280 ft</p>
                  <p><strong>1 m =</strong> 100 cm</p>
                  <p><strong>1 km =</strong> 0.62 mi</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 md:mt-12 prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Unit Conversions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Cooking Conversions</h3>
            <p className="text-gray-600">
              Essential for following recipes from different countries. American recipes use cups and tablespoons,
              while European recipes often use milliliters and liters.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Weight Conversions</h3>
            <p className="text-gray-600">
              Perfect for shipping packages, weighing ingredients, or converting between imperial and metric systems.
              1 kilogram equals 2.2 pounds.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Distance Conversions</h3>
            <p className="text-gray-600">
              Useful for travel, home measurements, and understanding road distances. Remember: 1 mile is about 1.6 kilometers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
