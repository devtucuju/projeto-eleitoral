"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const resp = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || "Erro no login");
        setLoading(false);
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Erro de conexão");
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--celula-fundo)" }}>
      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: 360 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8, color: "var(--celula-texto)" }}>
          Painel
        </h1>
        <p style={{ color: "var(--celula-texto-secundario)", fontSize: 14, marginBottom: 32 }}>
          Coordenação da campanha
        </p>

        <div style={{ marginBottom: 16 }}>
          <label className="celula-label">Email</label>
          <input
            className="celula-input"
            type="email"
            placeholder="coord@campanha.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label className="celula-label">Senha</label>
          <input
            className="celula-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div style={{ marginBottom: 16, padding: 12, background: "rgba(196, 92, 38, 0.08)", borderRadius: 12, color: "var(--celula-streak)", fontSize: 13 }}>
            {error}
          </div>
        )}

        <button className="celula-btn-primario" disabled={loading} type="submit">
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
