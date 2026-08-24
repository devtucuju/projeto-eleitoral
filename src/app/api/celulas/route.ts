import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/celulas?cidade=Macapá
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cidade = searchParams.get("cidade");
  const celulas = await prisma.celula.findMany({
    where: cidade ? { cidade } : undefined,
    include: { _count: { select: { membros: true } } },
    orderBy: { nome: "asc" },
  });
  return NextResponse.json(celulas);
}
