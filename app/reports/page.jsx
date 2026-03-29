"use client";
import { useState, useEffect } from "react";
import { FileText, Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) setReports(await res.json());
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const yearReports = reports.filter((r) => r.year === viewYear);
  const yearTotalPurchaseGST = yearReports.reduce((s, r) => s + r.purchaseTotalGST, 0);
  const yearTotalSalesGST = yearReports.reduce((s, r) => s + r.salesTotalGST, 0);
  const yearTotalPayable = yearReports.reduce((s, r) => s + r.gstPayable, 0);
  const yearTotalITC = yearReports.reduce((s, r) => s + r.itcAvailable, 0);
  const yearMismatches = yearReports.filter((r) => r.mismatchDetected).length;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">GST Reports</h2>

      {/* Year Selector */}
      <div className="flex items-center gap-4 mb-6">
        <Calendar size={20} className="text-green-400" />
        <select value={viewYear} onChange={(e) => setViewYear(parseInt(e.target.value))}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
          {[2024, 2025, 2026].map((y) => <option key={y} value={y}>FY {y}-{(y + 1).toString().slice(2)}</option>)}
        </select>
      </div>

      {/* Annual Summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileText size={18} className="text-green-400" />
          Annual Summary — FY {viewYear}-{(viewYear + 1).toString().slice(2)}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Total Purchase GST</div>
            <div className="text-lg font-bold text-blue-400">₹{yearTotalPurchaseGST.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Total Sales GST</div>
            <div className="text-lg font-bold text-green-400">₹{yearTotalSalesGST.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Total GST Paid</div>
            <div className="text-lg font-bold text-yellow-400">₹{yearTotalPayable.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Total ITC Claimed</div>
            <div className="text-lg font-bold text-emerald-400">₹{yearTotalITC.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Mismatches</div>
            <div className={`text-lg font-bold ${yearMismatches > 0 ? "text-red-400" : "text-green-400"}`}>
              {yearMismatches} month(s)
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Reports */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Monthly GST Returns</h3>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading reports...</p>
        ) : yearReports.length === 0 ? (
          <p className="text-gray-500 text-sm">No reconciliation data for FY {viewYear}-{(viewYear + 1).toString().slice(2)}. Run reconciliation first.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="text-left py-2">Month</th>
                  <th className="text-right py-2">Purchases</th>
                  <th className="text-right py-2">Purchase GST</th>
                  <th className="text-right py-2">Sales</th>
                  <th className="text-right py-2">Sales GST</th>
                  <th className="text-right py-2">GST Payable</th>
                  <th className="text-right py-2">ITC</th>
                  <th className="text-center py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {yearReports.sort((a, b) => a.month - b.month).map((r) => (
                  <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 font-semibold">{MONTH_NAMES[r.month - 1]} {r.year}</td>
                    <td className="py-3 text-right">{r.purchaseCount}</td>
                    <td className="py-3 text-right text-blue-400">₹{r.purchaseTotalGST.toFixed(2)}</td>
                    <td className="py-3 text-right">{r.salesCount}</td>
                    <td className="py-3 text-right text-green-400">₹{r.salesTotalGST.toFixed(2)}</td>
                    <td className="py-3 text-right text-yellow-400 font-semibold">₹{r.gstPayable.toFixed(2)}</td>
                    <td className="py-3 text-right text-emerald-400">₹{r.itcAvailable.toFixed(2)}</td>
                    <td className="py-3 text-center">
                      {r.mismatchDetected
                        ? <span className="flex items-center justify-center gap-1"><AlertTriangle size={14} className="text-red-400" /><span className="text-red-400 text-xs">Mismatch</span></span>
                        : <span className="flex items-center justify-center gap-1"><CheckCircle size={14} className="text-green-400" /><span className="text-green-400 text-xs">Filed</span></span>}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-700 font-bold">
                  <td className="py-3">Total</td>
                  <td className="py-3 text-right">{yearReports.reduce((s, r) => s + r.purchaseCount, 0)}</td>
                  <td className="py-3 text-right text-blue-400">₹{yearTotalPurchaseGST.toFixed(2)}</td>
                  <td className="py-3 text-right">{yearReports.reduce((s, r) => s + r.salesCount, 0)}</td>
                  <td className="py-3 text-right text-green-400">₹{yearTotalSalesGST.toFixed(2)}</td>
                  <td className="py-3 text-right text-yellow-400">₹{yearTotalPayable.toFixed(2)}</td>
                  <td className="py-3 text-right text-emerald-400">₹{yearTotalITC.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
