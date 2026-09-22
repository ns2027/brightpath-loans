export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

/**
 * Standard EMI (equated monthly installment) formula.
 * P = principal, r = monthly interest rate (decimal), n = number of months
 */
export function calculateEMI(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): number {
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return principal / termMonths;
  const emi =
    (principal * r * Math.pow(1 + r, termMonths)) /
    (Math.pow(1 + r, termMonths) - 1);
  return emi;
}

export function buildAmortizationSchedule(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): AmortizationRow[] {
  const r = annualRatePercent / 100 / 12;
  const emi = calculateEMI(principal, annualRatePercent, termMonths);
  let balance = principal;
  const rows: AmortizationRow[] = [];

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * r;
    let principalPaid = emi - interest;
    if (month === termMonths) {
      // last payment clears remaining balance exactly, avoids rounding drift
      principalPaid = balance;
    }
    balance = Math.max(balance - principalPaid, 0);
    rows.push({
      month,
      payment: month === termMonths ? principalPaid + interest : emi,
      principal: principalPaid,
      interest,
      balance,
    });
  }

  return rows;
}

/**
 * Very simple risk-based rate estimator for the demo application flow.
 * Not a real underwriting model — just enough to produce a plausible rate.
 */
export function estimateInterestRate(params: {
  employmentType: string;
  monthlyIncome: number;
  yearsEmployed: number;
  loanAmount: number;
  loanTermMonths: number;
}): number {
  let rate = 12.5; // base rate

  if (params.employmentType === "SALARIED") rate -= 1.5;
  else if (params.employmentType === "SELF_EMPLOYED") rate -= 0.5;
  else if (params.employmentType === "UNEMPLOYED") rate += 4;

  if (params.yearsEmployed >= 5) rate -= 1;
  else if (params.yearsEmployed >= 2) rate -= 0.5;

  const debtToIncomeProxy =
    params.loanAmount / Math.max(params.monthlyIncome * params.loanTermMonths, 1);
  if (debtToIncomeProxy > 0.6) rate += 2;
  else if (debtToIncomeProxy > 0.35) rate += 1;

  if (params.monthlyIncome >= 150000) rate -= 1;
  else if (params.monthlyIncome >= 75000) rate -= 0.5;

  return Math.min(Math.max(rate, 7.5), 24);
}
