import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/celulas
export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const celulas = await prisma.celula.findMany({
    include: {
      candidato: { select: { id: true, nome: true } },
      _count: { select: { membros: true, missoes: true } },
    },
    orderBy: [{ cidade: "asc" }, { nome: "asc" }],
  });
  return NextResponse.json(celulas);
}

// POST /api/admin/celulas
// Body: { nome, cidade, candidatoId }
export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json();
    const nome = String(body?.nome ?? "").trim();
    const cidade = String(body?.cidade ?? "Macapá").trim();
    const candidatoId = String(body?.candidatoId ?? "");
    if (!nome || !candidatoId) {
      return NextResponse.json({ error: "Nome e candidato obrigatórios" }, { status: 400 });
    }
    const celula = await prisma.celula.create({
      data: { nome, cidade, candidatoId },
    });
    return NextResponse.json({ ok: true, celula });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Já existe célula com esse nome para esse candidato" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
