import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const purchaseInvoices = await prisma.purchaseInvoice.findMany({
      where: { invoiceDate: { gte: monthStart, lt: monthEnd } },
    });
    const salesInvoices = await prisma.salesInvoice.findMany({
      where: { invoiceDate: { gte: monthStart, lt: monthEnd } },
    });

    const totalPurchaseGST = purchaseInvoices.reduce((s, p) => s + p.gstAmount, 0);
    const totalSalesGST = salesInvoices.reduce((s, p) => s + p.gstAmount, 0);
    const gstPayable = totalSalesGST - totalPurchaseGST;

    const totalPurchases = purchaseInvoices.length;
    const totalSales = salesInvoices.length;
    const reconciledP = purchaseInvoices.filter(p => p.status === "reconciled").length;
    const reconciledS = salesInvoices.filter(s => s.status === "reconciled").length;
    const total = totalPurchases + totalSales;
    const reconciled = reconciledP + reconciledS;
    const reconciledPct = total > 0 ? Math.round((reconciled / total) * 100) : 0;

    // Recent invoices (last 5 of each type)
    const recentPurchases = await prisma.purchaseInvoice.findMany({
      orderBy: { createdAt: "desc" }, take: 5,
    });
    const recentSales = await prisma.salesInvoice.findMany({
      orderBy: { createdAt: "desc" }, take: 5,
    });

    return NextResponse.json({
      totalSalesGST,
      totalPurchaseGST,
      gstPayable: gstPayable > 0 ? gstPayable : 0,
      itcAvailable: gstPayable < 0 ? Math.abs(gstPayable) : 0,
      reconciledPct,
      totalPurchases,
      totalSales,
      recentPurchases,
      recentSales,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
