import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/membros
export async function GET() {
  const membros = await prisma.membro.findMany({
    include: { celula: true },
    orderBy: [{ pontos: "desc" }, { streak: "desc" }],
    take: 100,
  });
  return NextResponse.json(membros);
}
