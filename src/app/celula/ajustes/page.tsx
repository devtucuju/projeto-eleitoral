import { prisma } from "@/lib/prisma";
import { TabBar } from "../TabBar";
import { ConvidarButton } from "./ConvidarButton";
import { EsqueciButton } from "./EsqueciButton";

export const dynamic = "force-dynamic";

async function getMembro() {
  const membro = await prisma.membro.findFirst({
    select: {
      id: true, nome: true, apelido: true, codigoConvite: true,
      createdAt: true, status: true,
    },
  });
  return membro;
}

export default async function AjustesPage() {
  const membro = await getMembro();
  if (!membro) {
    return (
      <main className="celula-mobile" style={{ padding: 24 }}>
        <p>Sem dados no banco.</p>
      </main>
    );
  }

  const criadoEm = new Date(membro.createdAt).toLocaleDateString("pt-BR");

  return (
    <main className="celula-mobile" style={{ display: "flex", flexDirection: "column" }}>
      <section style={{ padding: "32px 16px 16px" }}>
        <div style={{ fontSize: 22, fontWeight: 600 }}>Ajustes</div>
      </section>

      <section style={{ margin: "0 16px", background: "var(--celula-superficie)", borderRadius: 12, overflow: "hidden" }}>
        <ConvidarButton codigo={membro.codigoConvite!} nome={membro.apelido || membro.nome} />
        <div className="celula-settings-row">
          <span>Conta</span>
          <span style={{ fontSize: 13, color: "var(--celula-texto-secundario)" }}>desde {criadoEm}</span>
        </div>
        <div className="celula-settings-row">
          <span>Time</span>
          <Chevron />
        </div>
        <div className="celula-settings-row">
          <span>Notificações</span>
          <Chevron />
        </div>
      </section>

      <section style={{ margin: "16px 16px 0" }}>
        <EsqueciButton />
      </section>

      <div style={{ flex: 1 }} />
      <div style={{ padding: "0 16px", textAlign: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "var(--celula-texto-secundario)" }}>Célula v0.3</span>
      </div>
      <TabBar />
    </main>
  );
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="var(--celula-texto-secundario)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
