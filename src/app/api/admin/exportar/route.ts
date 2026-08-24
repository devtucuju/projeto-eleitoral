import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/exportar?tipo=conversas|membros|celulas
export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get("tipo") || "conversas";

  let csv = "";
  let filename = "";

  if (tipo === "conversas") {
    const conversas = await prisma.conversa.findMany({
      include: {
        membro: { select: { nome: true, apelido: true, telefone: true } },
        missao: { select: { titulo: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    csv = "Data;Membro;Telefone Membro;Eleitor;Telefone Eleitor;Confirmada;Missao;Local\n";
    csv += conversas.map((c) => {
      const data = c.createdAt.toISOString().slice(0, 19).replace("T", " ");
      const membro = (c.membro.apelido || c.membro.nome).replace(/[;\n]/g, " ");
      const membroTel = c.membro.telefone || "";
      const eleitor = (c.nomeEleitor || "").replace(/[;\n]/g, " ");
      const eleitorTel = c.telefoneEleitor || "";
      const confirmada = c.confirmada ? "SIM" : "NAO";
      const missao = (c.missao?.titulo || "").replace(/[;\n]/g, " ");
      const local = (c.local || "").replace(/[;\n]/g, " ");
      return `${data};${membro};${membroTel};${eleitor};${eleitorTel};${confirmada};${missao};${local}`;
    }).join("\n");
    filename = `conversas-${new Date().toISOString().slice(0, 10)}.csv`;
  } else if (tipo === "membros") {
    const membros = await prisma.membro.findMany({
      include: { celula: true },
      orderBy: [{ celula: { nome: "asc" } }, { nome: "asc" }],
    });
    csv = "Nome;Apelido;Telefone;Celula;Cidade;Status;Tipo;Lideranca;Pontos;Streak;Referencia\n";
    csv += membros.map((m) => {
      const nome = m.nome.replace(/[;\n]/g, " ");
      const apelido = (m.apelido || "").replace(/[;\n]/g, " ");
      const telefone = m.telefone || "";
      const celula = m.celula.nome.replace(/[;\n]/g, " ");
      const cidade = m.celula.cidade;
      const status = m.status;
      const tipo = m.tipo;
      const lideranca = m.isLideranca ? "SIM" : "NAO";
      const referencia = (m.referencia || "").replace(/[;\n]/g, " ");
      return `${nome};${apelido};${telefone};${celula};${cidade};${status};${tipo};${lideranca};${m.pontos};${m.streak};${referencia}`;
    }).join("\n");
    filename = `membros-${new Date().toISOString().slice(0, 10)}.csv`;
  } else if (tipo === "celulas") {
    const celulas = await prisma.celula.findMany({
      include: { candidato: { select: { nome: true } }, _count: { select: { membros: true } } },
      orderBy: [{ cidade: "asc" }, { nome: "asc" }],
    });
    csv = "Nome;Cidade;Candidato;Membros;Pontos Totais\n";
    for (const c of celulas) {
      const pontosAgg = await prisma.membro.aggregate({
        where: { celulaId: c.id },
        _sum: { pontos: true },
      });
      csv += `${c.nome};${c.cidade};${c.candidato.nome};${c._count.membros};${pontosAgg._sum.pontos || 0}\n`;
    }
    filename = `celulas-${new Date().toISOString().slice(0, 10)}.csv`;
  } else {
    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  }

  const bom = "﻿";
  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
