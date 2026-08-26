import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/esqueci
// Body: { telefone }
// Anonimiza o membro e suas conversas (LGPD)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const telefone = String(body?.telefone ?? "").replace(/\D/g, "");
    if (telefone.length < 10) {
      return NextResponse.json({ error: "Telefone inválido" }, { status: 400 });
    }

    const membro = await prisma.membro.findUnique({ where: { telefone } });
    if (!membro) {
      // Não revela se existe ou não
      return NextResponse.json({ ok: true, mensagem: "Dados removidos" });
    }

    // Anonimiza o membro
    await prisma.membro.update({
      where: { id: membro.id },
      data: {
        nome: "[REMOVIDO]",
        apelido: null,
        telefone: null,
        referencia: null,
        aceitouTermos: false,
        // Mantém: pontos, streak, paiId (estrutura da campanha)
      },
    });

    // Anonimiza conversas do membro (mantém dados, apaga identificação)
    await prisma.conversa.updateMany({
      where: { membroId: membro.id },
      data: {
        nomePessoa: null,
        telefonePessoa: null,
        observacao: null,
      },
    });

    return NextResponse.json({
      ok: true,
      mensagem: "Seus dados foram removidos. Estrutura da campanha preservada (você continua contando nos números).",
    });
  } catch (err) {
    console.error("Erro ao anonimizar:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
