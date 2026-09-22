import Link from "next/link";

const features = [
  {
    title: "Fast estimates",
    desc: "Get an instant interest rate and monthly payment estimate before you ever submit an application.",
  },
  {
    title: "Transparent terms",
    desc: "Full amortization schedule up front — see exactly how every payment is split between principal and interest.",
  },
  {
    title: "Track your application",
    desc: "A dashboard for every application you've submitted, with live status updates.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Personal loans made <span className="text-brand-600">simple</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Estimate your rate, apply online in minutes, and track your application from
            submission to approval — all in one place.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/apply" className="btn-primary">
              Apply Now
            </Link>
            <Link href="/calculator" className="btn-secondary">
              Try the Calculator
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card">
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-600">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to get started?</h2>
          <p className="mt-2 text-brand-100">
            Create an account and submit your first application in under five minutes.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-medium text-brand-700 hover:bg-brand-50"
          >
            Create free account
          </Link>
        </div>
      </section>
    </div>
  );
}
