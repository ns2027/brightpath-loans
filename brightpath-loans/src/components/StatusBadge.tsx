const styles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = styles[status] ?? "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}
