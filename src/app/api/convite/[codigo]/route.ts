import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/convite/[codigo]
// Retorna dados do cabo que convidou (para mostrar "Convidado por X")
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;
  const membro = await prisma.membro.findUnique({
    where: { codigoConvite: codigo.toUpperCase() },
    include: { celula: true },
  });
  if (!membro) {
    return NextResponse.json({ error: "Convite inválido" }, { status: 404 });
  }
  return NextResponse.json({
    nome: membro.apelido || membro.nome,
    celula: membro.celula.nome,
    cidade: membro.celula.cidade,
  });
}
