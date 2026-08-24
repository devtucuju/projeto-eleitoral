import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/membros/[id]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const membro = await prisma.membro.findUnique({
    where: { id },
    include: {
      celula: true,
      conversas: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });
  if (!membro) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(membro);
}
