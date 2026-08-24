"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Celula = {
  id: string; nome: string; cidade: string;
  candidato: { id: string; nome: string };
  _count: { membros: number; missoes: number };
};
type Candidato = { id: string; nome: string };

export function CelulasManager({
  initial, candidatos, porCidade,
}: {
  initial: Celula[];
  candidatos: Candidato[];
  porCidade: Record<string, Celula[]>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("Macapá");
  const [candidatoId, setCandidatoId] = useState(candidatos[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function startEdit(c: Celula) {
    setEditId(c.id);
    setNome(c.nome);
    setCidade(c.cidade);
    setCandidatoId(c.candidato.id);
    setOpen(true);
  }
  function reset() {
    setEditId(null); setNome(""); setError("");
  }

  async function salvar() {
    setError("");
    if (!nome.trim() || !candidatoId) { setError("Nome e candidato obrigatórios"); return; }
    setLoading(true);
    try {
      const url = editId ? `/api/admin/celulas/${editId}` : "/api/admin/celulas";
      const method = editId ? "PATCH" : "POST";
      const resp = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cidade, candidatoId }),
      });
      const data = await resp.json();
      if (!resp.ok) { setError(data.error || "Erro"); return; }
      setOpen(false); reset(); router.refresh();
    } finally { setLoading(false); }
  }

  async function deletar(id: string) {
    if (!confirm("Excluir esta célula?")) return;
    const resp = await fetch(`/api/admin/celulas/${id}`, { method: "DELETE" });
    if (resp.ok) router.refresh();
    else { const d = await resp.json(); alert(d.error); }
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <button className="celula-btn-primario" onClick={() => { reset(); setOpen(true); }} type="button" style={{ maxWidth: 180 }}>
          + Nova célula
        </button>
      </div>

      {Object.entries(porCidade).map(([cidade, cells]) => (
        <section key={cidade} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{cidade}</h2>
          <div style={{ background: "var(--celula-superficie)", borderRadius: 12, overflow: "hidden" }}>
            {cells.map((c, idx) => (
              <div key={c.id} style={{
                padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: idx < cells.length - 1 ? "1px solid var(--celula-divisor)" : "none",
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{c.nome}</div>
                  <div style={{ fontSize: 13, color: "var(--celula-texto-secundario)", marginTop: 4 }}>
                    {c.candidato.nome} · {c._count.membros} membros · {c._count.missoes} missões
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => startEdit(c)} style={btnSecondary}>Editar</button>
                  <button onClick={() => deletar(c.id)} style={btnDanger}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }} onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--celula-superficie)", padding: 24, borderRadius: 12, width: "100%", maxWidth: 400 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>{editId ? "Editar" : "Nova"} célula</h2>
            <div style={{ marginBottom: 12 }}>
              <label className="celula-label">Nome do bairro</label>
              <input className="celula-input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Zerão" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="celula-label">Cidade</label>
              <input className="celula-input" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Macapá" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="celula-label">Candidato</label>
              <select className="celula-input" value={candidatoId} onChange={(e) => setCandidatoId(e.target.value)}>
                {candidatos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            {error && <div style={{ marginBottom: 12, padding: 10, background: "rgba(196,92,38,0.08)", borderRadius: 8, color: "var(--celula-streak)", fontSize: 13 }}>{error}</div>}
            <div style={{ display: "flex", gap: 8 }}>
              <button className="celula-btn-primario" onClick={salvar} disabled={loading} type="button" style={{ flex: 1 }}>{loading ? "Salvando..." : "Salvar"}</button>
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
