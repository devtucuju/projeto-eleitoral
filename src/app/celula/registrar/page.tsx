"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/motion/Toaster";
import { HapticButton } from "@/components/motion/HapticButton";

export default function RegistrarPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  function formatTelefone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  async function handleEnviar() {
    if (telefone.replace(/\D/g, "").length < 10) return;
    setLoading(true);
    try {
      const resp = await fetch("/api/conversas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeEleitor: nome.trim() || null,
          telefoneEleitor: telefone.replace(/\D/g, ""),
        }),
      });
      if (!resp.ok) {
        toast.error("Erro ao registrar conversa");
        setLoading(false);
        return;
      }
      const data = await resp.json();
      const codigo = data?.codigoConf;
      if (codigo) {
        const msg = encodeURIComponent(
          `Oi! ${nome || "Tudo bem"}?\n\nFui eu que conversei com você. Confirma pra mim?\n\n${typeof window !== "undefined" ? window.location.origin : ""}/confirmar/${codigo}`
        );
        const tel = telefone.replace(/\D/g, "");
        window.open(`https://wa.me/55${tel}?text=${msg}`, "_blank");
        toast.success("Conversa registrada!", {
          description: "WhatsApp abriu com a mensagem de confirmação.",
        });
      }
      router.push("/celula/home");
    } catch {
      toast.error("Erro de conexão");
      setLoading(false);
    }
  }

  return (
    <main className="celula-mobile" style={{ display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "16px 16px 8px", display: "flex", alignItems: "center" }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            padding: 8,
            marginLeft: -8,
            cursor: "pointer",
          }}
          aria-label="Voltar"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 6l-6 6 6 6"
              stroke="var(--celula-acao)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span style={{ marginLeft: 4, fontSize: 17, fontWeight: 500 }}>Voltar</span>
      </header>

      <section style={{ padding: "32px 16px", flex: 1 }}>
        <div style={{ marginBottom: 24 }}>
          <label className="celula-label" htmlFor="nome">Nome</label>
          <input
            id="nome"
            className="celula-input"
            type="text"
            placeholder="Como se chama"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div style={{ marginBottom: 32 }}>
          <label className="celula-label" htmlFor="tel">WhatsApp</label>
          <input
            id="tel"
            className="celula-input"
            type="tel"
            inputMode="numeric"
            placeholder="(96) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(formatTelefone(e.target.value))}
            autoComplete="off"
          />
        </div>

        <HapticButton
          onClick={handleEnviar}
          disabled={loading || telefone.replace(/\D/g, "").length < 10}
        >
          {loading ? "Enviando…" : "Enviar confirmação no WhatsApp"}
        </HapticButton>

        <p
          className="celula-texto-sec"
          style={{ marginTop: 12, textAlign: "center" }}
        >
          Só conta se a pessoa confirmar
        </p>
      </section>
    </main>
  );
}
