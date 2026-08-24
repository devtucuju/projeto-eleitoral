"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Candidato = {
  id: string; nome: string; apelido: string | null; numero: number;
  cargo: string; foto: string | null; ativo: boolean;
  partido: { id: string; sigla: string; nome: string };
  _count: { celulas: number; missoes: number };
};
type Partido = { id: string; sigla: string; nome: string };

export function CandidatosManager({ initial, partidos }: { initial: Candidato[]; partidos: Partido[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [numero, setNumero] = useState("");
  const [cargo, setCargo] = useState("Deputado Estadual");
  const [partidoId, setPartidoId] = useState(partidos[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function startEdit(c: Candidato) {
    setEditId(c.id);
    setNome(c.nome);
    setApelido(c.apelido || "");
    setNumero(String(c.numero));
    setCargo(c.cargo);
    setPartidoId(c.partido.id);
    setOpen(true);
  }
  function reset() {
    setEditId(null); setNome(""); setApelido(""); setNumero(""); setError("");
  }

  async function salvar() {
    setError("");
    if (!nome.trim() || !numero || !partidoId) { setError("Nome, número e partido obrigatórios"); return; }
    setLoading(true);
    try {
      const url = editId ? `/api/admin/candidatos/${editId}` : "/api/admin/candidatos";
      const method = editId ? "PATCH" : "POST";
      const resp = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, apelido: apelido || null, numero: Number(numero), cargo, partidoId }),
      });
      const data = await resp.json();
      if (!resp.ok) { setError(data.error || "Erro"); return; }
      setOpen(false); reset(); router.refresh();
    } finally { setLoading(false); }
  }

  async function deletar(id: string) {
    if (!confirm("Excluir este candidato?")) return;
    const resp = await fetch(`/api/admin/candidatos/${id}`, { method: "DELETE" });
    if (resp.ok) router.refresh();
    else { const d = await resp.json(); alert(d.error); }
  }

  async function toggleAtivo(c: Candidato) {
    await fetch(`/api/admin/candidatos/${c.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !c.ativo }),
    });
    router.refresh();
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <button className="celula-btn-primario" onClick={() => { reset(); setOpen(true); }} type="button" style={{ maxWidth: 180 }}>
          + Novo candidato
        </button>
      </div>

      <div style={{ background: "var(--celula-superficie)", borderRadius: 12, overflow: "hidden" }}>
        {initial.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--celula-texto-secundario)" }}>Nenhum candidato</div>
        ) : initial.map((c, idx) => (
          <div key={c.id} style={{
            padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: idx < initial.length - 1 ? "1px solid var(--celula-divisor)" : "none", opacity: c.ativo ? 1 : 0.5,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{c.nome}</div>
              {c.apelido && <div style={{ fontSize: 13, color: "var(--celula-texto-secundario)" }}>"{c.apelido}"</div>}
              <div style={{ fontSize: 13, color: "var(--celula-texto-secundario)", marginTop: 4 }}>
                {c.cargo} · {c.partido.sigla} · {c.numero} · {c._count.celulas} células · {c._count.missoes} missões
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => toggleAtivo(c)} style={btnGhost}>{c.ativo ? "Desativar" : "Ativar"}</button>
              <button onClick={() => startEdit(c)} style={btnSecondary}>Editar</button>
              <button onClick={() => deletar(c.id)} style={btnDanger}>Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }} onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--celula-superficie)", padding: 24, borderRadius: 12, width: "100%", maxWidth: 400 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>{editId ? "Editar" : "Novo"} candidato</h2>
            <div style={{ marginBottom: 12 }}>
              <label className="celula-label">Nome</label>
              <input className="celula-input" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="celula-label">Apelido</label>
              <input className="celula-input" value={apelido} onChange={(e) => setApelido(e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label className="celula-label">Cargo</label>
                <select className="celula-input" value={cargo} onChange={(e) => setCargo(e.target.value)}>
                  <option>Deputado Estadual</option>
                  <option>Deputado Federal</option>
                  <option>Vereador</option>
                  <option>Prefeito</option>
                  <option>Vice-Prefeito</option>
                  <option>Senador</option>
                  <option>Governador</option>
                </select>
              </div>
              <div>
                <label className="celula-label">Número</label>
                <input className="celula-input" type="number" value={numero} onChange={(e) => setNumero(e.target.value)} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="celula-label">Partido</label>
              <select className="celula-input" value={partidoId} onChange={(e) => setPartidoId(e.target.value)}>
                {partidos.map((p) => <option key={p.id} value={p.id}>{p.sigla} - {p.nome}</option>)}
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
