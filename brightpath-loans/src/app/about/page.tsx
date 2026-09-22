export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">About BrightPath Loans</h1>
      <p className="mt-4 text-slate-600">
        BrightPath Loans is a demo personal-loan application built to showcase a full loan
        origination flow: rate estimation, a multi-step application, and application tracking.
      </p>
      <p className="mt-4 text-slate-600">
        This is a portfolio / learning project. It is not a licensed lender, issues no real
        loans, and the payment demo on approved applications does not move real money.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-slate-900">Tech stack</h2>
      <ul className="mt-3 list-disc space-y-1 pl-6 text-slate-600">
        <li>Next.js 14 (App Router) + TypeScript</li>
        <li>Tailwind CSS</li>
        <li>Prisma ORM with SQLite</li>
        <li>NextAuth.js (JWT sessions, Credentials provider)</li>
        <li>Zod for validation</li>
      </ul>
    </div>
  );
}
