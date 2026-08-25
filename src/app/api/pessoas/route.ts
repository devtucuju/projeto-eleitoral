import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const busca = searchParams.get("busca") || "";
    const cidade = searchParams.get("cidade") || "";
    const telefone = searchParams.get("telefone") || "";

    const where: Record<string, unknown> = {};

    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: "insensitive" } },
        { cpf: { contains: busca, mode: "insensitive" } },
        { numeroTitulo: { contains: busca, mode: "insensitive" } },
      ];
    }

    if (cidade) {
      where.cidade = { contains: cidade, mode: "insensitive" };
    }

    if (telefone) {
      where.telefone = { contains: telefone.replace(/\D/g, ""), mode: "insensitive" };
    }

    const includeConversas = busca || telefone;

    const pessoas = await prisma.pessoa.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: includeConversas ? 20 : 100,
      include: includeConversas ? {
        conversas: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { membro: { select: { nome: true } } },
        },
      } : undefined,
    });

    return NextResponse.json(pessoas);
  } catch (err) {
    console.error("Erro ao listar pessoas:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const telefone = body?.telefone ? String(body.telefone).replace(/\D/g, "") : "";

    const nome = String(body?.nome ?? "").trim();
    if (nome.length < 2) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    if (telefone) {
      const existente = await prisma.pessoa.findFirst({
        where: { telefone },
      });

      if (existente) {
        const data: Record<string, unknown> = { nome };
        if (body?.cpf) data.cpf = String(body.cpf).replace(/\D/g, "");
        if (body?.numeroTitulo) data.numeroTitulo = String(body.numeroTitulo).trim();
        if (body?.zona) data.zona = String(body.zona).trim();
        if (body?.secao) data.secao = String(body.secao).trim();
        if (body?.cidade) data.cidade = String(body.cidade).trim();
        if (body?.endereco) data.endereco = String(body.endereco).trim();
        if (body?.observacao !== undefined) data.observacao = String(body.observacao).trim();

        const atualizado = await prisma.pessoa.update({
          where: { id: existente.id },
          data,
        });

        return NextResponse.json({
          ok: true,
          pessoa: atualizado,
          mensagem: "Pessoa atualizada!",
          updated: true,
        });
      }
    }

    const data: Record<string, unknown> = { nome };
    if (telefone) data.telefone = telefone;
    if (body?.cpf) data.cpf = String(body.cpf).replace(/\D/g, "");
    if (body?.numeroTitulo) data.numeroTitulo = String(body.numeroTitulo).trim();
    if (body?.zona) data.zona = String(body.zona).trim();
    if (body?.secao) data.secao = String(body.secao).trim();
    if (body?.cidade) data.cidade = String(body.cidade).trim();
    if (body?.endereco) data.endereco = String(body.endereco).trim();
    if (body?.observacao) data.observacao = String(body.observacao).trim();

    const pessoa = await prisma.pessoa.create({ data });

    return NextResponse.json({
      ok: true,
      pessoa,
      mensagem: "Pessoa cadastrada com sucesso!",
    });
  } catch (err) {
    console.error("Erro ao cadastrar pessoa:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
