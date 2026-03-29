import Link from "next/link";

export default function Home() {
  const features = [
    { icon: "🧾", title: "Invoice Upload",   desc: "Add PDF/manual invoice" },
    { icon: "🔁", title: "Auto Reconcile",   desc: "Match Purchase vs Sales" },
    { icon: "📊", title: "Tax Reports",      desc: "Download ITR-ready report" },
    { icon: "🚨", title: "Compliance Alerts", desc: "Do not miss filing deadlines" },
  ];
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 text-center">
      <div>
        <h1 className="text-5xl font-bold text-green-400 mb-3">GST Automation</h1>
        <p className="text-gray-400 text-lg">Small business CA — absolutely free 🇮🇳</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
        {features.map((f) => (
          <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-3xl mb-2">{f.icon}</div>
            <div className="font-semibold text-sm">{f.title}</div>
            <div className="text-gray-500 text-xs mt-1">{f.desc}</div>
          </div>
        ))}
      </div>
      <Link href="/login"
        className="bg-green-500 px-8 py-3 rounded-xl text-black font-bold text-lg hover:bg-green-400 transition">
        Login & Open Dashboard →
      </Link>
    </div>
  );
}
