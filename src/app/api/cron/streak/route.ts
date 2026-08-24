import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cron/streak
// Reseta streak de quem não confirmou conversa ontem
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET || "dev-secret"}`;
  if (authHeader !== expected && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Quem tem streak > 0 mas nenhuma conversa confirmada hoje nem ontem
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);

  // Membros com streak mas sem confirmação hoje nem ontem
  const membrosComStreak = await prisma.membro.findMany({
    where: { streak: { gt: 0 } },
    select: {
      id: true,
      conversas: {
        where: {
          confirmada: true,
          confirmadaEm: { gte: ontem, lt: amanha },
        },
        select: { id: true },
      },
    },
  });

  let resetados = 0;
  for (const m of membrosComStreak) {
    if (m.conversas.length === 0) {
      await prisma.membro.update({
        where: { id: m.id },
        data: { streak: 0 },
      });
      resetados++;
    }
  }

  return NextResponse.json({
    ok: true,
    resetados,
    total: membrosComStreak.length,
  });
}
