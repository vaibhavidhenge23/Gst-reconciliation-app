"use client";
import { useState, useEffect } from "react";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

export default function Alerts() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/alerts");
        if (res.ok) setLogs(await res.json());
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const icon = (severity) =>
    severity === "HIGH"   ? <AlertTriangle className="text-red-400 mt-0.5" size={20} /> :
    severity === "MEDIUM" ? <AlertTriangle className="text-yellow-400 mt-0.5" size={20} /> :
                            <Info className="text-blue-400 mt-0.5" size={20} />;

  const badge = (type) =>
    type === "ERROR" || type === "MISMATCH" ? "bg-red-900 text-red-400" :
    type === "WARNING" ? "bg-yellow-900 text-yellow-400" : "bg-blue-900 text-blue-400";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Compliance Alerts</h2>
      <div className="space-y-3 max-w-3xl">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading alerts...</p>
        ) : logs.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4">
            <CheckCircle className="text-green-400" size={24} />
            <div>
              <div className="font-semibold">No Issues Found</div>
              <div className="text-gray-500 text-sm">Run reconciliation to detect issues and generate alerts.</div>
            </div>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-start gap-4">
              {icon(log.severity)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${badge(log.type)}`}>{log.type}</span>
                  <span className="text-gray-500 text-xs">{log.period}</span>
                  <span className="text-gray-600 text-xs">{new Date(log.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-300 text-sm">{log.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
