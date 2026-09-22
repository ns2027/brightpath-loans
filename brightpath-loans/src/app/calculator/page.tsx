import LoanCalculator from "@/components/LoanCalculator";

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Loan Calculator</h1>
      <p className="mt-2 text-slate-600">
        Adjust the sliders to see your estimated monthly payment and full amortization schedule.
      </p>
      <div className="mt-8">
        <LoanCalculator />
      </div>
    </div>
  );
}
