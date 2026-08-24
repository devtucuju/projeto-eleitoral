"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { HapticButton } from "@/components/motion/HapticButton";

function Logo() {
  return (
    <motion.svg
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      width="40"
      height="40"
      viewBox="0 0 32 32"
      fill="none"
      aria-label="Célula"
    >
      <path d="M16 3c-5 0-9 4-9 9 0 6.5 9 17 9 17s9-10.5 9-17c0-5-4-9-9-9z" fill="var(--celula-acao)" />
      <circle cx="16" cy="12" r="3.2" fill="var(--celula-fundo)" />
    </motion.svg>
  );
}

function AuthInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codigoConvite = searchParams.get("convite") || "";
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  function formatTelefone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  async function handleContinuar() {
    if (telefone.replace(/\D/g, "").length < 10) {
      // Shake animation quando telefone inválido
      setShake(true);
      setTimeout(() => setShake(false), 400);
      if ("vibrate" in navigator) navigator.vibrate(50);
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch("/api/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefone: telefone.replace(/\D/g, "") }),
      });
      if (resp.status === 202) {
        const qs = codigoConvite ? `?tel=${telefone.replace(/\D/g, "")}&convite=${codigoConvite}` : `?tel=${telefone.replace(/\D/g, "")}`;
        router.push(`/celula/cadastro${qs}`);
        return;
      }
      if (!resp.ok) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        setLoading(false);
        return;
      }
      router.push("/celula/home");
    } catch {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setLoading(false);
    }
  }

  return (
    <main
      className="celula-mobile"
      style={{ padding: "0 16px", display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 80,
        }}
      >
        <Logo />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: 12, fontSize: 17, fontWeight: 500 }}
        >
          Célula
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: 6, fontSize: 13, color: "var(--celula-texto-secundario)", textAlign: "center" }}
        >
          conversa → voto confirmado
        </motion.div>
      </motion.div>

      <div style={{ marginTop: "auto", paddingBottom: 60 }}>
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 32 }}
        >
          <label className="celula-label" htmlFor="tel">Telefone</label>
          <input
            id="tel"
            className="celula-input"
            type="tel"
            inputMode="numeric"
            placeholder="(96) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(formatTelefone(e.target.value))}
            autoComplete="tel"
          />
        </motion.div>

        <HapticButton
          onClick={handleContinuar}
          disabled={loading}
          hapticPattern={[15, 50]}
        >
          {loading ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span>Carregando</span>
              <Dot delay={0} />
              <Dot delay={0.15} />
              <Dot delay={0.3} />
            </span>
          ) : "Continuar"}
        </HapticButton>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button
            type="button"
            className="celula-link"
            onClick={() => router.push(`/celula/cadastro${codigoConvite ? `?convite=${codigoConvite}` : ""}`)}
          >
            Criar conta
          </button>
        </div>
      </div>
    </main>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1, repeat: Infinity, delay }}
      style={{
        width: 4,
        height: 4,
        background: "white",
        borderRadius: "50%",
      }}
    />
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<main className="celula-mobile" style={{ padding: 24 }}>Carregando…</main>}>
      <AuthInner />
    </Suspense>
  );
}
