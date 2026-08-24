import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// PATCH /api/admin/partidos/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await params;
    const body = await req.json();
    const partido = await prisma.partido.update({
      where: { id },
      data: {
        ...(body.nome !== undefined && { nome: String(body.nome) }),
        ...(body.sigla !== undefined && { sigla: String(body.sigla).toUpperCase() }),
        ...(body.numero !== undefined && { numero: Number(body.numero) }),
        ...(body.cor !== undefined && { cor: String(body.cor) }),
        ...(body.logo !== undefined && { logo: String(body.logo) }),
        ...(body.ativo !== undefined && { ativo: Boolean(body.ativo) }),
      },
    });
    return NextResponse.json({ ok: true, partido });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Sigla ou número já cadastrado" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE /api/admin/partidos/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await params;
    await prisma.partido.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.code === "P2003") {
      return NextResponse.json({ error: "Partido tem candidatos vinculados" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
