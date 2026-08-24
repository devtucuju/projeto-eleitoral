import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CelulasManager } from "./CelulasManager";

export const dynamic = "force-dynamic";

async function getData() {
  const [celulas, candidatos] = await Promise.all([
    prisma.celula.findMany({
      include: {
        candidato: { select: { id: true, nome: true } },
        _count: { select: { membros: true, missoes: true } },
      },
      orderBy: [{ cidade: "asc" }, { nome: "asc" }],
    }),
    prisma.candidato.findMany({ orderBy: { nome: "asc" } }),
  ]);
  return { celulas, candidatos };
}

export default async function CelulasPage() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");
  const { celulas, candidatos } = await getData();

  // Agrupa por cidade
  const porCidade = celulas.reduce((acc, c) => {
    if (!acc[c.cidade]) acc[c.cidade] = [];
    acc[c.cidade].push(c);
    return acc;
  }, {} as Record<string, typeof celulas>);

  return (
    <main style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>Células</h1>
          <p style={{ color: "var(--celula-texto-secundario)", marginTop: 4 }}>{celulas.length} cadastradas · {Object.keys(porCidade).length} municípios</p>
        </div>
        <Link href="/admin/dashboard" style={{ color: "var(--celula-acao)", textDecoration: "none", fontSize: 14 }}>← Dashboard</Link>
      </header>
      <CelulasManager initial={celulas} candidatos={candidatos} porCidade={porCidade} />
    </main>
  );
}
