import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/cadastro
// Body: { telefone, nome, apelido?, municipio, celulaId, aceitouTermos, paiId? }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const telefone = String(body?.telefone ?? "").replace(/\D/g, "");
    const nome = String(body?.nome ?? "").trim();
    const celulaId = String(body?.celulaId ?? "");
    const aceitouTermos = Boolean(body?.aceitouTermos);
    const paiId = body?.paiId ? String(body.paiId) : null;

    // Validação
    if (telefone.length < 10) {
      return NextResponse.json({ error: "Telefone inválido" }, { status: 400 });
    }
    if (nome.length < 2) {
      return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
    }
    if (!celulaId) {
      return NextResponse.json({ error: "Célula obrigatória" }, { status: 400 });
    }
    if (!aceitouTermos) {
      return NextResponse.json({ error: "É preciso aceitar os termos" }, { status: 400 });
    }

    // Verifica se telefone já existe
    const existe = await prisma.membro.findUnique({ where: { telefone } });
    if (existe) {
      return NextResponse.json(
        { error: "Telefone já cadastrado", membroId: existe.id },
        { status: 409 }
      );
    }

    // Verifica se a célula existe
    const celula = await prisma.celula.findUnique({ where: { id: celulaId } });
    if (!celula) {
      return NextResponse.json({ error: "Célula não encontrada" }, { status: 404 });
    }

    // Cria membro com status "pendente"
    const membro = await prisma.membro.create({
      data: {
        telefone,
        nome,
        apelido: body?.apelido ? String(body.apelido).trim() : null,
        municipio: body?.municipio ? String(body.municipio) : celula.cidade,
        celulaId,
        tipo: "voluntario",
        status: "pendente",
        isLideranca: false,
        aceitouTermos: true,
        codigoConvite: telefone.slice(-8),
        paiId,
        pontos: 0,
        streak: 0,
      },
    });

    // Se veio de convite, bonifica quem convidou (+20 pts)
    if (paiId) {
      await prisma.membro.update({
        where: { id: paiId },
        data: { pontos: { increment: 20 } },
      });
    }

    return NextResponse.json({
      ok: true,
      membroId: membro.id,
      status: membro.status,
      mensagem: "Cadastro realizado! Aguarde aprovação do coordenador.",
    });
  } catch (err) {
    console.error("Erro no cadastro:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
