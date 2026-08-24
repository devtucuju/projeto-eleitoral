"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "@/components/motion/Toaster";
import { Checkmark } from "@/components/motion/Checkmark";

type Membro = {
  id: string; nome: string; apelido: string | null;
  telefone: string | null; tipo: string; status: string;
  isLideranca: boolean; pontos: number; streak: number;
  referencia: string | null; municipio: string;
  celulaId: string; createdAt: Date;
  celula: { id: string; nome: string; cidade: string };
};
type Celula = { id: string; nome: string; cidade: string; candidato: { nome: string } };
type Stats = { total: number; pendentes: number; inativos: number; lideres: number };

const PAGE_SIZE = 15;

export function MembrosClient({ membros, celulas, stats }: { membros: Membro[]; celulas: Celula[]; stats: Stats }) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "pendente" | "fechado" | "inativo">("todos");
  const [celulaFilter, setCelulaFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"pontos" | "streak" | "createdAt" | "nome">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Filtros
  const filtered = useMemo(() => {
    let list = membros;
    if (busca.trim()) {
      const q = busca.toLowerCase();
      list = list.filter((m) =>
        m.nome.toLowerCase().includes(q) ||
        (m.apelido?.toLowerCase().includes(q)) ||
        m.celula.nome.toLowerCase().includes(q) ||
        (m.telefone?.includes(q))
      );
    }
    if (statusFilter !== "todos") list = list.filter((m) => m.status === statusFilter);
    if (celulaFilter) list = list.filter((m) => m.celulaId === celulaFilter);
    // Sort
    list = [...list].sort((a, b) => {
      let av: any = a[sortBy]; let bv: any = b[sortBy];
      if (sortBy === "createdAt") { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [membros, busca, statusFilter, celulaFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  }

  async function patch(id: string, body: any, label: string, acaoNome: string) {
    setLoading(label);
    try {
      const resp = await fetch(`/api/admin/membros/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (resp.ok) {
        toast.success(acaoNome, { description: "Atualização salva" });
        router.refresh();
      } else {
        toast.error("Erro ao atualizar");
      }
    } finally { setLoading(null); }
  }

  async function bulkAprovar() {
    const pendentes = Array.from(selected).filter((id) => membros.find((m) => m.id === id)?.status === "pendente");
    if (!pendentes.length) return;
    setLoading("bulk");
    for (const id of pendentes) {
      await fetch(`/api/admin/membros/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "fechado" }),
      });
    }
    setSelected(new Set());
    setLoading(null);
    router.refresh();
  }

  return (
    <>
      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
        <StatCard label="Total" value={stats.total} color="brand" />
        <StatCard label="Pendentes" value={stats.pendentes} color="warning" pulse={stats.pendentes > 0} />
        <StatCard label="Líderes" value={stats.lideres} color="success" />
        <StatCard label="Inativos" value={stats.inativos} color="light" />
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por nome, apelido, bairro ou telefone..."
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPage(1); }}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
          className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="todos">Todos os status</option>
          <option value="pendente">⏳ Pendentes</option>
          <option value="fechado">✅ Fechados</option>
          <option value="inativo">💤 Inativos</option>
        </select>
        <select
          value={celulaFilter}
          onChange={(e) => { setCelulaFilter(e.target.value); setPage(1); }}
          className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="">Todas as células</option>
          {celulas.map((c) => (
            <option key={c.id} value={c.id}>{c.nome} ({c.cidade})</option>
          ))}
        </select>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm dark:border-brand-500/30 dark:bg-brand-500/10">
          <span className="text-brand-700 dark:text-brand-400">{selected.size} selecionado(s)</span>
          <button
            onClick={bulkAprovar}
            disabled={loading === "bulk"}
            className="rounded-md bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {loading === "bulk" ? "Aprovando..." : "Aprovar selecionados"}
          </button>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-200 dark:border-gray-700">
              <TableRow>
                <TableCell isHeader className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={pageData.length > 0 && pageData.every((m) => selected.has(m.id))}
                    onChange={(e) => {
                      const next = new Set(selected);
                      if (e.target.checked) pageData.forEach((m) => next.add(m.id));
                      else pageData.forEach((m) => next.delete(m.id));
                      setSelected(next);
                    }}
                  />
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button onClick={() => toggleSort("nome")} className="flex items-center gap-1">
                    Membro {sortBy === "nome" && (sortDir === "asc" ? "↑" : "↓")}
                  </button>
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Célula</TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</TableCell>
                <TableCell isHeader className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  <button onClick={() => toggleSort("pontos")} className="flex items-center gap-1 ml-auto">
                    Pontos {sortBy === "pontos" && (sortDir === "asc" ? "↑" : "↓")}
                  </button>
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  <button onClick={() => toggleSort("streak")} className="flex items-center gap-1 ml-auto">
                    Streak {sortBy === "streak" && (sortDir === "asc" ? "↑" : "↓")}
                  </button>
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell className="px-4 py-12 text-center text-gray-500" >
                    <div className="col-span-7">Nenhum membro encontrado com esses filtros</div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence>
                  {pageData.map((m, idx) => (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.02, duration: 0.2 }}
                      className="border-t border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                    >
                    <TableCell className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(m.id)}
                        onChange={(e) => {
                          const next = new Set(selected);
                          if (e.target.checked) next.add(m.id); else next.delete(m.id);
                          setSelected(next);
                        }}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar nome={m.nome} />
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white/90">
                            {m.nome}
                            {m.apelido && <span className="text-gray-400"> "{m.apelido}"</span>}
                          </div>
                          {m.telefone && (
                            <div className="text-xs text-gray-500">{m.telefone}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="text-sm text-gray-700 dark:text-gray-300">{m.celula.nome}</div>
                      <div className="text-xs text-gray-500">{m.celula.cidade}</div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {m.status === "pendente" && <Badge color="warning" size="sm">⏳ Pendente</Badge>}
                        {m.status === "fechado" && <Badge color="success" size="sm">✓ Fechado</Badge>}
                        {m.status === "inativo" && <Badge color="light" size="sm">💤 Inativo</Badge>}
                        {m.isLideranca && <Badge color="primary" size="sm">👑 Líder</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <span className="font-semibold text-gray-800 dark:text-white/90">{m.pontos}</span>
                      <span className="text-xs text-gray-400 ml-1">pts</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <span className="font-medium text-warning-600">🔥 {m.streak}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {m.status === "pendente" && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => patch(m.id, { status: "fechado" }, `${m.id}-aprovar`, `${m.nome} aprovado`)}
                            disabled={loading !== null}
                            className="rounded-md bg-success-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-success-600 disabled:opacity-50"
                          >
                            Aprovar
                          </motion.button>
                        )}
                        {!m.isLideranca && m.status === "fechado" && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => patch(m.id, { tipo: "lider" }, `${m.id}-promover`, `${m.nome} virou líder`)}
                            disabled={loading !== null}
                            className="rounded-md border border-brand-500 px-2.5 py-1 text-xs font-medium text-brand-500 hover:bg-brand-50 disabled:opacity-50"
                          >
                            Promover
                          </motion.button>
                        )}
                        {m.isLideranca && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => patch(m.id, { tipo: "cabo", isLideranca: false }, `${m.id}-rebaixar`, `${m.nome} rebaixado a cabo`)}
                            disabled={loading !== null}
                            className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Rebaixar
                          </motion.button>
                        )}
                        {m.status === "fechado" && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => patch(m.id, { status: "inativo" }, `${m.id}-inativar`, `${m.nome} inativado`)}
                            disabled={loading !== null}
                            className="rounded-md px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            Inativar
                          </motion.button>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
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

function StatCard({ label, value, color, pulse }: { label: string; value: number; color: "brand" | "success" | "warning" | "light"; pulse?: boolean }) {
  const colors = {
    brand: "text-brand-500 bg-brand-50",
    success: "text-success-600 bg-success-50",
    warning: "text-warning-600 bg-warning-50",
    light: "text-gray-600 bg-gray-100",
  };
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] ${pulse ? "ring-2 ring-warning-200" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
        {pulse && <span className="flex h-2 w-2 rounded-full bg-warning-500 animate-pulse" />}
      </div>
      <div className={`mt-2 text-2xl font-bold ${colors[color].split(" ")[0]}`}>{value}</div>
    </div>
  );
}

function Avatar({ nome }: { nome: string }) {
  const initials = nome.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const cores = ["bg-brand-100 text-brand-600", "bg-success-100 text-success-700", "bg-warning-100 text-warning-700", "bg-blue-light-100 text-blue-light-700"];
  const cor = cores[nome.charCodeAt(0) % cores.length];
  return (
    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${cor}`}>
      {initials}
    </div>
  );
}
