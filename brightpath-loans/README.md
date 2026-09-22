# BrightPath Loans

A personal loan application website and app, built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma (SQLite), and NextAuth.

## Features

- **Marketing website** — home page, EMI loan calculator with amortization schedule, about, and contact pages.
- **Authentication** — email/password sign up and login (NextAuth credentials provider, bcrypt-hashed passwords).
- **Loan application app** — a multi-step application form (personal info → employment → loan details → review) that estimates an interest rate and monthly payment, then saves the application.
- **Dashboard** — authenticated users can see every application they've submitted and drill into its status and details.
- **Loan calculator** — interactive sliders/inputs for loan amount, rate, and term, with a full month-by-month amortization table.
- **Demo EMI repayment** — once an application's status is `APPROVED`, the detail page shows a "pay this month's EMI" UPI QR code. This is a UI demo only: the UPI ID/payee are hardcoded placeholders, no real payment gateway is integrated, and "paid" is just a local flag stored in the browser — nothing is verified server-side. Do not point this at a real UPI ID or present it as a real payment flow to real users.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM with SQLite
- NextAuth.js (JWT sessions, Credentials provider)
- Zod for validation

## Getting started

```bash
npm install
cp .env.example .env   # then edit NEXTAUTH_SECRET for production use
npx prisma migrate dev --name init
npm run dev
```

Visit http://localhost:3000.

## Project structure

```
prisma/schema.prisma        User + LoanApplication models
src/app/                    Pages (App Router) and API routes
  page.tsx                  Landing page
  calculator/                Loan calculator + amortization schedule
  about/, contact/           Static marketing pages
  login/, register/          Auth pages
  apply/                     Multi-step loan application form
  dashboard/                 Protected application list + detail view
  api/register               Account creation
  api/auth/[...nextauth]     NextAuth handler
  api/applications           Create/list loan applications
src/components/              Navbar, Footer, LoanCalculator, StatusBadge, UpiPaymentDemo
src/lib/                     Prisma client, auth config, EMI math, zod schemas
```

## Notes

- SQLite doesn't support Prisma's native enum type, so `LoanApplication.status` and `employmentType` are plain strings validated with Zod (`src/lib/validations.ts`) instead of Prisma enums.
- This is a demo project for learning/portfolio purposes — it is not a licensed lender and issues no real loans.
