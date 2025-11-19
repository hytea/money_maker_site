import { useState, useEffect } from 'react';
import { Home, DollarSign, Calendar, Percent, TrendingDown, PiggyBank, FileText, Calculator, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { InterstitialAd, useInterstitialAd } from '@/components/InterstitialAd';
import { ShareButton } from '@/components/ShareButton';
import { CalculationHistory } from '@/components/CalculationHistory';
import { ResultInsights } from '@/components/ResultInsights';
import { useAnalytics } from '@/hooks/useAnalytics';
import { exportToPDF } from '@/lib/pdfExport';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  year: number;
}

export function MortgageCalculator() {
  // Input state
  const [homePrice, setHomePrice] = useState('300000');
  const [downPayment, setDownPayment] = useState('60000');
  const [loanTerm, setLoanTerm] = useState('30');
  const [interestRate, setInterestRate] = useState('6.5');
  const [propertyTax, setPropertyTax] = useState('3000');
  const [homeInsurance, setHomeInsurance] = useState('1200');
  const [hoaFees, setHoaFees] = useState('0');
  const [extraPayment, setExtraPayment] = useState('0');

  // Calculation state
  const [loanAmount, setLoanAmount] = useState(0);
  const [monthlyPI, setMonthlyPI] = useState(0);
  const [monthlyTax, setMonthlyTax] = useState(0);
  const [monthlyInsurance, setMonthlyInsurance] = useState(0);
  const [monthlyHOA, setMonthlyHOA] = useState(0);
  const [monthlyPMI, setMonthlyPMI] = useState(0);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(0);
  const [ltvRatio, setLtvRatio] = useState(0);
  const [payoffDate, setPayoffDate] = useState('');
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationEntry[]>([]);
  const [yearsWithExtra, setYearsWithExtra] = useState(0);
  const [interestSaved, setInterestSaved] = useState(0);

  const { trackCalculatorResult } = useAnalytics();

  const { showInterstitial, triggerInterstitial, dismissInterstitial } = useInterstitialAd();

  useEffect(() => {
    document.title = 'Mortgage Calculator - Calculate Monthly Payments & Total Interest | QuickCalc Tools';
    triggerInterstitial();
  }, []);

  // Calculate mortgage
  useEffect(() => {
    const price = parseFloat(homePrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const term = parseInt(loanTerm) || 30;
    const rate = parseFloat(interestRate) || 0;
    const tax = parseFloat(propertyTax) || 0;
    const insurance = parseFloat(homeInsurance) || 0;
    const hoa = parseFloat(hoaFees) || 0;
    const extra = parseFloat(extraPayment) || 0;

    if (price <= 0 || down < 0 || term <= 0 || rate < 0) {
      return;
    }

    const loan = price - down;
    setLoanAmount(loan);

    const downPercent = (down / price) * 100;
    setDownPaymentPercent(downPercent);

    const ltv = (loan / price) * 100;
    setLtvRatio(ltv);

    // Calculate monthly P&I
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    const monthlyPayment = loan > 0
      ? (loan * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : 0;

    setMonthlyPI(monthlyPayment);

    // Calculate other monthly costs
    const taxMonthly = tax / 12;
    const insuranceMonthly = insurance / 12;
    setMonthlyTax(taxMonthly);
    setMonthlyInsurance(insuranceMonthly);
    setMonthlyHOA(hoa);

    // Calculate PMI (typically 0.5-1% of loan amount annually if down payment < 20%)
    const pmi = downPercent < 20 ? (loan * 0.007) / 12 : 0;
    setMonthlyPMI(pmi);

    // Total monthly payment
    const total = monthlyPayment + taxMonthly + insuranceMonthly + hoa + pmi;
    setTotalMonthly(total);

    // Generate amortization schedule
    const schedule: AmortizationEntry[] = [];
    let balance = loan;
    let totalInt = 0;
    let monthsToPayoff = numPayments;

    for (let i = 1; i <= numPayments && balance > 0; i++) {
      const interestPayment = balance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment + extra;

      if (balance < principalPayment) {
        principalPayment = balance;
      }

      balance -= principalPayment;
      totalInt += interestPayment;

      schedule.push({
        month: i,
        payment: monthlyPayment + extra,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
        year: Math.ceil(i / 12)
      });

      if (balance <= 0) {
        monthsToPayoff = i;
        break;
      }
    }

    setAmortizationSchedule(schedule);
    setTotalInterest(totalInt);
    setTotalCost(loan + totalInt);

    // Calculate payoff date
    const today = new Date();
    const payoff = new Date(today);
    payoff.setMonth(payoff.getMonth() + monthsToPayoff);
    setPayoffDate(payoff.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    // Calculate impact of extra payments
    const yearsToPayoff = monthsToPayoff / 12;
    setYearsWithExtra(term - yearsToPayoff);

    // Calculate interest saved with extra payments
    let balanceNoExtra = loan;
    let totalIntNoExtra = 0;
    for (let i = 1; i <= numPayments; i++) {
      const interestPayment = balanceNoExtra * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balanceNoExtra -= principalPayment;
      totalIntNoExtra += interestPayment;
    }
    setInterestSaved(totalIntNoExtra - totalInt);

    trackCalculatorResult('mortgage-calculator', {
      homePrice: price,
      downPayment: down,
      loanTerm: term,
      interestRate: rate,
      monthlyPayment: total.toFixed(2)
    });
  }, [homePrice, downPayment, loanTerm, interestRate, propertyTax, homeInsurance, hoaFees, extraPayment, trackCalculatorResult]);

  // Quick down payment buttons
  const quickDownPayments = [5, 10, 15, 20, 25];

  const handleQuickDownPayment = (percent: number) => {
    const price = parseFloat(homePrice) || 0;
    const down = (price * percent) / 100;
    setDownPayment(down.toFixed(0));
  };

  // Get insights
  const getInsights = () => {
    const insights = [];

    if (downPaymentPercent < 20) {
      insights.push({
        type: 'warning' as const,
        title: 'PMI Required',
        description: `Your down payment is ${downPaymentPercent.toFixed(1)}%. Consider saving for a 20% down payment to avoid PMI ($${monthlyPMI.toFixed(2)}/month).`
      });
    } else {
      insights.push({
        type: 'success' as const,
        title: 'No PMI Required',
        description: `Great! Your ${downPaymentPercent.toFixed(1)}% down payment means no PMI required.`
      });
    }

    if (ltvRatio > 80) {
      insights.push({
        type: 'info' as const,
        title: 'Loan-to-Value Ratio',
        description: `Your loan-to-value ratio is ${ltvRatio.toFixed(1)}%. Lenders prefer ratios below 80%.`
      });
    }

    const priceToIncomeRatio = totalMonthly / (parseFloat(homePrice) / 12);
    if (priceToIncomeRatio > 0.28) {
      insights.push({
        type: 'tip' as const,
        title: 'Income-to-Housing Ratio',
        description: 'Lenders typically prefer housing costs below 28% of gross monthly income.'
      });
    }

    if (parseFloat(extraPayment) > 0) {
      insights.push({
        type: 'success' as const,
        title: 'Extra Payment Benefits',
        description: `By paying an extra $${parseFloat(extraPayment).toFixed(2)}/month, you'll pay off your mortgage ${yearsWithExtra.toFixed(1)} years early and save $${interestSaved.toFixed(2)} in interest!`
      });
    }

    if (totalInterest > loanAmount) {
      insights.push({
        type: 'info' as const,
        title: 'Total Interest Cost',
        description: `Over ${loanTerm} years, you'll pay $${totalInterest.toFixed(2)} in interest - more than the original loan amount.`
      });
    }

    return insights;
  };

  // Chart data
  const paymentBreakdownData = [
    { name: 'Principal & Interest', value: monthlyPI, color: '#10b981' },
    { name: 'Property Tax', value: monthlyTax, color: '#3b82f6' },
    { name: 'Home Insurance', value: monthlyInsurance, color: '#f59e0b' },
    { name: 'HOA Fees', value: monthlyHOA, color: '#8b5cf6' },
    { name: 'PMI', value: monthlyPMI, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // First year amortization for chart
  const firstYearData = amortizationSchedule.slice(0, 12).map(entry => ({
    month: `Month ${entry.month}`,
    Principal: entry.principal,
    Interest: entry.interest
  }));

  // Yearly summary for long-term chart
  const yearlyData = [];
  for (let year = 1; year <= Math.ceil(amortizationSchedule.length / 12); year++) {
    const yearPayments = amortizationSchedule.filter(e => e.year === year);
    if (yearPayments.length > 0) {
      const totalPrincipal = yearPayments.reduce((sum, e) => sum + e.principal, 0);
      const totalInterest = yearPayments.reduce((sum, e) => sum + e.interest, 0);
      const endBalance = yearPayments[yearPayments.length - 1].balance;

      yearlyData.push({
        year: `Year ${year}`,
        Principal: totalPrincipal,
        Interest: totalInterest,
        Balance: endBalance
      });
    }
  }

  const handleExportPDF = () => {
    exportToPDF({
      fileName: 'mortgage-calculation.pdf',
      title: 'Mortgage Calculation Report',
      elementId: 'mortgage-results'
    });
  };

  return (
    <>
      <InterstitialAd show={showInterstitial} onDismiss={dismissInterstitial} />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 md:py-12">
      {/* Header */}
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
            <Home className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Mortgage Calculator
          </h1>
        </div>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto md:mx-0">
          Calculate your monthly mortgage payment and see the full cost breakdown.
          Compare different scenarios to find the best option for your home purchase.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {/* Mobile Results - shown at top on mobile */}
        <div className="md:hidden">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-600" />
                Monthly Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <div className="text-3xl font-bold text-green-600">
                  ${totalMonthly.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Monthly Payment</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-600">P&I</div>
                  <div className="font-semibold">${monthlyPI.toFixed(2)}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-600">Loan Amount</div>
                  <div className="font-semibold">${loanAmount.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Input Section */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-green-600" />
                Home Details
              </CardTitle>
              <CardDescription>Enter your home purchase information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homePrice" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    Home Price
                  </Label>
                  <Input
                    id="homePrice"
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(e.target.value)}
                    placeholder="300000"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="downPayment" className="flex items-center gap-2">
                    <PiggyBank className="w-4 h-4 text-gray-500" />
                    Down Payment ($)
                  </Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    placeholder="60000"
                    className="text-lg"
                  />
                  <div className="text-sm text-gray-600">
                    {downPaymentPercent.toFixed(1)}% down
                  </div>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Quick Down Payment</Label>
                <div className="flex flex-wrap gap-2">
                  {quickDownPayments.map((percent) => (
                    <Button
                      key={percent}
                      variant={Math.abs(downPaymentPercent - percent) < 0.5 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleQuickDownPayment(percent)}
                      className="flex-1 min-w-[60px]"
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanTerm" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Loan Term (years)
                  </Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    placeholder="30"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant={loanTerm === '15' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLoanTerm('15')}
                      className="flex-1"
                    >
                      15 years
                    </Button>
                    <Button
                      variant={loanTerm === '30' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLoanTerm('30')}
                      className="flex-1"
                    >
                      30 years
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate" className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-gray-500" />
                    Interest Rate (%)
                  </Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="6.5"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Monthly Costs</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyTax" className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      Annual Property Tax
                    </Label>
                    <Input
                      id="propertyTax"
                      type="number"
                      value={propertyTax}
                      onChange={(e) => setPropertyTax(e.target.value)}
                      placeholder="3000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homeInsurance" className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      Annual Home Insurance
                    </Label>
                    <Input
                      id="homeInsurance"
                      type="number"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(e.target.value)}
                      placeholder="1200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hoaFees">Monthly HOA Fees</Label>
                    <Input
                      id="hoaFees"
                      type="number"
                      value={hoaFees}
                      onChange={(e) => setHoaFees(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extraPayment" className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-gray-500" />
                      Extra Monthly Payment
                    </Label>
                    <Input
                      id="extraPayment"
                      type="number"
                      value={extraPayment}
                      onChange={(e) => setExtraPayment(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts - Desktop Only */}
          <div className="hidden md:block space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Breakdown</CardTitle>
                <CardDescription>See how your monthly payment is distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => name && percent ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>First Year: Principal vs Interest</CardTitle>
                <CardDescription>Monthly breakdown for the first 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={firstYearData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="Principal" stackId="a" fill="#10b981" />
                    <Bar dataKey="Interest" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {yearlyData.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Loan Balance Over Time</CardTitle>
                  <CardDescription>See how your principal decreases over the years</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `$${value.toFixed(0)}`} />
                      <Legend />
                      <Line type="monotone" dataKey="Balance" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Desktop Results Sidebar */}
        <div className="hidden md:block md:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card id="mortgage-results">
              <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Calculator className="w-5 h-5" />
                  Your Monthly Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center py-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg shadow-lg">
                  <div className="text-4xl font-bold">
                    ${totalMonthly.toFixed(2)}
                  </div>
                  <div className="text-sm mt-1 opacity-90">Total Monthly Payment</div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Principal & Interest</span>
                    <span className="font-semibold">${monthlyPI.toFixed(2)}</span>
                  </div>

                  {monthlyTax > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Property Tax</span>
                      <span className="font-semibold">${monthlyTax.toFixed(2)}</span>
                    </div>
                  )}

                  {monthlyInsurance > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Home Insurance</span>
                      <span className="font-semibold">${monthlyInsurance.toFixed(2)}</span>
                    </div>
                  )}

                  {monthlyHOA > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">HOA Fees</span>
                      <span className="font-semibold">${monthlyHOA.toFixed(2)}</span>
                    </div>
                  )}

                  {monthlyPMI > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">PMI</span>
                      <span className="font-semibold text-orange-600">${monthlyPMI.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Loan Summary</h4>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Loan Amount</span>
                    <span className="font-semibold">${loanAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Down Payment</span>
                    <span className="font-semibold">${parseFloat(downPayment).toLocaleString()} ({downPaymentPercent.toFixed(1)}%)</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Interest</span>
                    <span className="font-semibold text-red-600">${totalInterest.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Cost</span>
                    <span className="font-semibold">${totalCost.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Payoff Date</span>
                    <span className="font-semibold">{payoffDate}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">LTV Ratio</span>
                    <span className={`font-semibold ${ltvRatio > 80 ? 'text-orange-600' : 'text-green-600'}`}>
                      {ltvRatio.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    onClick={handleExportPDF}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Export PDF
                  </Button>
                  <ShareButton
                    calculatorType="mortgage-calculator"
                    title="My Mortgage Calculation"
                    description={`$${totalMonthly.toFixed(2)}/month for a $${loanAmount.toLocaleString()} mortgage`}
                    inputs={{ homePrice, downPayment, loanTerm, interestRate }}
                    results={{ monthlyPayment: totalMonthly, totalInterest, loanAmount }}
                  />
                </div>
              </CardContent>
            </Card>

            <ResultInsights insights={getInsights()} />

            <CalculationHistory calculatorType="mortgage-calculator" />

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2 text-base">
                  <Info className="w-4 h-4" />
                  Quick Tip
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800">
                <p>
                  A 20% down payment helps you avoid PMI and typically gets you better interest rates.
                  Even small extra payments can save thousands in interest over the life of your loan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Full Results & Information Section */}
      <div className="mt-6 md:mt-8 space-y-4">
        {/* Mobile Charts */}
        <div className="md:hidden space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={paymentBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => name && percent ? `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%` : ''}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <ResultInsights insights={getInsights()} />
        </div>

        {/* Amortization Schedule */}
        {amortizationSchedule.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Amortization Schedule - First Year</CardTitle>
              <CardDescription>See how each payment breaks down between principal and interest</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Month</th>
                      <th className="text-right p-2">Payment</th>
                      <th className="text-right p-2">Principal</th>
                      <th className="text-right p-2">Interest</th>
                      <th className="text-right p-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationSchedule.slice(0, 12).map((entry) => (
                      <tr key={entry.month} className="border-b hover:bg-gray-50">
                        <td className="p-2">{entry.month}</td>
                        <td className="text-right p-2">${entry.payment.toFixed(2)}</td>
                        <td className="text-right p-2 text-green-600">${entry.principal.toFixed(2)}</td>
                        <td className="text-right p-2 text-red-600">${entry.interest.toFixed(2)}</td>
                        <td className="text-right p-2 font-semibold">${entry.balance.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {amortizationSchedule.length > 12 && (
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Showing first 12 months of {amortizationSchedule.length} total payments
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Understanding Your Mortgage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Home className="w-4 h-4 text-green-600" />
                What's Included in Your Monthly Payment?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Principal & Interest (P&I):</strong> The main loan payment that pays down your mortgage over time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Property Taxes:</strong> Annual taxes divided into monthly payments, held in escrow</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span><strong>Home Insurance:</strong> Required coverage to protect your investment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span><strong>PMI (Private Mortgage Insurance):</strong> Required if down payment is less than 20%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span><strong>HOA Fees:</strong> Homeowners association fees for community amenities and maintenance</span>
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-green-600" />
                Down Payment Recommendations
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>20% or more:</strong> Avoid PMI, better rates, lower monthly payments</li>
                <li><strong>10-19%:</strong> Conventional loans available, but PMI required</li>
                <li><strong>3-9%:</strong> FHA loans available for first-time buyers</li>
                <li><strong>VA/USDA:</strong> 0% down options for qualified veterans and rural properties</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-600" />
                Ways to Save Money
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Make extra payments:</strong> Even $100/month can save thousands in interest</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Choose a shorter term:</strong> 15-year mortgages have lower rates but higher monthly payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Shop for better rates:</strong> Even 0.25% difference can save thousands over 30 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Improve your credit score:</strong> Better credit = better rates</span>
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                Mortgage Types
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Fixed-Rate:</strong> Interest rate stays the same for the entire loan term (most common)</li>
                <li><strong>ARM (Adjustable-Rate):</strong> Lower initial rate that adjusts after a set period</li>
                <li><strong>FHA:</strong> Government-backed loans with lower down payment requirements</li>
                <li><strong>VA:</strong> 0% down loans for qualified veterans</li>
                <li><strong>USDA:</strong> 0% down loans for rural properties</li>
                <li><strong>Jumbo:</strong> Loans above conforming loan limits (higher amounts)</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Important Terms</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>LTV (Loan-to-Value) Ratio:</strong> Loan amount divided by home value. Lower is better.</li>
                <li><strong>APR:</strong> Annual Percentage Rate includes interest rate plus fees</li>
                <li><strong>Escrow:</strong> Account where lender holds money for taxes and insurance</li>
                <li><strong>Amortization:</strong> How your loan balance decreases over time</li>
                <li><strong>Closing Costs:</strong> Fees due at closing, typically 2-5% of loan amount</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card className="bg-gradient-to-br from-gray-50 to-white">
          <CardHeader>
            <CardTitle className="text-lg">Related Calculators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              <a href="/loan-calculator" className="flex items-center gap-3 p-3 rounded-lg border hover:border-green-300 hover:bg-green-50 transition-colors">
                <Calculator className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-semibold text-sm">Loan Calculator</div>
                  <div className="text-xs text-gray-600">Calculate any type of loan</div>
                </div>
              </a>
              <a href="/discount-calculator" className="flex items-center gap-3 p-3 rounded-lg border hover:border-red-300 hover:bg-red-50 transition-colors">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-semibold text-sm">Discount Calculator</div>
                  <div className="text-xs text-gray-600">Calculate sale prices & savings</div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
}
