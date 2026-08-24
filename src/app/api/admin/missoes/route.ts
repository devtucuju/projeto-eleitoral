import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/missoes - listar todas
export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const missoes = await prisma.missao.findMany({
    include: { celula: true, candidato: true, _count: { select: { conversas: true } } },
    orderBy: { data: "desc" },
  });
  return NextResponse.json(missoes);
}

// POST /api/admin/missoes - criar
// Body: { titulo, descricao?, tipo?, local?, data, metaConversas?, candidatoId, celulaId? }
export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const titulo = String(body?.titulo ?? "").trim();
    const candidatoId = String(body?.candidatoId ?? "");
    if (!titulo || !candidatoId) {
      return NextResponse.json({ error: "Título e candidato obrigatórios" }, { status: 400 });
    }

    const missao = await prisma.missao.create({
      data: {
        titulo,
        descricao: body?.descricao ? String(body.descricao) : null,
        tipo: body?.tipo ? String(body.tipo) : "feira",
        local: body?.local ? String(body.local) : null,
        data: body?.data ? new Date(body.data) : new Date(),
        metaConversas: body?.metaConversas ? Number(body.metaConversas) : 5,
        ativa: true,
        candidatoId,
        celulaId: body?.celulaId || null,
      },
    });
    return NextResponse.json({ ok: true, missao });
  } catch (err) {
    console.error("Erro ao criar missão:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
