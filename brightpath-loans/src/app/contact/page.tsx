export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Contact us</h1>
      <p className="mt-4 text-slate-600">
        This is a demo site, so there&apos;s no live support desk — but in a real product this
        page would host a contact form or support details.
      </p>
      <div className="mt-8 card">
        <p className="text-sm text-slate-500">Email</p>
        <p className="font-medium text-slate-900">hello@brightpathloans.example</p>
        <p className="mt-4 text-sm text-slate-500">Phone</p>
        <p className="font-medium text-slate-900">+1 (555) 010-0100</p>
      </div>
    </div>
  );
}
