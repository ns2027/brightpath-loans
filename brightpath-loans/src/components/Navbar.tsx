"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/", label: "Home" },
  { href: "/calculator", label: "Calculator" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-brand-700">
          <span className="inline-block h-6 w-6 rounded bg-brand-600" />
          BrightPath Loans
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-600 hover:text-brand-700">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-brand-700">
                Dashboard
              </Link>
              <Link href="/apply" className="btn-primary text-sm">
                Apply Now
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-slate-500 hover:text-slate-800"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-brand-700">
                Log in
              </Link>
              <Link href="/apply" className="btn-primary text-sm">
                Apply Now
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-600" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            {status === "authenticated" ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-slate-600" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/apply" className="btn-primary text-sm w-fit" onClick={() => setOpen(false)}>
                  Apply Now
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-left text-sm font-medium text-slate-500"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link href="/apply" className="btn-primary text-sm w-fit" onClick={() => setOpen(false)}>
                  Apply Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
