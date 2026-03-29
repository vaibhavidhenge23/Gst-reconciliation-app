"use client";
import { useState, useEffect } from "react";
import { Plus, ShoppingCart, TrendingUp } from "lucide-react";

export default function Invoices() {
  const [tab, setTab] = useState("purchase");
  const [form, setForm] = useState({
    invoiceNumber: "", partyName: "", partyGST: "",
    amount: "", gstRate: "18", invoiceDate: "",
  });
  const [msg, setMsg] = useState("");
  const [invoices, setInvoices] = useState([]);

  async function loadInvoices() {
    try {
      const res = await fetch(`/api/invoices?type=${tab}`);
      if (res.ok) setInvoices(await res.json());
    } catch {}
  }

  useEffect(() => { loadInvoices(); }, [tab]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: tab }),
      });
      if (res.ok) {
        setMsg("✅ Invoice saved!");
        setForm({ invoiceNumber: "", partyName: "", partyGST: "", amount: "", gstRate: "18", invoiceDate: "" });
        loadInvoices();
      } else {
        const data = await res.json();
        setMsg(`❌ ${data.error || "Error saving"}`);
      }
    } catch { setMsg("❌ Server error"); }
    setTimeout(() => setMsg(""), 3000);
  }

  const fields = [
    { key: "invoiceNumber", label: "Invoice Number", type: "text", placeholder: "INV-001" },
    { key: "partyName", label: tab === "purchase" ? "Vendor Name" : "Customer Name", type: "text", placeholder: tab === "purchase" ? "Tata Steel Ltd" : "ABC Traders" },
    { key: "partyGST", label: tab === "purchase" ? "Vendor GSTIN" : "Customer GSTIN", type: "text", placeholder: "27AABCT3518Q1ZV" },
    { key: "amount", label: "Amount (₹)", type: "number", placeholder: "50000" },
    { key: "invoiceDate", label: "Invoice Date", type: "date", placeholder: "" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Invoices</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("purchase")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition
            ${tab === "purchase" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
          <ShoppingCart size={16} /> Purchase Invoices
        </button>
        <button onClick={() => setTab("sales")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition
            ${tab === "sales" ? "bg-green-500 text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
          <TrendingUp size={16} /> Sales Invoices
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Add {tab === "purchase" ? "Purchase" : "Sales"} Invoice</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm text-gray-400 mb-1">{label}</label>
                <input type={type} placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  required={key !== "partyGST"} />
              </div>
            ))}
            <div>
              <label className="block text-sm text-gray-400 mb-1">GST Rate</label>
              <select value={form.gstRate}
                onChange={(e) => setForm({ ...form, gstRate: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500">
                {["0", "5", "12", "18", "28"].map((r) => (
                  <option key={r} value={r}>{r}%</option>
                ))}
              </select>
            </div>
            {form.amount && (
              <div className="bg-gray-800 rounded-lg p-3 text-sm">
                <span className="text-gray-400">GST Amount: </span>
                <span className="text-green-400 font-bold">
                  ₹{(parseFloat(form.amount) * parseInt(form.gstRate) / 100).toFixed(2)}
                </span>
                <span className="text-gray-400 ml-3">Total: </span>
                <span className="text-white font-bold">
                  ₹{(parseFloat(form.amount) + parseFloat(form.amount) * parseInt(form.gstRate) / 100).toFixed(2)}
                </span>
              </div>
            )}
            <button type="submit"
              className={`w-full font-bold py-2 rounded-lg transition flex items-center justify-center gap-2
                ${tab === "purchase" ? "bg-blue-500 text-white hover:bg-blue-400" : "bg-green-500 text-black hover:bg-green-400"}`}>
              <Plus size={18} /> Save {tab === "purchase" ? "Purchase" : "Sales"} Invoice
            </button>
            {msg && <p className="text-center text-sm mt-2">{msg}</p>}
          </form>
        </div>

        {/* Invoice List */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">
            {tab === "purchase" ? "Purchase" : "Sales"} Invoices ({invoices.length})
          </h3>
          {invoices.length === 0 ? (
            <p className="text-gray-500 text-sm">No {tab} invoices yet. Add one using the form.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {invoices.map((inv) => (
                <div key={inv.id} className="bg-gray-800 rounded-lg p-3 text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-white">{inv.invoiceNumber}</span>
                      <span className="text-gray-500 ml-2">
                        {tab === "purchase" ? inv.vendorName : inv.customerName}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full
                      ${inv.status === "reconciled" ? "bg-green-900 text-green-400" : "bg-yellow-900 text-yellow-400"}`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-1 text-gray-400">
                    <span>₹{inv.amount.toLocaleString()}</span>
                    <span>GST: ₹{inv.gstAmount.toLocaleString()}</span>
                    <span>{inv.gstRate}%</span>
                    <span>{new Date(inv.invoiceDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
