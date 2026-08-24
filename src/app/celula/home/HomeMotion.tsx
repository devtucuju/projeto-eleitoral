"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Counter } from "@/components/motion/Counter";
import { ProgressBar } from "@/components/motion/ProgressBar";
import { HapticButton } from "@/components/motion/HapticButton";

type Missao = { id: string; titulo: string; local: string | null; data: Date; metaConversas: number };

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export function HomeMotion({
  conversasHoje, meta, pendente, missao, streak, restantes,
}: {
  conversasHoje: number; meta: number; pendente: boolean;
  missao: Missao | null; streak: number; restantes: number;
}) {
  return (
    <>
      <section style={{ padding: "32px 16px 16px" }}>
        {pendente && (
          <motion.div
            {...fadeIn(0)}
            style={{
              marginBottom: 16,
              padding: 12,
              background: "rgba(196, 92, 38, 0.08)",
              borderRadius: 12,
              fontSize: 13,
              color: "var(--celula-streak)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ⏳
            </motion.span>
            Aguardando aprovação do coordenador
          </motion.div>
        )}

        <motion.div {...fadeIn(0.1)} className="celula-texto-sec">Hoje</motion.div>

        <motion.div {...fadeIn(0.2)} style={{ marginTop: 24, marginBottom: 8, display: "flex", alignItems: "baseline" }}>
          <span className="celula-numero">
            <Counter value={conversasHoje} duration={700} />
          </span>
          <span style={{ fontSize: 22, color: "var(--celula-texto-secundario)", margin: "0 4px" }}>/</span>
          <span className="celula-numero" style={{ color: "var(--celula-texto-secundario)" }}>
            {meta}
          </span>
        </motion.div>
        <motion.div {...fadeIn(0.25)} className="celula-texto-sec">conversas</motion.div>

        <motion.div {...fadeIn(0.3)} style={{ marginTop: 16, marginBottom: 8 }}>
          <ProgressBar value={conversasHoje} max={meta} />
        </motion.div>

        <motion.div {...fadeIn(0.4)} style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 6 }}>
          <motion.span
            animate={streak > 0 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            style={{ fontSize: 14 }}
          >
            🔥
          </motion.span>
          <span className="celula-streak">
            <Counter value={streak} duration={500} /> dias
          </span>
        </motion.div>

        {missao && (
          <motion.div
            {...fadeIn(0.5)}
            whileHover={{ y: -2 }}
            style={{
              marginTop: 24,
              padding: 16,
              background: "var(--celula-superficie)",
              borderRadius: 12,
              border: "1px solid transparent",
              transition: "border-color 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--celula-acao)" }} className="animate-pulse" />
              <div className="celula-texto-sec" style={{ textTransform: "uppercase", fontSize: 11, letterSpacing: 1 }}>Missão</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, marginTop: 8 }}>{missao.titulo}</div>
            {missao.local && (
              <div className="celula-texto-sec" style={{ marginTop: 4 }}>{missao.local}</div>
            )}
          </motion.div>
        )}
      </section>

      <div style={{ flex: 1 }} />

      <motion.section {...fadeIn(0.6)} style={{ padding: "0 16px 16px" }}>
        <motion.div
          key={conversasHoje} // re-anima quando muda
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: 16,
            color: "var(--celula-texto-secundario)",
            fontSize: 15,
            textAlign: "center",
          }}
        >
          {pendente
            ? "Você será avisado quando liberado."
            : conversasHoje === 0
              ? "Vamos pra primeira?"
              : restantes === 0
                ? "Meta batida. Quer fechar mais uma? 🎯"
                : `Faltam ${restantes} conversa${restantes > 1 ? "s" : ""} pra meta.`}
        </motion.div>
        {pendente ? (
          <HapticButton disabled hapticPattern={[]}>Aguardando aprovação</HapticButton>
        ) : (
          <Link href="/celula/registrar" style={{ textDecoration: "none", display: "block" }}>
            <HapticButton hapticPattern={20}>Nova conversa</HapticButton>
          </Link>
        )}
      </motion.section>
    </>
  );
}
