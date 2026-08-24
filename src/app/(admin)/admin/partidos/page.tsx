import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PartidosManager } from "./PartidosManager";

export const dynamic = "force-dynamic";

async function getPartidos() {
  return prisma.partido.findMany({
    include: { _count: { select: { candidatos: true } } },
    orderBy: { sigla: "asc" },
  });
}

export default async function PartidosPage() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");
  const partidos = await getPartidos();
  return (
    <main style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>Partidos</h1>
          <p style={{ color: "var(--celula-texto-secundario)", marginTop: 4 }}>{partidos.length} cadastrados</p>
        </div>
        <Link href="/admin/dashboard" style={{ color: "var(--celula-acao)", textDecoration: "none", fontSize: 14 }}>← Dashboard</Link>
      </header>
      <PartidosManager initial={partidos} />
    </main>
  );
}
