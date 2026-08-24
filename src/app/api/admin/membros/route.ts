import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/membros - lista todos (com filtros opcionais)
export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const celulaId = searchParams.get("celulaId");

  const membros = await prisma.membro.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(celulaId ? { celulaId } : {}),
    },
    include: { celula: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(membros);
}

// PATCH /api/admin/membros/[id] - aprovar/rebaixar/promover
export async function PATCH(req: Request) {
  // Delegado para rota [id]/route.ts
  return NextResponse.json({ error: "Use /api/admin/membros/[id]" }, { status: 405 });
}
