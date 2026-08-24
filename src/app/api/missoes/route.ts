import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/missoes - missões ativas
export async function GET() {
  const missoes = await prisma.missao.findMany({
    where: { ativa: true },
    include: { celula: true, candidato: true },
    orderBy: { data: "desc" },
  });
  return NextResponse.json(missoes);
}
