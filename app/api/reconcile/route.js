import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { month, year } = await req.json();
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    const period = `${year}-${String(month).padStart(2, "0")}`;

    // Fetch invoices for the month
    const purchases = await prisma.purchaseInvoice.findMany({
      where: { invoiceDate: { gte: startDate, lt: endDate } },
      orderBy: { invoiceDate: "desc" },
    });

    const sales = await prisma.salesInvoice.findMany({
      where: { invoiceDate: { gte: startDate, lt: endDate } },
      orderBy: { invoiceDate: "desc" },
    });

    // Calculate totals
    const purchaseTotalAmt = purchases.reduce((s, p) => s + p.amount, 0);
    const purchaseTotalGST = purchases.reduce((s, p) => s + p.gstAmount, 0);
    const salesTotalAmt = sales.reduce((s, p) => s + p.amount, 0);
    const salesTotalGST = sales.reduce((s, p) => s + p.gstAmount, 0);

    const gstPayable = salesTotalGST - purchaseTotalGST;
    const itcAvailable = gstPayable < 0 ? Math.abs(gstPayable) : 0;
    const finalPayable = gstPayable > 0 ? gstPayable : 0;

    // Delete old logs for this period
    await prisma.reconciliationLog.deleteMany({ where: { period } });

    // Build error logs
    const logs = [];

    // Check for purchase invoices missing GST number
    const missingGSTPurchases = purchases.filter(p => !p.vendorGST);
    if (missingGSTPurchases.length > 0) {
      logs.push({
        period, type: "WARNING", severity: "MEDIUM",
        message: `${missingGSTPurchases.length} purchase invoice(s) missing vendor GST number: ${missingGSTPurchases.map(p => p.invoiceNumber).join(", ")}`,
      });
    }

    // Check for sales invoices missing GST number
    const missingGSTSales = sales.filter(s => !s.customerGST);
    if (missingGSTSales.length > 0) {
      logs.push({
        period, type: "WARNING", severity: "MEDIUM",
        message: `${missingGSTSales.length} sales invoice(s) missing customer GST number: ${missingGSTSales.map(s => s.invoiceNumber).join(", ")}`,
      });
    }

    // Check for zero-amount invoices
    const zeroPurchases = purchases.filter(p => p.amount === 0);
    const zeroSales = sales.filter(s => s.amount === 0);
    if (zeroPurchases.length + zeroSales.length > 0) {
      logs.push({
        period, type: "ERROR", severity: "HIGH",
        message: `${zeroPurchases.length + zeroSales.length} invoice(s) with zero amount detected`,
      });
    }

    // Check for GST rate mismatches (unusual rates)
    const validRates = [0, 5, 12, 18, 28];
    const invalidRatePurchases = purchases.filter(p => !validRates.includes(p.gstRate));
    const invalidRateSales = sales.filter(s => !validRates.includes(s.gstRate));
    if (invalidRatePurchases.length + invalidRateSales.length > 0) {
      logs.push({
        period, type: "ERROR", severity: "HIGH",
        message: `${invalidRatePurchases.length + invalidRateSales.length} invoice(s) with invalid GST rate detected`,
      });
    }

    // Large mismatch detection
    const mismatchDetected = Math.abs(salesTotalGST - purchaseTotalGST) > 1000;
    if (mismatchDetected && purchases.length > 0 && sales.length > 0) {
      logs.push({
        period, type: "MISMATCH", severity: "HIGH",
        message: `GST mismatch of ₹${Math.abs(salesTotalGST - purchaseTotalGST).toFixed(2)} detected between purchase GST (₹${purchaseTotalGST.toFixed(2)}) and sales GST (₹${salesTotalGST.toFixed(2)})`,
      });
    }

    // No data warning
    if (purchases.length === 0 && sales.length === 0) {
      logs.push({
        period, type: "INFO", severity: "LOW",
        message: "No invoices found for this period. Add purchase and sales invoices first.",
      });
    }

    // Save logs
    if (logs.length > 0) {
      await prisma.reconciliationLog.createMany({ data: logs });
    }

    // Mark invoices as reconciled
    await prisma.purchaseInvoice.updateMany({
      where: { invoiceDate: { gte: startDate, lt: endDate } },
      data: { status: "reconciled" },
    });
    await prisma.salesInvoice.updateMany({
      where: { invoiceDate: { gte: startDate, lt: endDate } },
      data: { status: "reconciled" },
    });

    // Upsert reconciliation record
    const reconciliation = await prisma.gSTReconciliation.upsert({
      where: { period },
      update: {
        purchaseCount: purchases.length, purchaseTotalAmt, purchaseTotalGST,
        salesCount: sales.length, salesTotalAmt, salesTotalGST,
        gstPayable: finalPayable, itcAvailable, mismatchDetected,
      },
      create: {
        period, month, year,
        purchaseCount: purchases.length, purchaseTotalAmt, purchaseTotalGST,
        salesCount: sales.length, salesTotalAmt, salesTotalGST,
        gstPayable: finalPayable, itcAvailable, mismatchDetected,
      },
    });

    // Fetch saved logs
    const savedLogs = await prisma.reconciliationLog.findMany({
      where: { period },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      ...reconciliation,
      purchases,
      sales,
      logs: savedLogs,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
