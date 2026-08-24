import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TabBar } from "../TabBar";
import { Counter } from "@/components/motion/Counter";
import { ProgressBar } from "@/components/motion/ProgressBar";
import { HomeMotion } from "./HomeMotion";

export const dynamic = "force-dynamic";

async function getHome() {
  const membro = await prisma.membro.findFirst({ include: { celula: true } });
  if (!membro) return null;
  const missao = await prisma.missao.findFirst({ where: { ativa: true }, orderBy: { data: "desc" } });

  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje); amanha.setDate(amanha.getDate() + 1);

  const conversasHoje = await prisma.conversa.count({
    where: { membroId: membro.id, createdAt: { gte: hoje, lt: amanha } },
  });

  const meta = missao?.metaConversas ?? 5;

  return { membro, missao, conversasHoje, meta };
}

export default async function HomePage() {
  const data = await getHome();

  if (!data) {
    return (
      <main className="celula-mobile" style={{ padding: 24 }}>
        <p>Sem dados no banco ainda. Rode <code>npm run db:seed</code>.</p>
      </main>
    );
  }

  const { membro, missao, conversasHoje, meta } = data;
  const restantes = Math.max(0, meta - conversasHoje);
  const pendente = membro.status === "pendente";

  return (
    <main className="celula-mobile" style={{ display: "flex", flexDirection: "column" }}>
      <HomeMotion
        conversasHoje={conversasHoje}
        meta={meta}
        pendente={pendente}
        missao={missao}
        streak={membro.streak}
        restantes={restantes}
      />
      <TabBar />
    </main>
  );
}
