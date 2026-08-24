"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Celula = { id: string; nome: string; cidade: string };

export function NovaMissaoForm({
  candidatoId,
  celulas,
}: {
  candidatoId: string;
  celulas: Celula[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [tipo, setTipo] = useState("feira");
  const [meta, setMeta] = useState(5);
  const [celulaId, setCelulaId] = useState("");
  const [loading, setLoading] = useState(false);

  async function criar() {
    if (!titulo.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch("/api/admin/missoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descricao: descricao || null,
          local: local || null,
          tipo,
          metaConversas: meta,
          candidatoId,
          celulaId: celulaId || null,
        }),
      });
      if (resp.ok) {
        setOpen(false);
        setTitulo("");
        setDescricao("");
        setLocal("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        className="celula-btn-primario"
        onClick={() => setOpen(true)}
        type="button"
        style={{ maxWidth: 200 }}
      >
        + Nova missão
      </button>
    );
  }

  return (
    <div style={{ background: "var(--celula-superficie)", padding: 24, borderRadius: 12, border: "1px solid var(--celula-divisor)" }}>
      <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>Nova missão</h2>

      <div style={{ marginBottom: 12 }}>
        <label className="celula-label">Título</label>
        <input className="celula-input" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Conversar com vizinhos da feira" />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label className="celula-label">Descrição</label>
        <input className="celula-input" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhes (opcional)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label className="celula-label">Local</label>
          <input className="celula-input" value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Ex: Feira do Zerão" />
        </div>
        <div>
          <label className="celula-label">Tipo</label>
          <select className="celula-input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="feira">Feira</option>
            <option value="porta-a-porta">Porta a porta</option>
            <option value="evento">Evento</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label className="celula-label">Meta de conversas</label>
          <input className="celula-input" type="number" min={1} value={meta} onChange={(e) => setMeta(Number(e.target.value))} />
        </div>
        <div>
          <label className="celula-label">Célula</label>
          <select className="celula-input" value={celulaId} onChange={(e) => setCelulaId(e.target.value)}>
            <option value="">Todas</option>
            {celulas.map((c) => (
              <option key={c.id} value={c.id}>{c.nome} ({c.cidade})</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="celula-btn-primario" onClick={criar} disabled={loading} type="button" style={{ flex: 1 }}>
          {loading ? "Criando…" : "Criar"}
        </button>
        <button
          onClick={() => setOpen(false)}
          type="button"
          style={{
            padding: "0 24px",
            background: "transparent",
            border: "1px solid var(--celula-divisor)",
            borderRadius: 14,
            color: "var(--celula-texto)",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
