import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NovaMissaoForm } from "./NovaMissaoForm";

export const dynamic = "force-dynamic";

async function getData() {
  const [missoes, candidato, celulas] = await Promise.all([
    prisma.missao.findMany({
      include: { celula: true, _count: { select: { conversas: true } } },
      orderBy: { data: "desc" },
    }),
    prisma.candidato.findFirst(),
    prisma.celula.findMany({ orderBy: { nome: "asc" } }),
  ]);
  return { missoes, candidato, celulas };
}

export default async function AdminMissoesPage() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");

  const { missoes, candidato, celulas } = await getData();

  return (
    <main style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>Missões</h1>
          <p style={{ color: "var(--celula-texto-secundario)", marginTop: 4 }}>
            {missoes.length} missões
          </p>
        </div>
        <Link href="/admin/dashboard" style={{ color: "var(--celula-acao)", textDecoration: "none", fontSize: 14 }}>
          ← Dashboard
        </Link>
      </header>

      {candidato && (
        <NovaMissaoForm candidatoId={candidato.id} celulas={celulas} />
      )}

      <div style={{ marginTop: 24, background: "var(--celula-superficie)", borderRadius: 12, overflow: "hidden" }}>
        {missoes.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--celula-texto-secundario)" }}>
            Nenhuma missão cadastrada
          </div>
        ) : (
          missoes.map((m, idx) => (
            <div
              key={m.id}
              style={{
                padding: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: idx < missoes.length - 1 ? "1px solid var(--celula-divisor)" : "none",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{m.titulo}</div>
                {m.descricao && (
                  <div style={{ fontSize: 13, color: "var(--celula-texto-secundario)", marginTop: 4 }}>
                    {m.descricao}
                  </div>
                )}
                <div style={{ fontSize: 13, color: "var(--celula-texto-secundario)", marginTop: 4 }}>
                  {m.celula?.nome || "Todas as células"} · meta: {m.metaConversas} · {new Date(m.data).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 14, color: "var(--celula-texto-secundario)" }}>
                  {m._count.conversas} conversas
                </span>
                <span
                  style={{
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: 8,
                    background: m.ativa ? "rgba(31, 107, 74, 0.08)" : "var(--celula-fundo)",
                    color: m.ativa ? "var(--celula-acao)" : "var(--celula-texto-secundario)",
                    fontWeight: 500,
                  }}
                >
                  {m.ativa ? "ativa" : "inativa"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
