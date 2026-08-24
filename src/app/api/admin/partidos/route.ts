import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/partidos
export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const partidos = await prisma.partido.findMany({
    include: { _count: { select: { candidatos: true } } },
    orderBy: { sigla: "asc" },
  });
  return NextResponse.json(partidos);
}

// POST /api/admin/partidos
// Body: { nome, sigla, numero, cor?, logo? }
export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json();
    const nome = String(body?.nome ?? "").trim();
    const sigla = String(body?.sigla ?? "").trim().toUpperCase();
    const numero = Number(body?.numero);
    if (!nome || !sigla || !numero) {
      return NextResponse.json({ error: "Nome, sigla e número obrigatórios" }, { status: 400 });
    }
    const partido = await prisma.partido.create({
      data: {
        nome,
        sigla,
        numero,
        cor: body?.cor || "#1F6B4A",
        logo: body?.logo || null,
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
