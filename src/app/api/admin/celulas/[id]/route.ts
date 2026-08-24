import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// PATCH /api/admin/celulas/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await params;
    const body = await req.json();
    const celula = await prisma.celula.update({
      where: { id },
      data: {
        ...(body.nome !== undefined && { nome: String(body.nome) }),
        ...(body.cidade !== undefined && { cidade: String(body.cidade) }),
      },
    });
    return NextResponse.json({ ok: true, celula });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Já existe célula com esse nome" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE /api/admin/celulas/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await params;
    await prisma.celula.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.code === "P2003") {
      return NextResponse.json({ error: "Célula tem membros ou missões vinculadas" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
