import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdPlaceholder } from '@/components/AdSense';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    document.title = 'Loan Calculator - Calculate Monthly Payments | QuickCalc Tools';
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
    } else {
      setMonthlyPayment(0);
      setTotalPayment(0);
      setTotalInterest(0);
    }
  }, [loanAmount, interestRate, loanTerm]);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 md:py-8">
      <div className="mb-6 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Loan Calculator</h1>
        <p className="text-base md:text-lg text-gray-600">Calculate monthly payments for loans and mortgages</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {/* Mobile Results - Top on mobile */}
        <div className="md:hidden">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-50 sticky top-20 z-10 shadow-lg">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Monthly Payment
                  </p>
                  <p className="text-3xl font-bold text-blue-700">${monthlyPayment.toFixed(2)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-200">
                    <p className="text-xs font-medium text-gray-600 mb-1">Total Payment</p>
                    <p className="text-lg font-bold text-gray-900">${totalPayment.toFixed(2)}</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-200">
                    <p className="text-xs font-medium text-gray-600 mb-1">Total Interest</p>
                    <p className="text-lg font-bold text-gray-900">${totalInterest.toFixed(2)}</p>
                  </div>
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
            <AdPlaceholder label="Loan Calculator Ad" />
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
  );
}
