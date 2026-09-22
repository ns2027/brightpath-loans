export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} BrightPath Loans. Demo project for learning/portfolio purposes only — not a licensed lender.</p>
      </div>
    </footer>
  );
}
