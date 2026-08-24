"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Celula = { id: string; nome: string; cidade: string };

function CadastroInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const telefoneParam = searchParams.get("tel") || "";
  const codigoConvite = searchParams.get("convite") || "";

  const [telefone, setTelefone] = useState(telefoneParam);
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [cidade, setCidade] = useState("Macapá");
  const [celulas, setCelulas] = useState<Celula[]>([]);
  const [celulaId, setCelulaId] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [convidadoPor, setConvidadoPor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Carrega células
  useEffect(() => {
    fetch(`/api/celulas?cidade=${cidade}`)
      .then((r) => r.json())
      .then((data) => {
        setCelulas(data);
        if (data.length > 0 && !celulaId) setCelulaId(data[0].id);
      })
      .catch(() => {});
  }, [cidade]);

  // Carrega dados do convite (se houver)
  useEffect(() => {
    if (codigoConvite) {
      fetch(`/api/convite/${codigoConvite}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.nome) setConvidadoPor(`${data.nome} (${data.celula})`);
        })
        .catch(() => {});
    }
  }, [codigoConvite]);

  // Lista de cidades disponíveis (mock - em produção viria do banco)
  const cidades = ["Macapá", "Santana", "Oiapoque", "Calçoene", "Laranjal do Jari", "Amapá", "Ferreira Gomes", "Itaubal", "Pedra Branca", "Porto Grande", "Vitória do Jari", "Cutiás"];

  async function handleCadastrar() {
    setError("");
    if (nome.length < 2) return setError("Nome obrigatório");
    if (!celulaId) return setError("Selecione uma célula");
    if (!aceitouTermos) return setError("Aceite os termos para continuar");

    setLoading(true);
    try {
      const resp = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telefone,
          nome,
          apelido: apelido || null,
          municipio: cidade,
          celulaId,
          aceitouTermos,
          paiId: null, // TODO: mapear codigoConvite → membroId.paiId
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || "Erro ao cadastrar");
        setLoading(false);
        return;
      }
      // Sucesso: vai pra tela de "aguardando aprovação"
      router.push(`/celula/cadastro/sucesso?status=${data.status}`);
    } catch {
      setError("Erro de conexão");
      setLoading(false);
    }
  }

  return (
    <main className="celula-mobile" style={{ padding: "0 16px", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header style={{ paddingTop: 32, marginBottom: 24 }}>
        <div className="celula-texto-sec">Criar conta</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>Vamos te cadastrar</h1>
        {convidadoPor && (
          <div style={{ marginTop: 12, padding: 12, background: "rgba(31, 107, 74, 0.06)", borderRadius: 12, fontSize: 13 }}>
            Convidado por <strong>{convidadoPor}</strong>
          </div>
        )}
      </header>

      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <label className="celula-label">Telefone</label>
          <input
            className="celula-input"
            type="tel"
            value={telefone}
            disabled
            style={{ background: "var(--celula-fundo)" }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="celula-label">Nome completo</label>
          <input
            className="celula-input"
            type="text"
            placeholder="Como aparece no RG"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="celula-label">Apelido (opcional)</label>
          <input
            className="celula-input"
            type="text"
            placeholder="Como te chamam"
            value={apelido}
            onChange={(e) => setApelido(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="celula-label">Município</label>
          <select
            className="celula-input"
            value={cidade}
            onChange={(e) => {
              setCidade(e.target.value);
              setCelulaId("");
            }}
          >
            {cidades.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="celula-label">Célula (bairro)</label>
          <select
            className="celula-input"
            value={celulaId}
            onChange={(e) => setCelulaId(e.target.value)}
          >
            <option value="">Selecione</option>
            {celulas.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <label style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={aceitouTermos}
            onChange={(e) => setAceitouTermos(e.target.checked)}
            style={{ marginTop: 2 }}
          />
          <span style={{ fontSize: 13, color: "var(--celula-texto-secundario)", lineHeight: 1.4 }}>
            Aceito que meus dados de conversas sejam registrados para organização da campanha. Posso pedir exclusão a qualquer momento em Ajustes.
          </span>
        </label>

        {error && (
          <div style={{ marginBottom: 12, padding: 12, background: "rgba(196, 92, 38, 0.08)", borderRadius: 12, color: "var(--celula-streak)", fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      <div style={{ paddingBottom: 32 }}>
        <button
          className="celula-btn-primario"
          onClick={handleCadastrar}
          disabled={loading}
          type="button"
        >
          {loading ? "Cadastrando…" : "Cadastrar"}
        </button>
      </div>
    </main>
  );
}

export default function CadastroPage() {
  return (
    <Suspense fallback={<main className="celula-mobile" style={{ padding: 24 }}>Carregando…</main>}>
      <CadastroInner />
    </Suspense>
  );
}
