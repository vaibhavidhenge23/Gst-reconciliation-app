"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, RefreshCw, BarChart2, Bell } from "lucide-react";

const nav = [
  { href: "/dashboard",      label: "Dashboard",  icon: LayoutDashboard },
  { href: "/invoices",       label: "Invoices",   icon: FileText },
  { href: "/reconciliation", label: "Reconcile",  icon: RefreshCw },
  { href: "/reports",        label: "Reports",    icon: BarChart2 },
  { href: "/alerts",         label: "Alerts",     icon: Bell },
];

export default function Header() {
  const path = usePathname();
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-green-400 font-bold text-xl">💼 GST Auto</Link>
        <nav className="flex gap-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                ${path === href
                  ? "bg-green-500 text-black font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
              <Icon size={16} />{label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
