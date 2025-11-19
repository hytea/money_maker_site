import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AdSense } from '@/components/AdSense';
import { InterstitialAd, useInterstitialAd } from '@/components/InterstitialAd';
import { ResultInsights } from '@/components/ResultInsights';
import { DollarSign, TrendingUp, Calendar, Download, PieChart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToPDF } from '@/lib/pdfExport';

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [amortizationData, setAmortizationData] = useState<any[]>([]);

  const { showInterstitial, triggerInterstitial, dismissInterstitial } = useInterstitialAd();

  useEffect(() => {
    document.title = 'Loan Calculator - Calculate Monthly Payments & Export PDF Report | QuickCalc Tools';
    triggerInterstitial();
  }, []);

  useEffect(() => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseInt(loanTerm) || 0;

    if (principal && rate && years) {
      const monthlyRate = rate / 100 / 12;
      const numberOfPayments = years * 12;

      const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      const total = monthly * numberOfPayments;
      const interest = total - principal;

      setMonthlyPayment(monthly);
      setTotalPayment(total);
      setTotalInterest(interest);

      // Generate amortization schedule for chart (show every 12 months for readability)
      const chartData = [];
      let remainingBalance = principal;

      for (let month = 0; month <= numberOfPayments; month += 12) {
        if (month === 0) {
          chartData.push({
            year: 0,
            principal: 0,
            interest: 0,
            balance: principal,
          });
        } else {
          let yearPrincipal = 0;
          let yearInterest = 0;

          // Calculate payments for this year
          for (let m = month - 11; m <= month && m <= numberOfPayments; m++) {
            const interestPayment = remainingBalance * monthlyRate;
            const principalPayment = monthly - interestPayment;
            yearPrincipal += principalPayment;
            yearInterest += interestPayment;
            remainingBalance -= principalPayment;
          }

          chartData.push({
            year: month / 12,
            principal: yearPrincipal,
            interest: yearInterest,
            balance: Math.max(0, remainingBalance),
          });
        }
      }

      setAmortizationData(chartData);
    } else {
      setMonthlyPayment(0);
      setTotalPayment(0);
      setTotalInterest(0);
      setAmortizationData([]);
    }
  }, [loanAmount, interestRate, loanTerm]);

  // Generate insights based on loan data
  const getInsights = () => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseInt(loanTerm) || 0;

    if (!principal || !rate || !years) return [];

    const insights = [];
    const interestPercentage = (totalInterest / totalPayment) * 100;

    // Interest insights
    if (interestPercentage > 50) {
      insights.push({
        type: 'warning' as const,
        title: 'High Interest Cost',
        description: `You'll pay ${interestPercentage.toFixed(1)}% of your total payment in interest. Consider a shorter loan term or higher down payment to reduce interest costs.`,
      });
    } else if (interestPercentage < 25) {
      insights.push({
        type: 'success' as const,
        title: 'Low Interest Cost',
        description: `Great! Only ${interestPercentage.toFixed(1)}% of your total payment goes to interest. This is an efficient loan structure.`,
      });
    }

    // Rate comparison insights
    if (rate > 7) {
      insights.push({
        type: 'tip' as const,
        title: 'Consider Refinancing',
        description: 'Interest rates above 7% are considered high in the current market. Shop around or improve your credit score for better rates.',
      });
    } else if (rate < 4) {
      insights.push({
        type: 'success' as const,
        title: 'Excellent Interest Rate',
        description: 'You have an excellent interest rate! This could be a good time to lock in this rate for a longer term.',
      });
    }

    // Monthly payment insights
    const monthlyIncome = principal / years / 12 * 3; // Rough estimate
    if (monthlyPayment > monthlyIncome * 0.28) {
      insights.push({
        type: 'warning' as const,
        title: 'Payment-to-Income Ratio',
        description: 'Lenders typically prefer monthly payments below 28% of gross income. Consider a lower loan amount or longer term.',
      });
    }

    // Loan term insights
    if (years >= 30) {
      insights.push({
        type: 'tip' as const,
        title: 'Long-Term Loan',
        description: `A ${years}-year loan means lower monthly payments but significantly more interest. Consider making extra principal payments to save on interest.`,
      });
    } else if (years <= 15) {
      insights.push({
        type: 'success' as const,
        title: 'Fast Payoff',
        description: `A ${years}-year loan will save you thousands in interest compared to a 30-year loan. You'll own your asset sooner!`,
      });
    }

    // Extra payment insight
    const extraPayment100 = Math.floor(
      years * 12 -
      Math.log(1 - ((principal * (rate / 100 / 12)) / (monthlyPayment + 100))) /
      Math.log(1 + (rate / 100 / 12))
    );
    const monthsSaved = years * 12 - extraPayment100;
    if (monthsSaved > 12) {
      insights.push({
        type: 'info' as const,
        title: 'Extra Payment Tip',
        description: `Paying just $100 extra per month could save you ${monthsSaved} months of payments and $${((monthlyPayment + 100) * extraPayment100 - principal).toFixed(0)} in interest!`,
      });
    }

    return insights;
  };

  const handleExportPDF = async () => {
    await exportToPDF({
      fileName: `loan-calculator-report-${new Date().toISOString().split('T')[0]}.pdf`,
      title: 'Loan Calculator Report',
      elementId: 'loan-report',
    });
  };

  const pieData = [
    { name: 'Principal', value: parseFloat(loanAmount) || 0, color: '#3b82f6' },
    { name: 'Interest', value: totalInterest, color: '#ef4444' },
  ];

  const hasResults = monthlyPayment > 0;

  return (
    <>
      <InterstitialAd show={showInterstitial} onDismiss={dismissInterstitial} />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 md:py-8">
        <div className="mb-6 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Loan Calculator</h1>
        <p className="text-base md:text-lg text-gray-600">Calculate monthly payments for loans and mortgages</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {/* Mobile Results - Compact summary */}
        <div className="md:hidden">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-md mb-4">
            <CardContent className="p-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-blue-200">
                  <p className="text-xs font-medium text-gray-600 mb-0.5 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Monthly
                  </p>
                  <p className="text-lg font-bold text-blue-700">${monthlyPayment.toFixed(2)}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-blue-200">
                  <p className="text-xs font-medium text-gray-600 mb-0.5">Total</p>
                  <p className="text-sm font-bold text-gray-900">${totalPayment.toFixed(2)}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-blue-200">
                  <p className="text-xs font-medium text-gray-600 mb-0.5">Interest</p>
                  <p className="text-sm font-bold text-gray-900">${totalInterest.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-br from-blue-50/50 to-white">
              <CardTitle>Loan Details</CardTitle>
              <CardDescription>Enter your loan information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6 pt-4 md:pt-6">
              <div>
                <Label htmlFor="loanAmount" className="text-sm md:text-base font-semibold">Loan Amount ($)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  inputMode="decimal"
                  step="1000"
                  placeholder="200000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="text-lg h-14 md:h-12"
                />
              </div>

              <div>
                <Label htmlFor="interestRate" className="text-sm md:text-base font-semibold">Annual Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  placeholder="4.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="text-lg h-14 md:h-12"
                />
              </div>

              <div>
                <Label htmlFor="loanTerm" className="text-sm md:text-base font-semibold">Loan Term (Years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  placeholder="30"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="text-lg h-14 md:h-12"
                />
              </div>
            </CardContent>
          </Card>

          {/* Hide ad on mobile */}
          <div className="mt-4 md:mt-6 hidden md:block">
            <AdSense slot="4567890123" format="auto" responsive={true} />
          </div>
        </div>

        {/* Desktop Results - Side on desktop */}
        <div className="hidden md:block md:col-span-1">
          <Card className="bg-blue-50 border-blue-200 sticky top-24 border-2">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-blue-700 mb-1 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Monthly Payment
                </p>
                <p className="text-4xl font-bold text-blue-900">${monthlyPayment.toFixed(2)}</p>
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-600 mb-1">Total Payment</p>
                <p className="text-2xl font-bold text-gray-900">${totalPayment.toFixed(2)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-gray-900">${totalInterest.toFixed(2)}</p>
              </div>

              {loanAmount && interestRate && loanTerm && (
                <div className="pt-3 border-t border-blue-200">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    <span>{parseInt(loanTerm) * 12} monthly payments</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comprehensive Results Section with Charts and Insights */}
      {hasResults && (
        <div id="loan-report" className="mt-8 md:mt-12 space-y-6">
          {/* Export PDF Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleExportPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
          </div>

          {/* Payment Breakdown Charts */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-br from-blue-50/50 to-white">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                Visual Payment Breakdown
              </CardTitle>
              <CardDescription>
                See how your payments are distributed over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Pie Chart - Principal vs Interest */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Total Cost Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) =>
                          `${name}: ${((percent || 0) * 100).toFixed(1)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) =>
                          `$${value.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        }
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-sm text-gray-600">Principal</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        ${parseFloat(loanAmount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-sm text-gray-600">Interest</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        ${totalInterest.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bar Chart - Yearly Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Yearly Payment Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={amortizationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="year"
                        label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis
                        label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip
                        formatter={(value: number) =>
                          `$${value.toLocaleString('en-US', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}`
                        }
                      />
                      <Legend />
                      <Bar dataKey="principal" stackId="a" fill="#3b82f6" name="Principal" />
                      <Bar dataKey="interest" stackId="a" fill="#ef4444" name="Interest" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Line Chart - Remaining Balance Over Time */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Loan Balance Over Time
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={amortizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="year"
                      label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        `$${value.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Remaining Balance"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Insights */}
          <ResultInsights insights={getInsights()} />

          {/* Detailed Breakdown */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-br from-green-50/50 to-white">
              <CardTitle>Detailed Payment Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">Loan Summary</h4>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Loan Amount</span>
                    <span className="font-semibold">
                      ${parseFloat(loanAmount).toLocaleString('en-US')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-semibold">{parseFloat(interestRate)}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Loan Term</span>
                    <span className="font-semibold">{parseInt(loanTerm)} years</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Monthly Payments</span>
                    <span className="font-semibold">{parseInt(loanTerm) * 12} payments</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">Cost Analysis</h4>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Monthly Payment</span>
                    <span className="font-semibold text-blue-600">
                      ${monthlyPayment.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Total Principal</span>
                    <span className="font-semibold">
                      ${parseFloat(loanAmount).toLocaleString('en-US')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Total Interest</span>
                    <span className="font-semibold text-red-600">
                      ${totalInterest.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-semibold text-lg">
                      ${totalPayment.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 md:mt-12">
        <Card className="border-2">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">How to Use the Loan Calculator</h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Enter the loan amount you need, the annual interest rate offered, and the loan term in years.
              The calculator will instantly show your monthly payment, total amount paid over the loan lifetime,
              and total interest charges. Perfect for comparing different loan offers and planning your budget.
            </p>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
}
