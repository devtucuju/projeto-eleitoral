import { getAdminFromCookie } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ExportarPage() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");

  return (
    <main style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <header style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>Exportar</h1>
          <p style={{ color: "var(--celula-texto-secundario)", marginTop: 4 }}>Baixar dados em CSV (separado por ponto-e-vírgula)</p>
        </div>
        <Link href="/admin/dashboard" style={{ color: "var(--celula-acao)", textDecoration: "none", fontSize: 14 }}>← Dashboard</Link>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <Card
          titulo="Conversas"
          descricao="Todas as conversas registradas, com dados do cabo, eleitor e confirmação."
          link="/api/admin/exportar?tipo=conversas"
        />
        <Card
          titulo="Membros"
          descricao="Lista completa de cabos e lideranças com pontos, streak e status."
          link="/api/admin/exportar?tipo=membros"
        />
        <Card
          titulo="Células"
          descricao="Resumo por célula: cidade, candidato, total de membros e pontos."
          link="/api/admin/exportar?tipo=celulas"
        />
      </div>

      <div style={{ marginTop: 24, padding: 16, background: "rgba(31, 107, 74, 0.06)", borderRadius: 12, fontSize: 13, color: "var(--celula-texto-secundario)" }}>
        Os arquivos são gerados em UTF-8 com BOM. Abrem direto no Excel e Google Sheets. Respeitam a LGPD: nome e telefone do eleitor só aparecem se a conversa foi confirmada.
      </div>
    </main>
  );
}

function Card({ titulo, descricao, link }: { titulo: string; descricao: string; link: string }) {
  return (
    <a
      href={link}
      style={{
        display: "block",
        padding: 20,
        background: "var(--celula-superficie)",
        border: "1px solid var(--celula-divisor)",
        borderRadius: 12,
        textDecoration: "none",
        color: "var(--celula-texto)",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{titulo}</div>
      <div style={{ fontSize: 13, color: "var(--celula-texto-secundario)", lineHeight: 1.5, marginBottom: 12 }}>{descricao}</div>
      <div style={{ fontSize: 13, color: "var(--celula-acao)", fontWeight: 500 }}>Baixar CSV →</div>
    </a>
  );
}
