"use client";
import { useState } from "react";
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Info, ShoppingCart, TrendingUp } from "lucide-react";

export default function Reconciliation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  async function runReconcile() {
    setLoading(true);
    try {
      const res = await fetch("/api/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year }),
      });
      setResult(await res.json());
    } catch { setResult({ error: "Server error" }); }
    setLoading(false);
  }

  const logIcon = (severity) =>
    severity === "HIGH" ? <XCircle className="text-red-400 shrink-0" size={16} /> :
    severity === "MEDIUM" ? <AlertTriangle className="text-yellow-400 shrink-0" size={16} /> :
                            <Info className="text-blue-400 shrink-0" size={16} />;

  const logBadge = (type) =>
    type === "ERROR" ? "bg-red-900 text-red-400" :
    type === "MISMATCH" ? "bg-red-900 text-red-400" :
    type === "WARNING" ? "bg-yellow-900 text-yellow-400" : "bg-blue-900 text-blue-400";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">GST Reconciliation</h2>

      {/* Controls */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <p className="text-gray-400 mb-4 text-sm">
          Select month and year to reconcile Purchase vs Sales GST, detect mismatches and generate error logs.
        </p>
        <div className="flex items-end gap-4 flex-wrap">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Month</label>
            <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Year</label>
            <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
              {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button onClick={runReconcile} disabled={loading}
            className="bg-green-500 text-black font-bold px-6 py-2 rounded-lg hover:bg-green-400 transition flex items-center gap-2 disabled:opacity-50">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? "Running..." : "Run Reconciliation"}
          </button>
        </div>
      </div>

      {result && !result.error && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-xs">Purchase GST (ITC)</div>
              <div className="text-xl font-bold text-blue-400">₹{result.purchaseTotalGST?.toFixed(2)}</div>
              <div className="text-gray-500 text-xs">{result.purchaseCount} invoices</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-xs">Sales GST (Output)</div>
              <div className="text-xl font-bold text-green-400">₹{result.salesTotalGST?.toFixed(2)}</div>
              <div className="text-gray-500 text-xs">{result.salesCount} invoices</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-xs">GST Payable</div>
              <div className="text-xl font-bold text-yellow-400">₹{result.gstPayable?.toFixed(2)}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-xs">ITC Available</div>
              <div className="text-xl font-bold text-emerald-400">₹{result.itcAvailable?.toFixed(2)}</div>
              <div className="flex items-center gap-1 mt-1">
                {result.mismatchDetected
                  ? <><XCircle size={14} className="text-red-400" /><span className="text-red-400 text-xs">Mismatch</span></>
                  : <><CheckCircle size={14} className="text-green-400" /><span className="text-green-400 text-xs">All Clear</span></>}
              </div>
            </div>
          </div>

          {/* Invoice Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Purchase List */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ShoppingCart size={18} className="text-blue-400" />
                Purchase Invoices ({result.purchases?.length || 0})
              </h3>
              {(!result.purchases || result.purchases.length === 0) ? (
                <p className="text-gray-500 text-sm">No purchase invoices for this period.</p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {result.purchases.map((p) => (
                    <div key={p.id} className="bg-gray-800 rounded-lg p-3 text-sm flex justify-between">
                      <div>
                        <span className="font-semibold">{p.invoiceNumber}</span>
                        <span className="text-gray-500 ml-2">{p.vendorName}</span>
                      </div>
                      <div className="text-right">
                        <div>₹{p.amount.toLocaleString()}</div>
                        <div className="text-blue-400 text-xs">GST: ₹{p.gstAmount.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sales List */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-400" />
                Sales Invoices ({result.sales?.length || 0})
              </h3>
              {(!result.sales || result.sales.length === 0) ? (
                <p className="text-gray-500 text-sm">No sales invoices for this period.</p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {result.sales.map((s) => (
                    <div key={s.id} className="bg-gray-800 rounded-lg p-3 text-sm flex justify-between">
                      <div>
                        <span className="font-semibold">{s.invoiceNumber}</span>
                        <span className="text-gray-500 ml-2">{s.customerName}</span>
                      </div>
                      <div className="text-right">
                        <div>₹{s.amount.toLocaleString()}</div>
                        <div className="text-green-400 text-xs">GST: ₹{s.gstAmount.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Logs */}
          {result.logs && result.logs.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle size={18} className="text-yellow-400" />
                Reconciliation Logs ({result.logs.length})
              </h3>
              <div className="space-y-2">
                {result.logs.map((log) => (
                  <div key={log.id} className="bg-gray-800 rounded-lg p-3 flex items-start gap-3 text-sm">
                    {logIcon(log.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${logBadge(log.type)}`}>{log.type}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full
                          ${log.severity === "HIGH" ? "bg-red-900/50 text-red-400" :
                            log.severity === "MEDIUM" ? "bg-yellow-900/50 text-yellow-400" : "bg-blue-900/50 text-blue-400"}`}>
                          {log.severity}
                        </span>
                      </div>
                      <p className="text-gray-300">{log.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {result?.error && <p className="text-red-400 mt-4 text-sm bg-gray-900 border border-red-900 rounded-xl p-4">{result.error}</p>}
    </div>
  );
}
