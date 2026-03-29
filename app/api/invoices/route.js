import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — fetch purchase or sales invoices
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "purchase";

    if (type === "sales") {
      const invoices = await prisma.salesInvoice.findMany({ orderBy: { invoiceDate: "desc" } });
      return NextResponse.json(invoices);
    }
    const invoices = await prisma.purchaseInvoice.findMany({ orderBy: { invoiceDate: "desc" } });
    return NextResponse.json(invoices);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST — save purchase or sales invoice
export async function POST(req) {
  try {
    const body = await req.json();
    const type = body.type || "purchase";
    const amt = parseFloat(body.amount);
    const rate = parseFloat(body.gstRate);
    const gstAmount = (amt * rate) / 100;

    if (type === "sales") {
      const invoice = await prisma.salesInvoice.create({
        data: {
          invoiceNumber: body.invoiceNumber,
          customerName:  body.partyName,
          customerGST:   body.partyGST || null,
          amount:        amt,
          gstAmount,
          gstRate:       rate,
          invoiceDate:   new Date(body.invoiceDate),
        },
      });
      return NextResponse.json(invoice, { status: 201 });
    }

    const invoice = await prisma.purchaseInvoice.create({
      data: {
        invoiceNumber: body.invoiceNumber,
        vendorName:    body.partyName,
        vendorGST:     body.partyGST || null,
        amount:        amt,
        gstAmount,
        gstRate:       rate,
        invoiceDate:   new Date(body.invoiceDate),
      },
    });
    return NextResponse.json(invoice, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
