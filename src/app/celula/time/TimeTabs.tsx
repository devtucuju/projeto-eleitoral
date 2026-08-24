"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Counter } from "@/components/motion/Counter";

type Membro = {
  id: string; nome: string; apelido: string | null;
  pontos: number; streak: number; isLideranca: boolean;
};

export function TimeTabs({ ranking, celulaId, meuId }: { ranking: Membro[]; celulaId: string; meuId: string }) {
  const [tab, setTab] = useState<"ranking" | "arvore">("ranking");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          margin: "0 16px 16px",
          background: "var(--celula-superficie)",
          borderRadius: 12,
          padding: 4,
        }}
      >
        <TabBtn ativo={tab === "ranking"} onClick={() => setTab("ranking")}>Ranking</TabBtn>
        <TabBtn ativo={tab === "arvore"} onClick={() => setTab("arvore")}>Árvore</TabBtn>
      </motion.div>

      <AnimatePresence mode="wait">
        {tab === "ranking" ? (
          <motion.section
            key="ranking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ margin: "0 16px", background: "var(--celula-superficie)", borderRadius: 12, overflow: "hidden" }}
          >
            {ranking.map((m, idx) => {
              const destaque = m.id === meuId;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: idx * 0.03, duration: 0.3 }}
                  className={`celula-rank-row ${destaque ? "celula-rank-row-destaque" : ""}`}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "var(--celula-texto-secundario)", fontSize: 13, width: 16 }}>{idx + 1}</span>
                    <span style={{ fontSize: 17, fontWeight: destaque ? 600 : 400 }}>
                      {destaque ? "VOCÊ" : m.apelido || m.nome}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 17, color: "var(--celula-texto-secundario)" }}>
                      <Counter value={m.pontos} duration={600} />
                    </span>
                    <span className="celula-streak" style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                      <span style={{ fontSize: 12 }}>🔥</span>
                      <Counter value={m.streak} duration={400} />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.section>
        ) : (
          <motion.div
            key="arvore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Arvore celulaId={celulaId} meuId={meuId} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TabBtn({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        flex: 1,
        padding: "10px 0",
        border: "none",
        borderRadius: 10,
        cursor: "pointer",
        background: ativo ? "var(--celula-fundo)" : "transparent",
        color: ativo ? "var(--celula-acao)" : "var(--celula-texto-secundario)",
        fontWeight: ativo ? 600 : 400,
        fontSize: 14,
        transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}

type ArvoreNode = {
  id: string; nome: string; apelido: string | null;
  pontos: number; streak: number; isLideranca: boolean;
  filhos: ArvoreNode[]; nivel: number;
};

function Arvore({ celulaId, meuId }: { celulaId: string; meuId: string }) {
  const [data, setData] = useState<{ raizes: ArvoreNode[]; total: number; raizesCount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch(`/api/arvore?celulaId=${celulaId}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  });

  if (loading) {
    return (
      <div style={{ margin: "0 16px", background: "var(--celula-superficie)", borderRadius: 12, padding: 32, textAlign: "center" }}>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ color: "var(--celula-texto-secundario)", fontSize: 14 }}
        >
          Carregando árvore...
        </motion.div>
      </div>
    );
  }
  if (!data) {
    return <div style={{ padding: 32, textAlign: "center", color: "var(--celula-texto-secundario)" }}>Sem dados</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ margin: "0 16px" }}
    >
      <div style={{ marginBottom: 12, fontSize: 13, color: "var(--celula-texto-secundario)" }}>
        {data.total} pessoas · {data.raizesCount} raízes
      </div>
      <div style={{ background: "var(--celula-superficie)", borderRadius: 12, padding: 16 }}>
        {data.raizes.map((r, idx) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <TreeNode node={r} meuId={meuId} isRoot />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function TreeNode({ node, meuId, isRoot }: { node: ArvoreNode; meuId: string; isRoot?: boolean }) {
  const destaque = node.id === meuId;
  return (
    <div style={{ marginLeft: isRoot ? 0 : 20, position: "relative" }}>
      {!isRoot && (
        <div style={{ position: "absolute", left: -12, top: 0, bottom: 0, borderLeft: "1px solid var(--celula-divisor)" }} />
      )}
      <motion.div
        whileHover={{ x: 2 }}
        style={{
          padding: "8px 12px",
          marginBottom: 8,
          background: destaque ? "rgba(31, 107, 74, 0.06)" : "transparent",
          border: destaque ? "1px solid var(--celula-acao)" : "1px solid var(--celula-divisor)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--celula-texto-secundario)", width: 28 }}>
          {node.isLideranca ? "👑" : "●"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: destaque ? 600 : 400 }}>
            {destaque ? "VOCÊ" : (node.apelido || node.nome)}
          </div>
        </div>
        <div style={{ fontSize: 13, color: "var(--celula-texto-secundario)" }}>
          {node.pontos} pts
        </div>
      </motion.div>
      {node.filhos.length > 0 && (
        <div style={{ marginLeft: 4 }}>
          {node.filhos.map((f) => (
            <TreeNode key={f.id} node={f} meuId={meuId} />
          ))}
        </div>
      )}
    </div>
  );
}
