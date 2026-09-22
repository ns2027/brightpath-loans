"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { calculateEMI, estimateInterestRate } from "@/lib/emi";

const STEPS = ["Personal Info", "Employment", "Loan Details", "Review"];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  employmentType: "SALARIED" | "SELF_EMPLOYED" | "UNEMPLOYED";
  employerName: string;
  monthlyIncome: string;
  yearsEmployed: string;
  loanAmount: string;
  loanPurpose: string;
  loanTermMonths: string;
}

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  employmentType: "SALARIED",
  employerName: "",
  monthlyIncome: "",
  yearsEmployed: "",
  loanAmount: "",
  loanPurpose: "",
  loanTermMonths: "36",
};

export default function ApplyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateStep(): string | null {
    if (step === 0) {
      if (!form.fullName || !form.email || !form.phone || !form.dateOfBirth || !form.address) {
        return "Please fill in all personal info fields.";
      }
    }
    if (step === 1) {
      if (!form.monthlyIncome || Number(form.monthlyIncome) <= 0) {
        return "Enter a valid monthly income.";
      }
      if (form.yearsEmployed === "" || Number(form.yearsEmployed) < 0) {
        return "Enter valid years employed.";
      }
    }
    if (step === 2) {
      if (!form.loanAmount || Number(form.loanAmount) <= 0) {
        return "Enter a valid loan amount.";
      }
      if (!form.loanPurpose) {
        return "Enter a loan purpose.";
      }
      if (!form.loanTermMonths || Number(form.loanTermMonths) < 6) {
        return "Loan term must be at least 6 months.";
      }
    }
    return null;
  }

  function handleNext() {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  const previewRate =
    form.monthlyIncome && form.loanAmount && form.loanTermMonths
      ? estimateInterestRate({
          employmentType: form.employmentType,
          monthlyIncome: Number(form.monthlyIncome),
          yearsEmployed: Number(form.yearsEmployed) || 0,
          loanAmount: Number(form.loanAmount),
          loanTermMonths: Number(form.loanTermMonths),
        })
      : null;

  const previewEmi =
    previewRate !== null
      ? calculateEMI(Number(form.loanAmount), previewRate, Number(form.loanTermMonths))
      : null;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          monthlyIncome: Number(form.monthlyIncome),
          yearsEmployed: Number(form.yearsEmployed),
          loanAmount: Number(form.loanAmount),
          loanTermMonths: Number(form.loanTermMonths),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }

      router.push(`/dashboard/${data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return <div className="mx-auto max-w-2xl px-4 py-12 text-center text-slate-500">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Log in to apply</h1>
        <p className="mt-2 text-slate-600">You need an account to submit a loan application.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/login" className="btn-primary">Log in</Link>
          <Link href="/register" className="btn-secondary">Sign up</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Loan Application</h1>

      <div className="mt-6 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                i <= step ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 ${i < step ? "bg-brand-600" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-600">{STEPS[step]}</p>

      <div className="card mt-6 space-y-4">
        {step === 0 && (
          <>
            <div>
              <label className="label">Full name</label>
              <input className="input" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div>
              <label className="label">Date of birth</label>
              <input type="date" className="input" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
            </div>
            <div>
              <label className="label">Address</label>
              <textarea className="input" rows={2} value={form.address} onChange={(e) => update("address", e.target.value)} />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <label className="label">Employment type</label>
              <select
                className="input"
                value={form.employmentType}
                onChange={(e) => update("employmentType", e.target.value as FormState["employmentType"])}
              >
                <option value="SALARIED">Salaried</option>
                <option value="SELF_EMPLOYED">Self-employed</option>
                <option value="UNEMPLOYED">Unemployed</option>
              </select>
            </div>
            {form.employmentType !== "UNEMPLOYED" && (
              <div>
                <label className="label">Employer name</label>
                <input className="input" value={form.employerName} onChange={(e) => update("employerName", e.target.value)} />
              </div>
            )}
            <div>
              <label className="label">Monthly income</label>
              <input type="number" className="input" value={form.monthlyIncome} onChange={(e) => update("monthlyIncome", e.target.value)} />
            </div>
            <div>
              <label className="label">Years employed</label>
              <input type="number" step="0.5" className="input" value={form.yearsEmployed} onChange={(e) => update("yearsEmployed", e.target.value)} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="label">Loan amount</label>
              <input type="number" className="input" value={form.loanAmount} onChange={(e) => update("loanAmount", e.target.value)} />
            </div>
            <div>
              <label className="label">Loan purpose</label>
              <input className="input" value={form.loanPurpose} onChange={(e) => update("loanPurpose", e.target.value)} />
            </div>
            <div>
              <label className="label">Loan term (months)</label>
              <input type="number" className="input" value={form.loanTermMonths} onChange={(e) => update("loanTermMonths", e.target.value)} />
            </div>

            {previewRate !== null && previewEmi !== null && (
              <div className="rounded-lg bg-brand-50 p-4 text-sm">
                <p className="text-slate-600">Estimated rate: <span className="font-semibold text-brand-700">{previewRate.toFixed(2)}%</span></p>
                <p className="text-slate-600">Estimated monthly payment: <span className="font-semibold text-brand-700">₹{previewEmi.toFixed(2)}</span></p>
              </div>
            )}
          </>
        )}

        {step === 3 && (
          <div className="space-y-3 text-sm">
            <ReviewRow label="Full name" value={form.fullName} />
            <ReviewRow label="Email" value={form.email} />
            <ReviewRow label="Phone" value={form.phone} />
            <ReviewRow label="Date of birth" value={form.dateOfBirth} />
            <ReviewRow label="Address" value={form.address} />
            <ReviewRow label="Employment type" value={form.employmentType.replace("_", " ")} />
            <ReviewRow label="Employer" value={form.employerName || "—"} />
            <ReviewRow label="Monthly income" value={`₹${form.monthlyIncome}`} />
            <ReviewRow label="Years employed" value={form.yearsEmployed} />
            <ReviewRow label="Loan amount" value={`₹${form.loanAmount}`} />
            <ReviewRow label="Purpose" value={form.loanPurpose} />
            <ReviewRow label="Term" value={`${form.loanTermMonths} months`} />
            {previewRate !== null && previewEmi !== null && (
              <div className="rounded-lg bg-brand-50 p-4">
                <ReviewRow label="Estimated rate" value={`${previewRate.toFixed(2)}%`} />
                <ReviewRow label="Estimated monthly payment" value={`₹${previewEmi.toFixed(2)}`} />
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-between pt-4">
          <button className="btn-secondary" onClick={handleBack} disabled={step === 0}>
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit application"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
