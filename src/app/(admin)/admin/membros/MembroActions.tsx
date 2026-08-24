"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MembroActions({
  id,
  status,
  isLideranca,
}: {
  id: string;
  status: string;
  isLideranca: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function patch(body: any, label: string) {
    setLoading(label);
    try {
      const resp = await fetch(`/api/admin/membros/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (resp.ok) router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {status === "pendente" && (
        <button
          onClick={() => patch({ status: "fechado" }, "aprovar")}
          disabled={loading !== null}
          style={{
            padding: "6px 12px",
            background: "var(--celula-acao)",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {loading === "aprovar" ? "..." : "Aprovar"}
        </button>
      )}
      {!isLideranca && status === "fechado" && (
        <button
          onClick={() => patch({ tipo: "lider" }, "promover")}
          disabled={loading !== null}
          style={{
            padding: "6px 12px",
            background: "transparent",
            color: "var(--celula-acao)",
            border: "1px solid var(--celula-acao)",
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {loading === "promover" ? "..." : "Promover"}
        </button>
      )}
      {isLideranca && (
        <button
          onClick={() => patch({ tipo: "cabo", isLideranca: false }, "rebaixar")}
          disabled={loading !== null}
          style={{
            padding: "6px 12px",
            background: "transparent",
            color: "var(--celula-texto-secundario)",
            border: "1px solid var(--celula-divisor)",
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {loading === "rebaixar" ? "..." : "Rebaixar"}
        </button>
      )}
      {status === "fechado" && (
        <button
          onClick={() => patch({ status: "inativo" }, "inativar")}
          disabled={loading !== null}
          style={{
            padding: "6px 12px",
            background: "transparent",
            color: "var(--celula-texto-secundario)",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {loading === "inativar" ? "..." : "Inativar"}
        </button>
      )}
    </div>
  );
}
