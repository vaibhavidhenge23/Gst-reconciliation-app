"use client";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ShoppingCart } from "lucide-react";

function StatCard({ title, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{title}</span>
        <Icon size={20} className={color} />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-gray-500 text-xs mt-1">{sub}</div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic Auth Check
    if (!localStorage.getItem("isAuthenticated")) {
      window.location.href = "/login";
      return;
    }

    async function load() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) setData(await res.json());
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-gray-400 text-sm">Loading dashboard...</div>;
  if (!data) return <div className="text-gray-500 text-sm">Failed to load dashboard data.</div>;

  const fmt = (n) => `₹${(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const stats = [
    { title: "Sales GST (Output)",    value: fmt(data.totalSalesGST),    sub: `${data.totalSales} sales this month`,    icon: TrendingUp,    color: "text-green-400" },
    { title: "Purchase GST (ITC)",    value: fmt(data.totalPurchaseGST), sub: `${data.totalPurchases} purchases this month`, icon: TrendingDown, color: "text-blue-400" },
    { title: "GST Payable",           value: fmt(data.gstPayable),       sub: data.itcAvailable > 0 ? `ITC: ${fmt(data.itcAvailable)}` : "Net payable", icon: AlertTriangle, color: "text-yellow-400" },
    { title: "Reconciled",            value: `${data.reconciledPct}%`,   sub: "Matched invoices",   icon: CheckCircle, color: "text-green-400" },
  ];

  const badge = (s) =>
    s === "reconciled" ? "bg-green-900 text-green-400" :
    s === "pending"    ? "bg-yellow-900 text-yellow-400" : "bg-gray-800 text-gray-400";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchases */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart size={18} className="text-blue-400" /> Recent Purchases
          </h3>
          {(!data.recentPurchases || data.recentPurchases.length === 0) ? (
            <p className="text-gray-500 text-sm">No purchase invoices yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="text-left py-2">Invoice #</th>
                  <th className="text-left py-2">Vendor</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">GST</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPurchases.map((r) => (
                  <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3">{r.invoiceNumber}</td>
                    <td className="py-3">{r.vendorName}</td>
                    <td className="py-3">₹{r.amount.toLocaleString()}</td>
                    <td className="py-3">₹{r.gstAmount.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${badge(r.status)}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Sales */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-400" /> Recent Sales
          </h3>
          {(!data.recentSales || data.recentSales.length === 0) ? (
            <p className="text-gray-500 text-sm">No sales invoices yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="text-left py-2">Invoice #</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">GST</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentSales.map((r) => (
                  <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3">{r.invoiceNumber}</td>
                    <td className="py-3">{r.customerName}</td>
                    <td className="py-3">₹{r.amount.toLocaleString()}</td>
                    <td className="py-3">₹{r.gstAmount.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${badge(r.status)}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
