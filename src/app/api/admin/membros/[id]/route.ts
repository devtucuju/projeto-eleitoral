import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// PATCH /api/admin/membros/[id]
// Body: { status?: "pendente" | "fechado" | "inativo", isLideranca?: boolean, tipo?: "cabo" | "lider" | "voluntario" }
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const body = await req.json();
    const data: any = {};

    if (body.status && ["pendente", "fechado", "inativo"].includes(body.status)) {
      data.status = body.status;
    }
    if (typeof body.isLideranca === "boolean") {
      data.isLideranca = body.isLideranca;
    }
    if (body.tipo && ["cabo", "lider", "voluntario"].includes(body.tipo)) {
      data.tipo = body.tipo;
      // Se virou líder, marca isLideranca também
      if (body.tipo === "lider") data.isLideranca = true;
    }

    const membro = await prisma.membro.update({
      where: { id },
      data,
    });
    return NextResponse.json({ ok: true, membro });
  } catch (err) {
    console.error("Erro ao atualizar membro:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// GET /api/admin/membros/[id]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const membro = await prisma.membro.findUnique({
    where: { id },
    include: { celula: true, conversas: { orderBy: { createdAt: "desc" }, take: 10 } },
  });
  if (!membro) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(membro);
}
