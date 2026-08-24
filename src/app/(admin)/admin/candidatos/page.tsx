import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CandidatosManager } from "./CandidatosManager";

export const dynamic = "force-dynamic";

async function getData() {
  const [candidatos, partidos] = await Promise.all([
    prisma.candidato.findMany({
      include: { partido: true, _count: { select: { celulas: true, missoes: true } } },
      orderBy: { nome: "asc" },
    }),
    prisma.partido.findMany({ orderBy: { sigla: "asc" } }),
  ]);
  return { candidatos, partidos };
}

export default async function CandidatosPage() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");
  const { candidatos, partidos } = await getData();
  return (
    <main style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>Candidatos</h1>
          <p style={{ color: "var(--celula-texto-secundario)", marginTop: 4 }}>{candidatos.length} cadastrados</p>
        </div>
        <Link href="/admin/dashboard" style={{ color: "var(--celula-acao)", textDecoration: "none", fontSize: 14 }}>← Dashboard</Link>
      </header>
      <CandidatosManager initial={candidatos} partidos={partidos} />
    </main>
  );
}
