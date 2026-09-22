"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

// Demo-only placeholders. Not a real UPI ID, no payment gateway is integrated.
const DEMO_UPI_ID = "demo-brightpath@upi";
const DEMO_PAYEE_NAME = "BrightPath Loans (Demo)";

export default function UpiPaymentDemo({
  applicationId,
  amount,
}: {
  applicationId: string;
  amount: number;
}) {
  const storageKey = `brightpath-emi-paid-${applicationId}`;
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setPaid(localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  const upiUri = `upi://pay?pa=${encodeURIComponent(DEMO_UPI_ID)}&pn=${encodeURIComponent(
    DEMO_PAYEE_NAME
  )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent("EMI - " + applicationId)}`;

  function markPaid() {
    localStorage.setItem(storageKey, "true");
    setPaid(true);
  }

  return (
    <div className="card">
      <p className="mb-1 text-sm font-semibold text-amber-700">Demo only — not a real payment</p>
      <p className="mb-4 text-xs text-slate-500">
        This UPI QR code is a UI demonstration. The UPI ID and payee shown are hardcoded
        placeholders, no payment gateway is connected, and marking this as &quot;paid&quot; only
        sets a flag in your browser — nothing is verified or recorded on the server.
      </p>

      {paid ? (
        <div className="rounded-lg bg-emerald-50 p-4 text-emerald-800">
          This month&apos;s EMI is marked as paid (locally, in this browser only).
          <button
            className="ml-2 text-xs underline"
            onClick={() => {
              localStorage.removeItem(storageKey);
              setPaid(false);
            }}
          >
            Reset
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <QRCodeSVG value={upiUri} size={180} />
          </div>
          <p className="text-sm text-slate-600">
            Scan to pay <span className="font-semibold">₹{amount.toFixed(2)}</span> to{" "}
            {DEMO_UPI_ID} (demo)
          </p>
          <button className="btn-primary" onClick={markPaid}>
            Mark this month&apos;s EMI as paid (demo)
          </button>
        </div>
      )}
    </div>
  );
}
