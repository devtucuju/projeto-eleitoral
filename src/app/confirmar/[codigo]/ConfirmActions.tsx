"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/motion/Toaster";
import { Checkmark } from "@/components/motion/Checkmark";
import { Confetti } from "@/components/motion/Confetti";
import { HapticButton } from "@/components/motion/HapticButton";

export function ConfirmActions({ codigo }: { codigo: string }) {
  const [done, setDone] = useState<"sim" | "nao" | null>(null);
  const [loading, setLoading] = useState<"sim" | "nao" | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  async function responder(resposta: "sim" | "nao") {
    setLoading(resposta);
    try {
      const resp = await fetch(`/api/confirmacao/${codigo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resposta }),
      });
      if (resp.ok) {
        setDone(resposta);
        if (resposta === "sim") {
          // Vibração de sucesso + confetti
          if ("vibrate" in navigator) navigator.vibrate([10, 30, 10]);
          setConfettiTrigger((n) => n + 1);
          toast.success("Conversa confirmada!", {
            description: "Valeu! Esse cabo ganhou pontos.",
          });
        }
      } else {
        toast.error("Erro ao confirmar");
      }
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setLoading(null);
    }
  }

  if (done === "sim") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        <Confetti trigger={confettiTrigger}>
          <Checkmark size={100} />
        </Confetti>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            padding: 16,
            background: "rgba(31, 107, 74, 0.06)",
            borderRadius: 12,
            textAlign: "center",
            width: "100%",
          }}
        >
          <div style={{ fontSize: 17, color: "var(--celula-acao)", fontWeight: 600 }}>
            Confirmado!
          </div>
          <div style={{ fontSize: 13, color: "var(--celula-texto-secundario)", marginTop: 4 }}>
            Esse cabo ganhou pontos
          </div>
        </motion.div>
      </div>
    );
  }

  if (done === "nao") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          padding: 16,
          background: "var(--celula-superficie)",
          borderRadius: 12,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 15, color: "var(--celula-texto-secundario)" }}>
          Tudo bem. Obrigado mesmo assim.
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <HapticButton
        variant="primary"
        onClick={() => responder("sim")}
        disabled={loading !== null}
        hapticPattern={[10, 30, 10]}
      >
        {loading === "sim" ? "Confirmando…" : "Sim, conversei"}
      </HapticButton>
      <HapticButton
        variant="secondary"
        fullWidth
        onClick={() => responder("nao")}
        disabled={loading !== null}
      >
        {loading === "nao" ? "…" : "Não conversei"}
      </HapticButton>
    </div>
  );
}
