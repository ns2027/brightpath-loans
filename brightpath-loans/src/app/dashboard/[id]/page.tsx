import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";
import UpiPaymentDemo from "@/components/UpiPaymentDemo";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const application = await prisma.loanApplication.findUnique({
    where: { id: params.id },
  });

  if (!application || application.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/dashboard" className="text-sm text-brand-600 hover:underline">
        &larr; Back to dashboard
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">{application.loanPurpose}</h1>
        <StatusBadge status={application.status} />
      </div>

      <div className="card mt-6 grid gap-4 sm:grid-cols-2">
        <Detail label="Loan amount" value={formatCurrency(application.loanAmount)} />
        <Detail label="Term" value={`${application.loanTermMonths} months`} />
        <Detail label="Interest rate" value={`${application.interestRate.toFixed(2)}%`} />
        <Detail label="Monthly payment" value={formatCurrency(application.monthlyPayment)} />
        <Detail label="Employment type" value={application.employmentType.replace("_", " ")} />
        <Detail label="Employer" value={application.employerName || "—"} />
        <Detail label="Monthly income" value={formatCurrency(application.monthlyIncome)} />
        <Detail label="Years employed" value={String(application.yearsEmployed)} />
        <Detail label="Submitted" value={new Date(application.createdAt).toLocaleDateString()} />
      </div>

      <div className="card mt-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Applicant details</h2>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <Detail label="Full name" value={application.fullName} />
          <Detail label="Email" value={application.email} />
          <Detail label="Phone" value={application.phone} />
          <Detail label="Date of birth" value={new Date(application.dateOfBirth).toLocaleDateString()} />
          <Detail label="Address" value={application.address} />
        </div>
      </div>

      {application.status === "APPROVED" && (
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Pay this month&apos;s EMI</h2>
          <UpiPaymentDemo applicationId={application.id} amount={application.monthlyPayment} />
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="font-medium text-slate-900">{value}</p>
    </div>
  );
}
