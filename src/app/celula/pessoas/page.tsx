"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const cidades = [
  "Macapá",
  "Santana",
  "Laranjal do Jari",
  "Oiapoque",
  "Amapá",
  "Calçoene",
  "Cutias",
  "Ferreira Gomes",
  "Itaubal",
  "Pedra Branca do Amapá",
  "Porto Grande",
  "Vitória do Jari",
];

export default function CadastroPessoaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    numeroTitulo: "",
    zona: "",
    secao: "",
    cidade: "",
    endereco: "",
    observacao: "",
  });

  function formatTelefone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function formatCPF(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }

  function set(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.nome.trim()) {
      setError("Nome é obrigatório");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const resp = await fetch("/api/pessoas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          telefone: form.telefone.replace(/\D/g, ""),
          cpf: form.cpf,
          numeroTitulo: form.numeroTitulo,
          zona: form.zona,
          secao: form.secao,
          cidade: form.cidade,
          endereco: form.endereco,
          observacao: form.observacao,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || "Erro ao cadastrar");
        setLoading(false);
        return;
      }

      setSucesso(true);
      setLoading(false);
    } catch {
      setError("Erro de conexão");
      setLoading(false);
    }
  }

  function limparFormulario() {
    setSucesso(false);
    setLoading(false);
    setError("");
    setForm({
      nome: "",
      telefone: "",
      cpf: "",
      numeroTitulo: "",
      zona: "",
      secao: "",
      cidade: "",
      endereco: "",
      observacao: "",
    });
  }

  if (sucesso) {
    return (
      <main
        className="celula-mobile"
        style={{ padding: "0 16px", display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            textAlign: "center",
            gap: 16,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--celula-acao)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>
              Cadastro realizado!
            </h2>
            <p style={{ marginTop: 8, color: "var(--celula-texto-secundario)", fontSize: 14 }}>
              Os dados foram salvos.
            </p>
          </div>
          <HapticButton
            onClick={limparFormulario}
            style={{ marginTop: 16 }}
          >
            Cadastrar outra
          </HapticButton>
          <button
            type="button"
            className="celula-link"
            onClick={() => router.push("/celula/auth")}
            style={{ marginTop: 8 }}
          >
            Ir para login
          </button>
        </motion.div>
      </main>
    );
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
          paddingTop: 40,
          paddingBottom: 24,
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
          Cadastre uma nova pessoa
        </motion.div>
      </motion.div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label className="celula-label">
            Nome <span style={{ color: "var(--celula-streak)" }}>*</span>
          </label>
          <input
            className="celula-input"
            type="text"
            placeholder="Nome completo"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="celula-label">Telefone</label>
          <input
            className="celula-input"
            type="tel"
            inputMode="numeric"
            placeholder="(96) 99999-9999"
            value={form.telefone}
            onChange={(e) => set("telefone", formatTelefone(e.target.value))}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="celula-label">CPF (opcional)</label>
          <input
            className="celula-input"
            type="text"
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={form.cpf}
            onChange={(e) => set("cpf", formatCPF(e.target.value))}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="celula-label">Número do Título</label>
          <input
            className="celula-input"
            type="text"
            inputMode="numeric"
            placeholder="Número do título"
            value={form.numeroTitulo}
            onChange={(e) => set("numeroTitulo", e.target.value)}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label className="celula-label">Zona</label>
            <input
              className="celula-input"
              type="text"
              inputMode="numeric"
              placeholder="Zona"
              value={form.zona}
              onChange={(e) => set("zona", e.target.value)}
            />
          </div>
          <div>
            <label className="celula-label">Seção</label>
            <input
              className="celula-input"
              type="text"
              inputMode="numeric"
              placeholder="Seção"
              value={form.secao}
              onChange={(e) => set("secao", e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="celula-label">Cidade</label>
          <select
            className="celula-input"
            value={form.cidade}
            onChange={(e) => set("cidade", e.target.value)}
          >
            <option value="">Selecione a cidade</option>
            {cidades.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="celula-label">Endereço (opcional)</label>
          <input
            className="celula-input"
            type="text"
            placeholder="Rua, número, bairro..."
            value={form.endereco}
            onChange={(e) => set("endereco", e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="celula-label">Observação (opcional)</label>
          <textarea
            className="celula-input"
            placeholder="Anotações..."
            rows={3}
            value={form.observacao}
            onChange={(e) => set("observacao", e.target.value)}
            style={{ resize: "vertical" }}
          />
        </div>

        {error && (
          <div
            style={{
              marginBottom: 12,
              padding: 12,
              background: "rgba(196, 92, 38, 0.08)",
              borderRadius: 12,
              color: "var(--celula-streak)",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
      </div>

      <div style={{ paddingBottom: 32 }}>
        <HapticButton onClick={handleSubmit} disabled={loading} hapticPattern={[15, 50]}>
          {loading ? "Salvando..." : "Cadastrar"}
        </HapticButton>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button
            type="button"
            className="celula-link"
            onClick={() => router.push("/celula/auth")}
          >
            Já tenho conta - fazer login
          </button>
        </div>
      </div>
    </main>
  );
}
