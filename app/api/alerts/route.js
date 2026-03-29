import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.reconciliationLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(logs);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
