import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/candidatos
export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const candidatos = await prisma.candidato.findMany({
    include: { partido: true, _count: { select: { celulas: true, missoes: true } } },
    orderBy: { nome: "asc" },
  });
  return NextResponse.json(candidatos);
}

// POST /api/admin/candidatos
// Body: { nome, apelido?, numero, cargo, partidoId, foto? }
export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json();
    const nome = String(body?.nome ?? "").trim();
    const numero = Number(body?.numero);
    const cargo = String(body?.cargo ?? "").trim();
    const partidoId = String(body?.partidoId ?? "");
    if (!nome || !numero || !cargo || !partidoId) {
      return NextResponse.json({ error: "Nome, número, cargo e partido obrigatórios" }, { status: 400 });
    }
    const candidato = await prisma.candidato.create({
      data: {
        nome,
        apelido: body?.apelido || null,
        numero,
        cargo,
        partidoId,
        foto: body?.foto || null,
      },
    });
    return NextResponse.json({ ok: true, candidato });
  } catch (err) {
    console.error("Erro ao criar candidato:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
