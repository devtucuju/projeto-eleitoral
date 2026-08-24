"use client";

import { useRouter } from "next/navigation";

export default function CadastroSucessoPage() {
  const router = useRouter();
  return (
    <main className="celula-mobile" style={{ padding: 24, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ fontSize: 64, textAlign: "center", marginTop: 80 }}>✅</div>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 16, textAlign: "center" }}>
        Cadastro enviado!
      </h1>
      <p style={{ marginTop: 12, color: "var(--celula-texto-secundario)", fontSize: 15, textAlign: "center", lineHeight: 1.5 }}>
        O coordenador da sua célula vai liberar seu acesso. Você será avisado por WhatsApp quando estiver liberado.
      </p>

      <div style={{ flex: 1 }} />

      <button
        className="celula-btn-primario"
        onClick={() => router.push("/celula/auth")}
        type="button"
      >
        Voltar pro início
      </button>
      <div style={{ height: 32 }} />
    </main>
  );
}
