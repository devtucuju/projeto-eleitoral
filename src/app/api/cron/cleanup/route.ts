import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cron/cleanup
// Anonimiza conversas não confirmadas há mais de 30 dias
// (Job diário - em produção chamar via cron ou Vercel Cron)
export async function GET(req: Request) {
  // Validação simples por header em produção (Bearer token)
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET || "dev-secret"}`;
  if (authHeader !== expected && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

  const result = await prisma.conversa.updateMany({
    where: {
      confirmada: false,
      createdAt: { lt: trintaDiasAtras },
    },
    data: {
      nomeEleitor: null,
      telefoneEleitor: null,
      observacao: null,
      local: null,
    },
  });

  return NextResponse.json({
    ok: true,
    anonimizadas: result.count,
    referencia: "conversas não confirmadas há mais de 30 dias",
  });
}
