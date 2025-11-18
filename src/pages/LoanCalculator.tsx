import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdPlaceholder } from '@/components/AdSense';

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Calculator</h1>
        <p className="text-gray-600">Calculate monthly payments for loans and mortgages</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
              <CardDescription>Enter your loan information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  step="1000"
                  placeholder="200000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div>
                <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  placeholder="4.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div>
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  min="1"
                  placeholder="30"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="text-lg"
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <AdPlaceholder label="Loan Calculator Ad" />
          </div>
        </div>

        <div className="md:col-span-1">
          <Card className="bg-blue-50 border-blue-200 sticky top-24">
            <CardHeader>
              <CardTitle className="text-blue-900">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-blue-700 mb-1">Monthly Payment</p>
                <p className="text-3xl font-bold text-blue-900">
                  ${isFinite(monthlyPayment) ? monthlyPayment.toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="border-t border-blue-200 pt-4">
                <p className="text-sm text-blue-700 mb-1">Total Payment</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${isFinite(totalPayment) ? totalPayment.toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="border-t border-blue-200 pt-4">
                <p className="text-sm text-blue-700 mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${isFinite(totalInterest) ? totalInterest.toFixed(2) : '0.00'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About Loan Calculations</h2>
        <p className="text-gray-600 mb-4">
          This loan calculator helps you estimate monthly payments for mortgages, car loans, personal loans,
          and student loans. Enter the loan amount, annual interest rate, and loan term to see your monthly
          payment and total interest.
        </p>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Understanding Your Loan</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li><strong>Monthly Payment:</strong> The amount you'll pay each month</li>
          <li><strong>Total Payment:</strong> Total amount paid over the life of the loan</li>
          <li><strong>Total Interest:</strong> How much extra you'll pay in interest</li>
          <li><strong>Principal:</strong> The original loan amount you borrowed</li>
        </ul>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Common Loan Types</h3>
        <p className="text-gray-600 mb-2">
          <strong>Mortgages:</strong> Typically 15 or 30 years with interest rates from 3-7%
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Auto Loans:</strong> Usually 3-6 years with rates from 4-10%
        </p>
        <p className="text-gray-600">
          <strong>Personal Loans:</strong> Often 2-5 years with rates from 6-15%
        </p>
      </div>
    </div>
  );
}
