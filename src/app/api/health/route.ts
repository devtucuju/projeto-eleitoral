import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/health
export async function GET() {
  try {
    // Testar conexão com banco
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected"
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      database: "disconnected"
    }, { status: 503 });
  }
}
