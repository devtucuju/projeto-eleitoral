"use client";

import { useState } from "react";

export function EsqueciButton() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"aviso" | "ok">("aviso");
  const [loading, setLoading] = useState(false);
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function pedir() {
    setLoading(true);
    try {
      const resp = await fetch("/api/esqueci", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefone }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setMensagem(data.mensagem || "Dados removidos");
        setStep("ok");
      } else {
        setMensagem(data.error || "Erro");
        setStep("ok");
      }
    } finally {
      setLoading(false);
    }
  }

  function formatTelefone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  return (
    <>
      <button
        onClick={() => { setOpen(true); setStep("aviso"); setMensagem(""); }}
        type="button"
        style={{
          padding: "12px 16px",
          width: "100%",
          background: "transparent",
          color: "var(--celula-streak)",
          border: "1px solid var(--celula-streak)",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        Esqueci meus dados
      </button>

      {open && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--celula-fundo)", width: "100%", maxWidth: 480, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24 }}
          >
            {step === "aviso" ? (
              <>
                <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Remover seus dados?</div>
                <p style={{ color: "var(--celula-texto-secundario)", fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
                  Vamos apagar seu nome, telefone e anotações. Você continua contando nos pontos da campanha, mas sem vínculo com seus dados pessoais.
                </p>
                <div style={{ marginBottom: 16 }}>
                  <label className="celula-label">Confirme seu telefone</label>
                  <input
                    className="celula-input"
                    type="tel"
                    inputMode="numeric"
                    placeholder="(96) 99999-9999"
                    value={telefone}
                    onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                  />
                </div>
                <button
                  className="celula-btn-primario"
                  onClick={pedir}
                  disabled={loading || telefone.replace(/\D/g, "").length < 10}
                  type="button"
                  style={{ background: "var(--celula-streak)", marginBottom: 8 }}
                >
                  {loading ? "Removendo..." : "Remover meus dados"}
                </button>
                <button className="celula-link" onClick={() => setOpen(false)} type="button" style={{ marginTop: 8, display: "block", width: "100%" }}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48, textAlign: "center", marginBottom: 8 }}>✓</div>
                <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, textAlign: "center" }}>Pronto</div>
                <p style={{ color: "var(--celula-texto-secundario)", fontSize: 14, lineHeight: 1.5, textAlign: "center", marginBottom: 16 }}>
                  {mensagem}
                </p>
                <button className="celula-btn-primario" onClick={() => setOpen(false)} type="button">
                  Fechar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
