import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/me
// Body: { telefone: "96999990000" }
// Retorna:
//   200 → membro encontrado, vai pra home
//   202 → telefone não cadastrado, vai pra cadastro
//   404 → banco vazio
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const telefone = String(body?.telefone ?? "").replace(/\D/g, "");
    if (telefone.length < 10) {
      return NextResponse.json({ error: "Telefone inválido" }, { status: 400 });
    }

    const membro = await prisma.membro.findUnique({ where: { telefone } });
    if (membro) {
      return NextResponse.json({ ok: true, membroId: membro.id, status: membro.status });
    }

    // Telefone novo → autocadastro
    return NextResponse.json(
      { ok: false, telefone, mensagem: "Telefone não cadastrado" },
      { status: 202 }
    );
  } catch (err) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// GET /api/me
// Retorna o membro atual (em produção: da sessão)
export async function GET() {
  const membro = await prisma.membro.findFirst({ include: { celula: true } });
  if (!membro) return NextResponse.json({ error: "Sem membro" }, { status: 404 });
  return NextResponse.json(membro);
}
