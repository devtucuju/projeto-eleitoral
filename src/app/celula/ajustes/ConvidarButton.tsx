"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ConvidarButton({ codigo, nome }: { codigo: string; nome: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const link = typeof window !== "undefined" ? `${window.location.origin}/celula/auth?convite=${codigo}` : "";

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      if ("vibrate" in navigator) navigator.vibrate(10);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      if ("vibrate" in navigator) navigator.vibrate(10);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function compartilhar() {
    const msg = encodeURIComponent(
      `E aí! Bora fortalecer a campanha? Entra nesse link e se cadastra como cabo. Valeu!\n\n${link}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.97, backgroundColor: "rgba(31, 107, 74, 0.04)" }}
        className="celula-settings-row"
        onClick={() => setOpen(true)}
        style={{ borderBottom: "1px solid var(--celula-divisor)", background: "transparent", width: "100%", textAlign: "left", cursor: "pointer" }}
        type="button"
      >
        <span style={{ color: "var(--celula-acao)", fontWeight: 500 }}>+ Convidar cabo</span>
        <Chevron />
      </motion.button>

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--celula-fundo)",
              width: "100%",
              maxWidth: 480,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 24,
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>
              Convidar outro cabo
            </div>
            <p style={{ color: "var(--celula-texto-secundario)", fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
              Cada cabo que entrar pelo seu link te dá <strong>+20 pontos</strong>.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              style={{
                padding: 12,
                background: "var(--celula-superficie)",
                borderRadius: 12,
                fontSize: 13,
                color: "var(--celula-texto)",
                wordBreak: "break-all",
                marginBottom: 16,
                fontFamily: "monospace",
              }}
            >
              {link}
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={compartilhar}
              type="button"
              style={{
                width: "100%",
                height: 56,
                borderRadius: 14,
                background: "var(--celula-acao)",
                color: "white",
                fontSize: 17,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                marginBottom: 8,
              }}
            >
              Compartilhar no WhatsApp
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={copiar}
              type="button"
              style={{
                width: "100%",
                height: 56,
                borderRadius: 14,
                background: "transparent",
                color: "var(--celula-texto)",
                border: "1px solid var(--celula-divisor)",
                fontSize: 17,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {copied ? "✓ Copiado!" : "Copiar link"}
            </motion.button>
            <button
              onClick={() => setOpen(false)}
              type="button"
              style={{
                marginTop: 16,
                display: "block",
                width: "100%",
                background: "none",
                border: "none",
                color: "var(--celula-acao)",
                cursor: "pointer",
                padding: 8,
              }}
            >
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="var(--celula-texto-secundario)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
