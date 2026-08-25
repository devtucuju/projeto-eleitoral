"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

type Pessoa = {
  id: string;
  nome: string;
  telefone: string | null;
  cpf: string | null;
  numeroTitulo: string | null;
  zona: string | null;
  secao: string | null;
  cidade: string | null;
  endereco: string | null;
  observacao: string | null;
  createdAt: Date | string;
  conversaCount?: number;
  conversas?: Array<{
    id: string;
    createdAt: Date | string;
    interesse: string;
    membro?: { nome: string };
  }>;
};

const PAGE_SIZE = 15;

export function PessoasClient({ pessoas, totalConversas }: { pessoas: Pessoa[]; totalConversas: number }) {
  const [busca, setBusca] = useState("");
  const [cidadeFilter, setCidadeFilter] = useState("");
  const [page, setPage] = useState(1);

  const cidades = useMemo(() => {
    const set = new Set(pessoas.map((p) => p.cidade).filter(Boolean));
    return Array.from(set).sort();
  }, [pessoas]);

  const filtered = useMemo(() => {
    let list = [...pessoas];
    if (busca.trim()) {
      const q = busca.toLowerCase();
      list = list.filter((p) =>
        p.nome.toLowerCase().includes(q) ||
        (p.telefone?.includes(q)) ||
        (p.cpf?.includes(q)) ||
        (p.numeroTitulo?.includes(q)) ||
        (p.endereco?.toLowerCase().includes(q))
      );
    }
    if (cidadeFilter) {
      list = list.filter((p) => p.cidade === cidadeFilter);
    }
    return list;
  }, [pessoas, busca, cidadeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
        <StatCard label="Total Pessoas" value={pessoas.length} color="brand" />
        <StatCard label="Com Telefone" value={pessoas.filter((p) => p.telefone).length} color="success" />
        <StatCard label="Com Título" value={pessoas.filter((p) => p.numeroTitulo).length} color="primary" />
        <StatCard label="Conversas" value={totalConversas} color="warning" />
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por nome, telefone, CPF ou título..."
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPage(1); }}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
        <select
          value={cidadeFilter}
          onChange={(e) => { setCidadeFilter(e.target.value); setPage(1); }}
          className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="">Todas as cidades</option>
          {cidades.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-200 dark:border-gray-700">
              <TableRow>
                <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nome
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Telefone
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Título
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Zona/Seção
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cidade
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Conversas
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell className="px-4 py-12 text-center text-gray-500">
                    <div className="col-span-6">Nenhuma pessoa encontrada com esses filtros</div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence>
                  {pageData.map((p, idx) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.02, duration: 0.2 }}
                      className="border-t border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                    >
                      <TableCell className="px-4 py-3">
                        <div className="font-medium text-gray-800 dark:text-white/90">{p.nome}</div>
                        {p.observacao && (
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-xs" title={p.observacao}>
                            📝 {p.observacao}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {p.telefone ? formatTelefone(p.telefone) : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {p.numeroTitulo || "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {p.zona ? `${p.zona}/${p.secao || "—"}` : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {p.cidade || "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        {p.conversaCount && p.conversaCount > 0 ? (
                          <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700">
                            {p.conversaCount}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col gap-2 border-t border-gray-200 px-4 py-3 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-500">
              Mostrando {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                ← Anterior
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[36px] rounded-md px-3 py-1.5 text-sm ${page === p ? "bg-brand-500 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Próxima →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function formatTelefone(tel: string): string {
  const digits = tel.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return tel;
}

function StatCard({ label, value, color }: { label: string; value: number; color: "brand" | "success" | "primary" | "warning" | "light" }) {
  const colors = {
    brand: "text-brand-500 bg-brand-50",
    success: "text-success-600 bg-success-50",
    primary: "text-blue-600 bg-blue-50",
    warning: "text-warning-600 bg-warning-50",
    light: "text-gray-600 bg-gray-100",
  };
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
      </div>
      <div className={`mt-2 text-2xl font-bold ${colors[color].split(" ")[0]}`}>{value}</div>
    </div>
  );
}
