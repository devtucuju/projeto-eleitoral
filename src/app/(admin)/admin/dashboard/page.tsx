import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    totalMembros, membrosPendentes, membrosAtivos, membrosInativos,
    conversasHoje, conversasConfirmadas, conversasTotal, celulas,
    topCelulas, ultimasConversas,
  ] = await Promise.all([
    prisma.membro.count(),
    prisma.membro.count({ where: { status: "pendente" } }),
    prisma.membro.count({ where: { status: "fechado" } }),
    prisma.membro.count({ where: { status: "inativo" } }),
    (() => {
      const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
      return prisma.conversa.count({ where: { createdAt: { gte: hoje } } });
    })(),
    prisma.conversa.count({ where: { confirmada: true } }),
    prisma.conversa.count(),
    prisma.celula.count(),
    prisma.celula.findMany({
      include: { _count: { select: { membros: true } }, membros: { select: { pontos: true } } },
    }),
    prisma.conversa.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { membro: { select: { nome: true } } },
    }),
  ]);

  const celulasComStats = topCelulas
    .map((c) => ({ id: c.id, nome: c.nome, membros: c._count.membros, pontos: c.membros.reduce((s, m) => s + m.pontos, 0) }))
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 5);

  const taxaConfirmacao = conversasTotal > 0 ? Math.round((conversasConfirmadas / conversasTotal) * 100) : 0;
  return { totalMembros, membrosPendentes, membrosAtivos, membrosInativos, conversasHoje, conversasConfirmadas, conversasTotal, celulas, taxaConfirmacao, celulasComStats, ultimasConversas };
}

export default async function AdminDashboard() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");
  const stats = await getStats();

  return (
    <div className="p-4 md:p-6">
      {/* Breadcrumb / Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Olá, {admin.nome}</p>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7 lg:gap-4">
        <KpiCard label="Membros ativos" value={stats.membrosAtivos} icon="✅" color="success" />
        <KpiCard label="Pendentes" value={stats.membrosPendentes} icon="⏳" color="warning" pulse={stats.membrosPendentes > 0} />
        <KpiCard label="Inativos" value={stats.membrosInativos} icon="💤" color="light" />
        <KpiCard label="Conversas hoje" value={stats.conversasHoje} icon="💬" color="brand" />
        <KpiCard label="Conversas total" value={stats.conversasTotal} icon="📊" color="info" />
        <KpiCard label="Confirmadas" value={stats.conversasConfirmadas} icon="✓" color="success" />
        <KpiCard label="Taxa confirmação" value={`${stats.taxaConfirmacao}%`} icon="🎯" color="brand" />
      </div>

      {/* Pendentes alert */}
      {stats.membrosPendentes > 0 && (
        <Link
          href="/admin/membros"
          className="mb-6 flex items-center justify-between rounded-xl border border-warning-200 bg-warning-50 p-4 hover:bg-warning-100 dark:border-warning-500/30 dark:bg-warning-500/10"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-500 text-white">⏳</span>
            <div>
              <div className="font-semibold text-warning-900 dark:text-warning-300">
                {stats.membrosPendentes} cabo(s) aguardando aprovação
              </div>
              <div className="text-xs text-warning-700 dark:text-warning-400">Clique para revisar e liberar</div>
            </div>
          </div>
          <span className="text-warning-700">→</span>
        </Link>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Top células */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-2 lg:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Top 5 células por pontos</h2>
            <Link href="/admin/celulas" className="text-xs text-brand-500 hover:underline">Ver todas →</Link>
          </div>
          {stats.celulasComStats.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">Nenhuma célula cadastrada</div>
          ) : (
            <div className="space-y-2">
              {stats.celulasComStats.map((c, idx) => {
                const max = Math.max(...stats.celulasComStats.map((x) => x.pontos));
                const pct = max > 0 ? (c.pontos / max) * 100 : 0;
                return (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-medium text-gray-400">{idx + 1}º</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-800 dark:text-white/90">{c.nome}</span>
                        <span className="font-semibold text-brand-500">{c.pontos} pts</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">{c.membros} membros</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Últimas conversas */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Atividade recente</h2>
          {stats.ultimasConversas.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">Nenhuma conversa ainda</div>
          ) : (
            <div className="space-y-3">
              {stats.ultimasConversas.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${c.confirmada ? "bg-success-500" : "bg-warning-500"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                      {c.nomeEleitor || "Conversa sem nome"}
                    </div>
                    <div className="truncate text-xs text-gray-500">
                      por {c.membro.nome}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links mobile-friendly */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:hidden">
        <QuickLink href="/admin/membros" label="Membros" icon="👥" />
        <QuickLink href="/admin/missoes" label="Missões" icon="🎯" />
        <QuickLink href="/admin/celulas" label="Células" icon="🏘️" />
        <QuickLink href="/admin/exportar" label="Exportar" icon="⬇️" />
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon, color, pulse }: { label: string; value: string | number; icon: string; color: "brand" | "success" | "warning" | "info" | "light"; pulse?: boolean }) {
  const colorMap = {
    brand: "text-brand-500",
    success: "text-success-600",
    warning: "text-warning-600",
    info: "text-blue-light-500",
    light: "text-gray-500",
  };
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] lg:p-4 ${pulse ? "ring-2 ring-warning-200 dark:ring-warning-500/30" : ""}`}>
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-400 lg:text-xs">
        <span className="text-sm lg:text-base">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <div className={`mt-1.5 text-xl font-bold lg:text-2xl ${colorMap[color]}`}>{value}</div>
    </div>
  );
}

function QuickLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  );
}
