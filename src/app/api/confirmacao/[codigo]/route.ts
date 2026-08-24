import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/confirmacao/[codigo]
// Body: { resposta: "sim" | "nao" }
export async function POST(
  req: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const { codigo } = await params;
    const body = await req.json();
    const resposta = body?.resposta === "sim" ? "sim" : "nao";

    const conversa = await prisma.conversa.findUnique({
      where: { codigoConf: codigo },
      include: { membro: true },
    });

    if (!conversa) {
      return NextResponse.json({ error: "Código inválido" }, { status: 404 });
    }

    if (conversa.confirmada) {
      return NextResponse.json({ ok: true, jaConfirmada: true });
    }

    if (resposta === "sim") {
      // Confirma + atualiza pontos e streak
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      await prisma.conversa.update({
        where: { id: conversa.id },
        data: {
          confirmada: true,
          confirmadaEm: new Date(),
        },
      });

      // Buscar última conversa confirmada do membro para calcular streak
      const ultima = await prisma.conversa.findFirst({
        where: { membroId: conversa.membroId, confirmada: true, NOT: { id: conversa.id } },
        orderBy: { confirmadaEm: "desc" },
      });

      let novoStreak = 1;
      if (ultima?.confirmadaEm) {
        const ontem = new Date(hoje);
        ontem.setDate(ontem.getDate() - 1);
        const ultimaData = new Date(ultima.confirmadaEm);
        ultimaData.setHours(0, 0, 0, 0);
        if (ultimaData.getTime() === ontem.getTime()) {
          novoStreak = conversa.membro.streak + 1;
        } else if (ultimaData.getTime() === hoje.getTime()) {
          novoStreak = conversa.membro.streak;
        }
      }

      await prisma.membro.update({
        where: { id: conversa.membroId },
        data: {
          pontos: { increment: 10 }, // +10 pela confirmação
          streak: novoStreak,
        },
      });
    }

    return NextResponse.json({ ok: true, resposta });
  } catch (err) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// GET /api/confirmacao/[codigo]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;
  const conversa = await prisma.conversa.findUnique({
    where: { codigoConf: codigo },
    select: { id: true, confirmada: true, codigoConf: true },
  });
  if (!conversa) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(conversa);
}
