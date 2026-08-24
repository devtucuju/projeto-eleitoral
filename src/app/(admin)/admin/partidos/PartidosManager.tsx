"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Partido = {
  id: string; nome: string; sigla: string; numero: number;
  cor: string | null; ativo: boolean;
  _count: { candidatos: number };
};

export function PartidosManager({ initial }: { initial: Partido[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [numero, setNumero] = useState("");
  const [cor, setCor] = useState("#1F6B4A");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function startEdit(p: Partido) {
    setEditId(p.id);
    setNome(p.nome);
    setSigla(p.sigla);
    setNumero(String(p.numero));
    setCor(p.cor || "#1F6B4A");
    setOpen(true);
  }

  function reset() {
    setEditId(null); setNome(""); setSigla(""); setNumero(""); setCor("#1F6B4A"); setError("");
  }

  async function salvar() {
    setError("");
    if (!nome.trim() || !sigla.trim() || !numero) {
      setError("Preencha nome, sigla e número");
      return;
    }
    setLoading(true);
    try {
      const url = editId ? `/api/admin/partidos/${editId}` : "/api/admin/partidos";
      const method = editId ? "PATCH" : "POST";
      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, sigla, numero: Number(numero), cor }),
      });
      const data = await resp.json();
      if (!resp.ok) { setError(data.error || "Erro"); return; }
      setOpen(false); reset(); router.refresh();
    } finally { setLoading(false); }
  }

  async function deletar(id: string) {
    if (!confirm("Excluir este partido?")) return;
    const resp = await fetch(`/api/admin/partidos/${id}`, { method: "DELETE" });
    if (resp.ok) router.refresh();
    else {
      const data = await resp.json();
      alert(data.error || "Erro");
    }
  }

  async function toggleAtivo(p: Partido) {
    await fetch(`/api/admin/partidos/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !p.ativo }),
    });
    router.refresh();
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <button className="celula-btn-primario" onClick={() => { reset(); setOpen(true); }} type="button" style={{ maxWidth: 180 }}>
          + Novo partido
        </button>
      </div>

      <div style={{ background: "var(--celula-superficie)", borderRadius: 12, overflow: "hidden" }}>
        {initial.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--celula-texto-secundario)" }}>Nenhum partido</div>
        ) : initial.map((p, idx) => (
          <div key={p.id} style={{
            padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: idx < initial.length - 1 ? "1px solid var(--celula-divisor)" : "none", opacity: p.ativo ? 1 : 0.5,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: p.cor || "#1F6B4A" }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{p.nome}</div>
                <div style={{ fontSize: 13, color: "var(--celula-texto-secundario)" }}>
                  {p.sigla} · {p.numero} · {p._count.candidatos} candidatos
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => toggleAtivo(p)} style={btnGhost}>{p.ativo ? "Desativar" : "Ativar"}</button>
              <button onClick={() => startEdit(p)} style={btnSecondary}>Editar</button>
              <button onClick={() => deletar(p.id)} style={btnDanger}>Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }} onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--celula-superficie)", padding: 24, borderRadius: 12, width: "100%", maxWidth: 400 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>{editId ? "Editar" : "Novo"} partido</h2>
            <div style={{ marginBottom: 12 }}>
              <label className="celula-label">Nome</label>
              <input className="celula-input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Partido de Apoio" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label className="celula-label">Sigla</label>
                <input className="celula-input" value={sigla} onChange={(e) => setSigla(e.target.value.toUpperCase())} placeholder="PDA" maxLength={6} />
              </div>
              <div>
                <label className="celula-label">Número</label>
                <input className="celula-input" type="number" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="99999" />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="celula-label">Cor</label>
              <input className="celula-input" type="color" value={cor} onChange={(e) => setCor(e.target.value)} style={{ height: 52 }} />
            </div>
            {error && <div style={{ marginBottom: 12, padding: 10, background: "rgba(196,92,38,0.08)", borderRadius: 8, color: "var(--celula-streak)", fontSize: 13 }}>{error}</div>}
            <div style={{ display: "flex", gap: 8 }}>
              <button className="celula-btn-primario" onClick={salvar} disabled={loading} type="button" style={{ flex: 1 }}>
                {loading ? "Salvando..." : "Salvar"}
              </button>
              <button onClick={() => { setOpen(false); reset(); }} type="button" style={btnGhost}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const btnGhost: React.CSSProperties = { padding: "6px 12px", background: "transparent", border: "1px solid var(--celula-divisor)", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "var(--celula-texto-secundario)" };
const btnSecondary: React.CSSProperties = { padding: "6px 12px", background: "transparent", color: "var(--celula-acao)", border: "1px solid var(--celula-acao)", borderRadius: 8, fontSize: 13, cursor: "pointer" };
const btnDanger: React.CSSProperties = { padding: "6px 12px", background: "transparent", color: "var(--celula-streak)", border: "1px solid var(--celula-streak)", borderRadius: 8, fontSize: 13, cursor: "pointer" };
