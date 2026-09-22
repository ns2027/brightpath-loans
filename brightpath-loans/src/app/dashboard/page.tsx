import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";

interface LoanApplicationRow {
  id: string;
  loanPurpose: string;
  loanAmount: number;
  loanTermMonths: number;
  status: string;
  createdAt: Date;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const applications = await prisma.loanApplication.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
        <Link href="/apply" className="btn-primary">
          New Application
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="card mt-8 text-center">
          <p className="text-slate-600">You haven&apos;t submitted any applications yet.</p>
          <Link href="/apply" className="btn-primary mt-4 inline-flex">
            Apply for a loan
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {applications.map((app: LoanApplicationRow) => (
            <Link
              key={app.id}
              href={`/dashboard/${app.id}`}
              className="card flex items-center justify-between transition hover:shadow-md"
            >
              <div>
                <p className="font-semibold text-slate-900">{app.loanPurpose}</p>
                <p className="text-sm text-slate-500">
                  {formatCurrency(app.loanAmount)} &middot; {app.loanTermMonths} months &middot;{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={app.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
