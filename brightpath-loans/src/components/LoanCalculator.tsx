"use client";

import { useMemo, useState } from "react";
import { buildAmortizationSchedule, calculateEMI } from "@/lib/emi";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function LoanCalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(11.5);
  const [term, setTerm] = useState(36);
  const [showSchedule, setShowSchedule] = useState(false);

  const emi = useMemo(() => calculateEMI(amount, rate, term), [amount, rate, term]);
  const schedule = useMemo(
    () => (showSchedule ? buildAmortizationSchedule(amount, rate, term) : []),
    [amount, rate, term, showSchedule]
  );

  const totalPayment = emi * term;
  const totalInterest = totalPayment - amount;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-6">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="label">Loan amount</label>
            <span className="text-sm font-semibold text-brand-700">{formatCurrency(amount)}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={5000000}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="input mt-2"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="label">Interest rate (annual %)</label>
            <span className="text-sm font-semibold text-brand-700">{rate.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <input
            type="number"
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value) || 0)}
            className="input mt-2"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="label">Loan term (months)</label>
            <span className="text-sm font-semibold text-brand-700">{term} months</span>
          </div>
          <input
            type="range"
            min={6}
            max={360}
            step={1}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(Number(e.target.value) || 0)}
            className="input mt-2"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="card bg-brand-600 text-white">
          <p className="text-sm text-brand-100">Estimated Monthly Payment</p>
          <p className="mt-1 text-4xl font-bold">{formatCurrency(emi)}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-brand-500 pt-4 text-sm">
            <div>
              <p className="text-brand-100">Total interest</p>
              <p className="font-semibold">{formatCurrency(totalInterest)}</p>
            </div>
            <div>
              <p className="text-brand-100">Total payment</p>
              <p className="font-semibold">{formatCurrency(totalPayment)}</p>
            </div>
          </div>
        </div>

        <button
          className="btn-secondary w-full"
          onClick={() => setShowSchedule((s) => !s)}
        >
          {showSchedule ? "Hide" : "Show"} amortization schedule
        </button>

        {showSchedule && (
          <div className="card max-h-96 overflow-y-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-4 py-2">Month</th>
                  <th className="px-4 py-2">Payment</th>
                  <th className="px-4 py-2">Principal</th>
                  <th className="px-4 py-2">Interest</th>
                  <th className="px-4 py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month} className="border-t border-slate-100">
                    <td className="px-4 py-2">{row.month}</td>
                    <td className="px-4 py-2">{formatCurrency(row.payment)}</td>
                    <td className="px-4 py-2">{formatCurrency(row.principal)}</td>
                    <td className="px-4 py-2">{formatCurrency(row.interest)}</td>
                    <td className="px-4 py-2">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
