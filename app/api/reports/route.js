import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reconciliations = await prisma.gSTReconciliation.findMany({
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
    return NextResponse.json(reconciliations);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
