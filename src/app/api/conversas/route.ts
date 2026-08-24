import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

// POST /api/conversas
// Body: { nomeEleitor?: string, telefoneEleitor: string }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const telefone = String(body?.telefoneEleitor ?? "").replace(/\D/g, "");
    if (telefone.length < 10) {
      return NextResponse.json({ error: "Telefone do eleitor inválido" }, { status: 400 });
    }

    // Pega o primeiro membro (em produção: da sessão)
    const membro = await prisma.membro.findFirst();
    if (!membro) {
      return NextResponse.json({ error: "Sem membros cadastrados" }, { status: 404 });
    }

    // Missão ativa do dia (opcional)
    const missao = await prisma.missao.findFirst({
      where: { ativa: true },
      orderBy: { data: "desc" },
    });

    // Gera código único de confirmação
    const codigoConf = randomBytes(8).toString("hex").toUpperCase();

    const conversa = await prisma.conversa.create({
      data: {
        membroId: membro.id,
        missaoId: missao?.id,
        nomeEleitor: body?.nomeEleitor ? String(body.nomeEleitor).slice(0, 100) : null,
        telefoneEleitor: telefone,
        interesse: "indeciso",
        codigoConf,
        confirmada: false,
      },
    });

    // +5 pontos pelo registro
    await prisma.membro.update({
      where: { id: membro.id },
      data: { pontos: { increment: 5 } },
    });

    return NextResponse.json({ ok: true, codigoConf, conversaId: conversa.id });
  } catch (err) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// GET /api/conversas
export async function GET() {
  const conversas = await prisma.conversa.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { membro: true },
  });
  return NextResponse.json(conversas);
}
