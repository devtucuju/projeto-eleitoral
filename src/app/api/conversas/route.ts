import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const telefone = String(body?.telefonePessoa ?? "").replace(/\D/g, "");
    if (telefone.length < 10) {
      return NextResponse.json({ error: "Telefone inválido" }, { status: 400 });
    }

    const membro = await prisma.membro.findFirst();
    if (!membro) {
      return NextResponse.json({ error: "Sem membros cadastrados" }, { status: 404 });
    }

    const missao = await prisma.missao.findFirst({
      where: { ativa: true },
      orderBy: { data: "desc" },
    });

    const codigoConf = randomBytes(8).toString("hex").toUpperCase();

    let pessoa = telefone ? await prisma.pessoa.findFirst({
      where: { telefone },
    }) : null;

    if (!pessoa && body?.nomePessoa) {
      pessoa = await prisma.pessoa.create({
        data: {
          nome: String(body.nomePessoa).trim(),
          telefone,
        },
      });
    } else if (!pessoa && !body?.nomePessoa) {
      pessoa = await prisma.pessoa.create({
        data: {
          nome: telefone,
          telefone,
        },
      });
    }

    const conversa = await prisma.conversa.create({
      data: {
        membroId: membro.id,
        missaoId: missao?.id,
        pessoaId: pessoa?.id,
        nomePessoa: body?.nomePessoa ? String(body.nomePessoa).slice(0, 100) : null,
        telefonePessoa: telefone,
        interesse: "indeciso",
        codigoConf,
        confirmada: false,
      },
    });

    await prisma.membro.update({
      where: { id: membro.id },
      data: { pontos: { increment: 5 } },
    });

    return NextResponse.json({ ok: true, codigoConf, conversaId: conversa.id, pessoaId: pessoa?.id });
  } catch (err) {
    console.error("Erro ao criar conversa:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET() {
  const conversas = await prisma.conversa.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { membro: true },
  });
  return NextResponse.json(conversas);
}
