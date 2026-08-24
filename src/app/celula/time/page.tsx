import { prisma } from "@/lib/prisma";
import { TabBar } from "../TabBar";
import { TimeTabs } from "./TimeTabs";

export const dynamic = "force-dynamic";

async function getData() {
  const membro = await prisma.membro.findFirst({ include: { celula: true } });
  if (!membro) return null;
  const ranking = await prisma.membro.findMany({
    where: { celulaId: membro.celulaId },
    orderBy: [{ pontos: "desc" }, { streak: "desc" }],
    take: 20,
  });
  return { membro, ranking, celulaId: membro.celulaId };
}

export default async function TimePage() {
  const data = await getData();
  if (!data) {
    return (
      <main className="celula-mobile" style={{ padding: 24 }}>
        <p>Sem dados no banco.</p>
      </main>
    );
  }
  return (
    <main className="celula-mobile" style={{ display: "flex", flexDirection: "column" }}>
      <section style={{ padding: "32px 16px 16px" }}>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>
          {data.membro.celula.nome}
        </div>
      </section>
      <TimeTabs ranking={data.ranking} celulaId={data.celulaId} meuId={data.membro.id} />
      <TabBar />
    </main>
  );
}
