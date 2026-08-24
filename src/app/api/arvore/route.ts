import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/arvore?celulaId=...
// Retorna a árvore de indicações da célula (raiz = quem não tem pai)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const celulaId = searchParams.get("celulaId");
  if (!celulaId) {
    return NextResponse.json({ error: "celulaId obrigatório" }, { status: 400 });
  }

  const membros = await prisma.membro.findMany({
    where: { celulaId },
    select: {
      id: true, nome: true, apelido: true, paiId: true,
      pontos: true, streak: true, isLideranca: true,
    },
    orderBy: [{ isLideranca: "desc" }, { pontos: "desc" }],
  });

  type Node = typeof membros[number] & { filhos: Node[]; nivel: number };
  const byId = new Map<string, Node>();
  for (const m of membros) {
    byId.set(m.id, { ...m, filhos: [], nivel: 0 });
  }

  const raizes: Node[] = [];
  for (const m of membros) {
    const node = byId.get(m.id)!;
    if (m.paiId && byId.has(m.paiId)) {
      const pai = byId.get(m.paiId)!;
      pai.filhos.push(node);
      node.nivel = pai.nivel + 1;
    } else {
      raizes.push(node);
    }
  }

  function sortFilhos(nodes: Node[]) {
    nodes.sort((a, b) => b.pontos - a.pontos);
    nodes.forEach((n) => sortFilhos(n.filhos));
  }
  sortFilhos(raizes);

  return NextResponse.json({
    raizes, total: membros.length, raizesCount: raizes.length,
  });
}
